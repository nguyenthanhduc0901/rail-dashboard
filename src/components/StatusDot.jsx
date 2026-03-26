const styleMap = {
  healthy: {
    dot: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.45)]',
    text: 'text-emerald-600',
    label: 'Healthy',
  },
  warning: {
    dot: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.45)]',
    text: 'text-amber-500',
    label: 'Warning',
  },
  critical: {
    dot: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.45)]',
    text: 'text-rose-600',
    label: 'Critical',
  },
}

export function StatusDot({ status }) {
  const config = styleMap[status] || styleMap.warning

  return (
    <div className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
      <span className={`text-xs font-semibold uppercase tracking-[0.22em] ${config.text}`}>
        {config.label}
      </span>
    </div>
  )
}
