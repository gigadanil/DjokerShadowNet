function PricingCard({ plan }) {
  return (
    <div className={`glass-card rounded-[2rem] border ${plan.featured ? 'border-violet-400/40 bg-[#151524]/95 shadow-panel' : 'border-white/10 bg-[#0c0c16]/90'} p-8 transition hover:-translate-y-1`}> 
      {plan.featured && <div className="mb-4 inline-flex rounded-full bg-violet-500/15 px-4 py-2 text-xs uppercase tracking-[0.25em] text-violet-200">Популярная</div>}
      <h3 className="text-2xl font-semibold text-white">{plan.title}</h3>
      <p className="mt-3 text-sm text-slate-400">{plan.description}</p>
      <div className="mt-8 flex items-end gap-2">
        <p className="text-4xl font-semibold text-white">{plan.price}</p>
        <span className="text-sm text-slate-500">{plan.note}</span>
      </div>
      <button className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-glow px-5 py-3 text-sm font-semibold uppercase text-surface transition hover:bg-violet-400/90">
        Купить
      </button>
    </div>
  );
}

export default PricingCard;
