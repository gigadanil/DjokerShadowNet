require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET || 'vpn_secret';
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || '';
const xuiApiUrl = process.env.XUI_API_URL?.replace(/\/$/, '') || '';
const xuiApiKey = process.env.XUI_API_KEY || '';
const xuiApiUserPath = process.env.XUI_API_USER_PATH || '/api/v1/get-user';
const vpnName = process.env.VPN_NAME || 'Djoker: Shadow Net';
const vpnServerHost = process.env.VPN_SERVER_HOST || '213.165.38.205';
const vpnServerPort = process.env.VPN_SERVER_PORT || '2053';
const vpnProtocol = process.env.VPN_PROTOCOL || 'wireguard';

app.locals.vpnName = vpnName;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const jwtSecret = process.env.JWT_SECRET || 'change_this_jwt_secret';
let mailTransporter = null;

async function getMailTransporter() {
  if (mailTransporter) {
    return mailTransporter;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';

  if (host && user && pass) {
    mailTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    });
    return mailTransporter;
  }

  const testAccount = await nodemailer.createTestAccount();
  mailTransporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass }
  });
  console.warn('SMTP не настроен. Используется ethereal тестовый транспорт. Ссылку на письмо можно будет увидеть в консоли.');
  return mailTransporter;
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOtpEmail(email, code) {
  const transporter = await getMailTransporter();
  const from = process.env.EMAIL_FROM || 'Djoker: Shadow Net <no-reply@djoker-shadow.net>';
  const subject = 'Ваш код доступа Djoker: Shadow Net';
  const html = `
    <div style="background:#05050b;color:#e6e6ff;font-family:Arial,sans-serif;padding:32px;">
      <div style="max-width:600px;margin:0 auto;border:1px solid rgba(138,57,255,0.25);border-radius:24px;background:#090912;padding:32px;">
        <h1 style="margin:0 0 16px;color:#9c80ff;font-size:28px">Djoker: Shadow Net</h1>
        <p style="margin:0 0 24px;color:#a6a6d1;font-size:16px;line-height:1.5;">Ваш одноразовый код для входа. Введите его в форме на сайте в течение 5 минут.</p>
        <div style="margin:0 auto 24px;padding:24px;border-radius:24px;background:rgba(138,57,255,0.12);text-align:center;box-shadow:0 0 40px rgba(138,57,255,0.18);">
          <span style="display:inline-block;font-size:48px;letter-spacing:12px;color:#ffffff;font-weight:700;">${code}</span>
        </div>
        <p style="margin:0;color:#8fa0ff;font-size:14px;line-height:1.6;">Если вы не запрашивали код, проигнорируйте это письмо.</p>
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from,
    to: email,
    subject,
    html
  });

  if (info.messageId) {
    console.log(`OTP sent to ${email}`);
  }
  if (nodemailer.getTestMessageUrl(info)) {
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  }
}

function signToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    return null;
  }
}

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

function apiRequireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) {
    return res.status(401).json({ error: 'Токен не передан' });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Токен недействителен' });
  }
  req.user = payload;
  next();
}

app.post('/api/auth/send-code', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: 'Недействительный Email' });
    }

    const code = generateCode();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    db.run(
      'INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?) ON CONFLICT(email) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at',
      [email, code, expiresAt],
      async (err) => {
        if (err) {
          console.error('OTP save error', err);
          return res.status(500).json({ error: 'Не удалось сохранить код' });
        }
        try {
          await sendOtpEmail(email, code);
          res.json({ success: true });
        } catch (sendErr) {
          console.error('OTP email error', sendErr);
          res.status(500).json({ error: 'Не удалось отправить письмо. Проверьте настройки SMTP.' });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Серверная ошибка' });
  }
});

app.post('/api/auth/verify-code', (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const code = String(req.body.code || '').trim();
    if (!email || !code || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: 'Неверный код или Email' });
    }

    db.get('SELECT * FROM otp_codes WHERE email = ?', [email], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Ошибка проверки кода' });
      }
      if (!row || row.code !== code || row.expires_at < Date.now()) {
        return res.status(400).json({ error: 'Код неверный или истёк' });
      }
      db.run('DELETE FROM otp_codes WHERE email = ?', [email], (deleteErr) => {
        if (deleteErr) {
          console.error('Ошибка удаления OTP', deleteErr);
        }
        db.get('SELECT * FROM users WHERE username = ?', [email], (userErr, user) => {
          if (userErr) {
            console.error(userErr);
            return res.status(500).json({ error: 'Ошибка работы с пользователем' });
          }
          const generateAndSendToken = (userData) => {
            const token = signToken({ id: userData.id, email: userData.username });
            res.json({ success: true, token, user: { email: userData.username, vpn_key: userData.vpn_key } });
          };

          if (user) {
            if (!user.vpn_key) {
              const vpnKey = crypto.randomBytes(16).toString('hex');
              db.run('UPDATE users SET vpn_key = ? WHERE id = ?', [vpnKey, user.id], (updateErr) => {
                if (updateErr) {
                  console.error(updateErr);
                  return res.status(500).json({ error: 'Ошибка обновления ключа' });
                }
                user.vpn_key = vpnKey;
                generateAndSendToken(user);
              });
            } else {
              generateAndSendToken(user);
            }
            return;
          }

          const vpnKey = crypto.randomBytes(16).toString('hex');
          db.run(
            'INSERT INTO users (username, password_hash, vpn_key) VALUES (?, NULL, ?)',
            [email, vpnKey],
            function (insertErr) {
              if (insertErr) {
                console.error(insertErr);
                return res.status(500).json({ error: 'Ошибка создания пользователя' });
              }
              generateAndSendToken({ id: this.lastID, username: email, vpn_key: vpnKey });
            }
          );
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Серверная ошибка' });
  }
});

app.get('/api/auth/me', apiRequireAuth, (req, res) => {
  db.get('SELECT id, username, vpn_key FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка получения данных пользователя' });
    }
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json({ user: { email: user.username, vpn_key: user.vpn_key } });
  });
});

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.vpnName = vpnName;
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('register', { error: 'Введите логин и пароль.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const vpnKey = crypto.randomBytes(16).toString('hex');
    db.run(
      'INSERT INTO users (username, password_hash, vpn_key) VALUES (?, ?, ?)',
      [username, passwordHash, vpnKey],
      function (err) {
        if (err) {
          return res.render('register', { error: 'Пользователь уже существует или ошибка базы.' });
        }
        req.session.userId = this.lastID;
        req.session.user = { id: this.lastID, username, telegram_username: null, vpn_key: vpnKey };
        res.redirect('/dashboard');
      }
    );
  } catch (err) {
    res.render('register', { error: 'Ошибка при регистрации.' });
  }
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('login', { error: 'Введите логин и пароль.' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      return res.render('login', { error: 'Неверные логин или пароль.' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.render('login', { error: 'Неверные логин или пароль.' });
    }
    req.session.userId = user.id;
    req.session.user = user;
    res.redirect('/dashboard');
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/dashboard-old', requireAuth, (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.session.userId], (err, user) => {
    if (err || !user) {
      return res.redirect('/logout');
    }
    req.session.user = user;
    res.render('dashboard', { user, vpnName, vpnServerHost, vpnServerPort, vpnProtocol });
  });
});

const telegramBotName = process.env.TELEGRAM_BOT_NAME || 'YourBotName';

async function getXuiUserInfo(username) {
  if (!xuiApiUrl || !xuiApiKey) {
    throw new Error('3X-UI API не настроен. Установите XUI_API_URL и XUI_API_KEY.');
  }
  const url = `${xuiApiUrl}${xuiApiUserPath}?username=${encodeURIComponent(username)}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${xuiApiKey}`,
      Accept: 'application/json'
    }
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`3X-UI API вернул ${response.status}: ${body}`);
  }
  return response.json();
}

app.get('/vpn', requireAuth, async (req, res) => {
  let xuiInfo = null;
  let error = null;
  try {
    xuiInfo = await getXuiUserInfo(req.session.user.username);
  } catch (err) {
    error = err.message;
  }
  res.render('vpn-status', {
    user: req.session.user,
    xuiInfo,
    error,
    vpnName,
    vpnServerHost,
    vpnServerPort,
    vpnProtocol
  });
});

app.get('/telegram', requireAuth, (req, res) => {
  res.render('tg-sync', { user: req.session.user, botName: telegramBotName, error: null });
});

function verifyTelegramAuth(data) {
  if (!telegramBotToken) return false;

  const secret = crypto.createHash('sha256').update(telegramBotToken).digest();
  const checkString = Object.keys(data)
    .filter((key) => key !== 'hash')
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('\n');

  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
  return hmac === data.hash;
}

app.get('/auth/telegram', requireAuth, (req, res) => {
  const tg = req.query;
  if (!tg || !tg.hash || !tg.id || !tg.username) {
    return res.render('tg-sync', { user: req.session.user, botName: telegramBotName, error: 'Ошибка Telegram авторизации.' });
  }

  if (!verifyTelegramAuth(tg)) {
    return res.render('tg-sync', { user: req.session.user, botName: telegramBotName, error: 'Неверная подпись Telegram.' });
  }

  db.run(
    'UPDATE users SET telegram_id = ?, telegram_username = ? WHERE id = ?',
    [tg.id, tg.username, req.session.userId],
    (err) => {
      if (err) {
        return res.render('tg-sync', { user: req.session.user, botName: telegramBotName, error: 'Не удалось сохранить данные Telegram.' });
      }
      req.session.user.telegram_id = tg.id;
      req.session.user.telegram_username = tg.username;
      res.redirect('/dashboard');
    }
  );
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Сервер запущен: http://localhost:${port}`);
});
