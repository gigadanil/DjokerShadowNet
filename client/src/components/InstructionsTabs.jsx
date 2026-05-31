import { useState } from 'react';

const tabs = [
  {
    key: 'windows',
    label: 'Windows',
    steps: [
      'Скачайте приложение Shadow Net для Windows.',
      'Откройте приложение и выберите «Добавить новый профиль».',
      'Вставьте скопированный ключ в поле конфигурации.',
      'Нажмите «Сохранить» и подключитесь к серверу.',
    ],
  },
  {
    key: 'android',
    label: 'Android',
    steps: [
      'Установите приложение из Google Play.',
      'Откройте приложение и выберите «Импорт профиля».',
      'Вставьте ключ или отсканируйте QR-код.',
      'Запустите подключение и наслаждайтесь свободным интернетом.',
    ],
  },
  {
    key: 'ios',
    label: 'iOS',
    steps: [
      'Скачайте приложение Shadow Net из App Store.',
      'Добавьте новый маршрут через кнопку «+».',
      'Вставьте ключ и подтвердите настройки.',
      'Включите подключение в главном меню.',
    ],
  },
  {
    key: 'macos',
    label: 'macOS',
    steps: [
      'Скачайте macOS-версию клиента с официального сайта.',
      'Откройте приложение и создайте новый профиль.',
      'Вставьте ключ конфигурации в поле.',
      'Сохраните изменения и подключитесь к серверу.',
    ],
  },
];

function InstructionsTabs() {
  const [active, setActive] = useState('windows');
  const current = tabs.find((tab) => tab.key === active);

  return (
    <div id="instructions" className="glass-card rounded-[2rem] border border-white/10 p-8 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-violet-300/80">Инструкции</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Подключение по устройствам</h3>
        </div>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#11111b]/95 p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${active === tab.key ? 'bg-violet-500/15 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-[#0c0c16]/95 p-6">
          <p className="text-sm text-slate-400">{current.label}</p>
          <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
            {current.steps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/15 text-sm text-violet-200">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default InstructionsTabs;
