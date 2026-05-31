function ServerCard({ server, active, onSelect }) {
  return (
    <button onClick={onSelect} className={`group flex w-full items-center justify-between rounded-[1.75rem] border px-6 py-5 text-left transition ${active ? 'border-violet-400/60 bg-[#1a1732]/95 shadow-glow' : 'border-white/10 bg-[#0f0f19]/90 hover:border-violet-400/25 hover:bg-white/5'}`}>
      <div>
        <p className="text-base font-semibold text-white">{server.name}</p>
        <p className="mt-1 text-sm text-slate-400">{server.location}</p>
      </div>
      <div className="rounded-full bg-white/5 px-3 py-2 text-sm text-slate-300">{server.load}</div>
    </button>
  );
}

export default ServerCard;
