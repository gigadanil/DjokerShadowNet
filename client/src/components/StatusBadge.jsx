function StatusBadge({ active, expire }) {
  return (
    <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${active ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200'}`}>
      <span className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-300' : 'bg-rose-300'} mr-2`} />
      {active ? `Активна до ${expire}` : 'Истекла'}
    </div>
  );
}

export default StatusBadge;
