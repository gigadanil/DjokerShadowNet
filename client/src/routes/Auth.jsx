import { Lock, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function Auth() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center px-6 py-12 sm:px-8">
        <div className="grid w-full gap-12 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-card rounded-[2rem] border border-white/10 p-10 shadow-panel">
            <span className="inline-flex rounded-full bg-violet-500/10 px-4 py-2 text-sm text-violet-200">Вход в Shadow Net</span>
            <h1 className="mt-6 text-4xl font-semibold text-white">Авторизация</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">Войдите в свой кабинет по email и паролю или используйте вход через Telegram.</p>
            <form className="mt-10 space-y-6">
              <label className="block text-sm font-medium text-slate-300">
                Email
                <div className="mt-2 relative rounded-3xl border border-white/10 bg-[#11111b]/90 px-4 py-3 focus-within:border-violet-400/70">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-300/80" />
                  <input type="email" placeholder="you@example.com" className="w-full bg-transparent pl-11 text-white outline-none" />
                </div>
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Пароль
                <div className="mt-2 relative rounded-3xl border border-white/10 bg-[#11111b]/90 px-4 py-3 focus-within:border-violet-400/70">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-300/80" />
                  <input type="password" placeholder="••••••••" className="w-full bg-transparent pl-11 text-white outline-none" />
                </div>
              </label>
              <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-glow px-6 py-3 text-sm font-semibold uppercase text-surface transition hover:bg-violet-400/90">
                Войти в кабинет
              </button>
            </form>
            <div className="mt-8 rounded-3xl border border-white/10 bg-[#0f0f19]/80 p-6 text-center">
              <p className="text-sm text-slate-400">Или авторизуйтесь через Telegram для быстрого доступа</p>
              <button className="mt-4 inline-flex items-center justify-center rounded-full border border-violet-500/40 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                <MessageCircle className="mr-2 h-4 w-4" />
                Telegram Login
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-6 rounded-[2rem] border border-white/10 bg-[#0c0c16]/80 p-10 shadow-panel">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-white">Твой доступ к Shadow Net</h2>
              <p className="text-slate-300">Один аккаунт — любой туннель. Поддержка WireGuard, VLESS, Socks5 и Amnezia.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Скорость</p>
                <p className="mt-3 text-2xl font-semibold text-white">1 Гбит/с+</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Доступ</p>
                <p className="mt-3 text-2xl font-semibold text-white">без ограничений</p>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#11111b]/90 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-violet-300/80">Быстрый старт</p>
              <p className="mt-3 text-base leading-7 text-slate-300">После регистрации вы получите детальную инструкцию и мгновенный ключ для подключения на любом устройстве.</p>
            </div>
            <p className="text-sm text-slate-500">Нет аккаунта? <Link to="/" className="text-violet-300 underline">Вернуться на главную</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
