import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, ShieldCheck, CreditCard, Copy, ExternalLink, LogOut } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import ServerCard from '../components/ServerCard';
import KeyGenerator from '../components/KeyGenerator';
import InstructionsTabs from '../components/InstructionsTabs';
import { clearToken, getToken } from '../utils/auth';

const servers = [
  { name: 'EU Shadow Hub', location: 'Нидерланды', load: '12% занято' },
  { name: 'US Cyber Gate', location: 'США', load: '8% занято' },
  { name: 'Asia Reactor', location: 'Япония', load: '6% занято' },
];

function Dashboard() {
  const navigate = useNavigate();
  const [selectedServer, setSelectedServer] = useState(servers[0]);
  const [userEmail, setUserEmail] = useState('');
  const [vpnKey, setVpnKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const statusProps = useMemo(() => ({ active: true, expire: '12 июня 2026' }), []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/auth');
      return;
    }
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) {
          clearToken();
          navigate('/auth');
          return;
        }
        const data = await res.json();
        setUserEmail(data.user.email);
        setVpnKey(data.user.vpn_key);
      })
      .catch(() => {
        clearToken();
        navigate('/auth');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    clearToken();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface px-6 py-24 text-center text-white">
        <div className="mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/5 text-violet-300 shadow-glow">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-400/30 border-t-transparent" />
        </div>
        <p className="mt-6 text-lg">Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <div className="flex items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-[#070712]/90 p-6 shadow-panel">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-violet-300/80">Добро пожаловать</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{userEmail || 'Пользователь'}</h1>
            <p className="mt-2 text-sm text-slate-400">Вы вошли в личный кабинет Djoker: Shadow Net.</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-violet-400 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 text-violet-300" />
            Выйти
          </button>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <aside className="glass-card rounded-[2rem] border border-white/10 p-8 shadow-panel">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-300">
                <LayoutGrid className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-slate-400">Кабинет</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Личный кабинет</h2>
              </div>
            </div>
            <nav className="mt-8 space-y-4 text-sm text-slate-300">
              {['Профиль', 'Мои ключи', 'Инструкции', 'Поддержка'].map((item) => (
                <button key={item} className="flex w-full items-center justify-between rounded-3xl px-5 py-4 text-left transition hover:bg-white/5 hover:text-white">
                  <span>{item}</span>
                  <ExternalLink className="h-4 w-4 text-violet-300" />
                </button>
              ))}
            </nav>
          </aside>

          <section className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
              <div className="glass-card rounded-[2rem] border border-white/10 p-8 shadow-panel">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-violet-300/80">Статус подписки</p>
                    <h3 className="mt-3 text-3xl font-semibold text-white">Shadow Pro</h3>
                  </div>
                  <StatusBadge active={statusProps.active} expire={statusProps.expire} />
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-[#11111b]/90 p-6">
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="mt-3 text-xl font-semibold text-white">{userEmail}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-[#11111b]/90 p-6">
                    <p className="text-sm text-slate-400">Трафик в месяц</p>
                    <p className="mt-3 text-3xl font-semibold text-white">Неограничено</p>
                  </div>
                </div>
                <button className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-glow px-6 py-3 text-sm font-semibold uppercase text-surface transition hover:bg-violet-400/90">
                  <CreditCard className="h-4 w-4" />
                  Оплатить / продлить
                </button>
              </div>
              <div className="glass-card rounded-[2rem] border border-white/10 p-8 shadow-panel">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-violet-300/80">Мои ключи</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Текущий ключ</h3>
                  </div>
                  <div className="rounded-3xl bg-white/5 px-4 py-2 text-sm text-slate-200">VLESS</div>
                </div>
                <div className="mt-6 space-y-4 rounded-3xl bg-[#0f0f19]/90 p-5 text-slate-300">
                  <p className="text-sm">Ваш активный ключ:</p>
                  <p className="rounded-3xl border border-white/10 bg-[#12121e]/90 px-4 py-3 font-mono text-sm text-white break-words">{vpnKey || 'Генерация...'}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(vpnKey)}
                    className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/15"
                  >
                    <Copy className="h-4 w-4" />
                    Скопировать ключ
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[2rem] border border-white/10 p-8 shadow-panel">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-violet-300/80">Мои подключения</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Выберите сервер</h3>
                </div>
                <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">Режим: авто</span>
              </div>
              <div className="mt-6 grid gap-4">
                {servers.map((server) => (
                  <ServerCard key={server.name} server={server} active={server.name === selectedServer.name} onSelect={() => setSelectedServer(server)} />
                ))}
              </div>
            </div>

            <KeyGenerator />
            <InstructionsTabs />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
