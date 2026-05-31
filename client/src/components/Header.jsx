import { Link, NavLink } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const nav = [
  { name: 'Главная', href: '/' },
  { name: 'Тарифы', href: '/#pricing' },
  { name: 'Инструкции', href: '/#instructions' },
];

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-surface/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link to="/" className="inline-flex items-center gap-3 text-white">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300 shadow-glow">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] uppercase text-violet-300">Djoker</p>
            <p className="text-xs text-slate-400">Shadow Net</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a key={item.name} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
              {item.name}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <NavLink to="/auth" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-violet-400 hover:bg-white/10">
            Личный кабинет
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
