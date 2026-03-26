export function LoadingState({ label = 'Loading data stream...' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="h-2 w-40 animate-pulse rounded bg-slate-300" />
      <div className="mt-4 h-2 w-full animate-pulse rounded bg-slate-300" />
      <div className="mt-2 h-2 w-4/5 animate-pulse rounded bg-slate-300" />
      <p className="mt-4 text-sm text-slate-500">{label}</p>
    </div>
  )
}
