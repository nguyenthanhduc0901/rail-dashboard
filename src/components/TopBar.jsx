import { Bell, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const labelMap = {
  train: 'Train',
  carriage: 'Carriage',
  issues: 'Issues',
  reports: 'Reports',
  settings: 'Settings',
}

const toTitle = (value) => labelMap[value.toLowerCase()] || value.charAt(0).toUpperCase() + value.slice(1)

export function TopBar() {
  const location = useLocation()

  const crumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, allSegments) => {
      const path = `/${allSegments.slice(0, index + 1).join('/')}`
      return { label: toTitle(segment), path }
    })

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur lg:px-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search... (Ctrl+K)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-20 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-500 focus:border-slate-300"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500">
            Command
          </span>
        </div>

        <div className="order-3 flex w-full flex-wrap items-center gap-2 text-sm lg:order-none lg:w-auto">
          <Link to="/" className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 hover:text-slate-900">
            Home
          </Link>
          {crumbs.map((crumb) => (
            <div key={crumb.path} className="flex items-center gap-2 text-slate-400">
              <span>{'>'}</span>
              <Link to={crumb.path} className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                {crumb.label}
              </Link>
            </div>
          ))}
        </div>

        <button className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:border-slate-300 hover:text-slate-900">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            5
          </span>
        </button>
      </div>
    </header>
  )
}
