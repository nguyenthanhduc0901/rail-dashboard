export function PlaceholderScreen({ title }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="font-display text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-500">This module is prepared for future operational features.</p>
    </section>
  )
}
