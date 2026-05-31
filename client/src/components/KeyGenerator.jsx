import { useMemo, useState } from 'react';
import { Copy, QrCode } from 'lucide-react';

function KeyGenerator() {
  const [copied, setCopied] = useState(false);
  const keyText = useMemo(
    () => 'vmess://djoker_shadow_net_0x92a5fef241c3a1fb4e7',
    []
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(keyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="glass-card rounded-[2rem] border border-white/10 p-8 shadow-panel">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-violet-300/80">Генерация ключей</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Создать новый конфиг</h3>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-glow px-5 py-3 text-sm font-semibold uppercase text-surface transition hover:bg-violet-400/90">
          <QrCode className="h-4 w-4" />
          Сгенерировать новый ключ
        </button>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#0d0d16]/95 p-6">
          <p className="text-sm text-slate-400">Ваш конфиг VLESS / Amnezia</p>
          <pre className="mt-4 rounded-3xl border border-white/10 bg-[#11111b]/90 p-5 text-sm text-slate-200 shadow-inner overflow-x-auto">{keyText}</pre>
          <button onClick={handleCopy} className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-500/15 px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/25">
            <Copy className="h-4 w-4" />
            {copied ? 'Скопировано' : 'Скопировать в буфер'}
          </button>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-[#11111b]/95 p-6 text-center">
          <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-3xl border border-violet-500/20 bg-[#09090f]/90">
            <div className="h-40 w-40 rounded-2xl bg-gradient-to-br from-violet-500/20 via-transparent to-surface/0" />
          </div>
          <p className="mt-6 text-sm leading-6 text-slate-300">QR-код для быстрого импорта на телефон. Сканируйте и запускайте Shadow Net на ходу.</p>
        </div>
      </div>
    </div>
  );
}

export default KeyGenerator;
