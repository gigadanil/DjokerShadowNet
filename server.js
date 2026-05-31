require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
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
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

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
