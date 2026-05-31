function FeatureCard({ icon: Icon, title, description }) {
  return (
    <article className="glass-card rounded-[1.75rem] border border-white/10 p-8 shadow-panel transition hover:-translate-y-1 hover:border-violet-400/25">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-300">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
    </article>
  );
}

export default FeatureCard;
