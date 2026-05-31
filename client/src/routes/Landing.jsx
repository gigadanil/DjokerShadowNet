import { ArrowRight, ShieldCheck, Sparkles, Globe2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import PricingCard from '../components/PricingCard';

const features = [
  { icon: ShieldCheck, title: 'Абсолютная анонимность', description: 'Твой трафик под защитой, без логов и без слежки.' },
  { icon: Globe2, title: 'Обход блокировок', description: 'Работает с РКН, VPN, DPI и любыми ограничениями.' },
  { icon: Sparkles, title: 'Высокая скорость', description: 'Оптимизированные серверы для быстрой и стабильной работы.' },
  { icon: Shield, title: 'Поддержка 24/7', description: 'Техподдержка на связи в любое время дня и ночи.' },
];

const pricing = [
  { title: '1 месяц', price: '299₽', note: '3.3$', description: 'Стартовый доступ', featured: false },
  { title: '3 месяца', price: '699₽', note: '7.7$', description: 'Выбор профессионалов', featured: true },
  { title: '6 месяцев', price: '1199₽', note: '13.2$', description: 'Оптимальный тариф', featured: false },
  { title: '1 год', price: '1999₽', note: '22.0$', description: 'Максимальная выгода', featured: false },
];

function Landing() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(138,57,255,0.16),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(34,255,180,0.12),_transparent_18%)] pointer-events-none" />
      <Header />
      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-8">
        <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 backdrop-blur-sm">
              Djoker: Shadow Net — киберпанк VPN нового уровня
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Твоя личная теневая сеть. Свободный интернет без блокировок.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-300">
                Самые свежие обходные маршруты, надежная защита и гибкие тарифы для любого устройства. Подключайся к Shadow Net и управляй своим цифровым пространством.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="#pricing" className="inline-flex items-center justify-center rounded-full bg-glow px-6 py-3 text-sm font-semibold uppercase tracking-wide text-surface transition hover:-translate-y-0.5 hover:bg-violet-400/90">
                Подключить сейчас
                <ArrowRight className="ml-3 h-4 w-4" />
              </a>
              <Link to="/auth" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-violet-400 hover:bg-white/10">
                Личный кабинет
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="glass-card relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-violet-500/10 p-8 shadow-panel">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(138,57,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(34,255,180,0.14),transparent_25%)]" />
              <div className="relative grid gap-6">
                <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-surface/80 p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-violet-300/80">Shield AI</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">Shadow Defense</h2>
                  </div>
                  <div className="rounded-full bg-violet-500/10 p-4 text-violet-300">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>
                <div className="space-y-3 rounded-3xl border border-white/10 bg-[#0c0c16]/90 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.2em] text-slate-400">Online</span>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300"> Активно </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Скорость</p>
                      <p className="mt-2 text-xl font-semibold text-white">1.2 Гбит/с</p>
                    </div>
                    <div className="rounded-3xl bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Серверы</p>
                      <p className="mt-2 text-xl font-semibold text-white">12 стран</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.75rem] bg-[#11111b]/90 p-6 text-center">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Радар защиты</p>
                  <div className="mt-6 mx-auto h-44 w-44 rounded-full border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-transparent to-surface/0 shadow-glow">
                    <div className="absolute inset-0 m-auto h-28 w-28 rounded-full bg-[radial-gradient(circle,_rgba(138,57,255,0.28),transparent_60%)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </section>

        <section id="pricing" className="mt-24 space-y-10">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300/80">Тарифы</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Выбери план, который ведёт тебя дальше.</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">Удобные тарифы для коротких экспериментов и долгого безопасного доступа к глобальному интернету.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {pricing.map((plan) => (
              <PricingCard key={plan.title} plan={plan} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
