function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface/95 px-6 py-8 text-slate-300 backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-300">Shadow Net</p>
          <p className="mt-3 max-w-xl text-sm text-slate-400">Премиальный VPN сервис c современным дизайном и стабильной защитой.</p>
        </div>
        <div className="grid gap-3 sm:inline-flex sm:items-center">
          <a href="#" className="text-sm text-slate-300 hover:text-white">Telegram-бот</a>
          <a href="#" className="text-sm text-slate-300 hover:text-white">Новостной канал</a>
          <a href="#" className="text-sm text-slate-300 hover:text-white">Саппорт</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
