import { Activity, Gauge, ShieldCheck, TriangleAlert, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { trains, issues } from '../data/mockData'

const kpiCards = [
  {
    title: 'Total Pending Issues',
    value: issues.filter((issue) => issue.status !== 'closed').length,
    valueClass: 'text-slate-800',
    gradientFrom: 'from-blue-100/30',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    icon: TriangleAlert,
  },
  {
    title: 'Healthy Trains',
    value: trains.filter((train) => train.status === 'healthy').length,
    valueClass: 'text-emerald-600',
    gradientFrom: 'from-emerald-100/30',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    icon: ShieldCheck,
  },
  {
    title: 'Fleet Efficiency',
    value: `${Math.round(trains.reduce((acc, train) => acc + train.efficiency, 0) / trains.length)}%`,
    valueClass: 'text-cyan-600',
    gradientFrom: 'from-cyan-100/30',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    icon: Gauge,
  },
  {
    title: 'Critical Alerts',
    value: trains.filter((train) => train.status === 'critical').length,
    valueClass: 'text-red-500',
    gradientFrom: 'from-red-100/30',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    icon: Activity,
  },
]

const statusConfig = {
  healthy: { dot: 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]', text: 'text-emerald-600', progress: 'bg-emerald-500', label: 'Healthy' },
  warning: { dot: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]', text: 'text-amber-600', progress: 'bg-amber-500', label: 'Warning' },
  critical: { dot: 'bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]', text: 'text-red-600', progress: 'bg-red-500', label: 'Critical' },
}

export function FleetDashboard() {
  return (
    <section className="space-y-12">
      {/* Fleet Header */}
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Train Fleet</h2>
      </div>

      {/* Train Grid with Integrated Tracks */}
      {Array.from({ length: Math.ceil(trains.length / 2) }).map((_, rowIndex) => {
        const startIdx = rowIndex * 2
        const trainPair = trains.slice(startIdx, startIdx + 2)

        return (
          <div key={rowIndex}>
            {/* Train Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-0">
              {trainPair.map((train) => {
                const config = statusConfig[train.status]

                return (
                  <Link
                    key={train.id}
                    to={`/train/${train.id}`}
                    className="relative group cursor-pointer transition-transform hover:-translate-y-1"
                  >
                    <div className={`train-emu status-${train.status}`}>
                      <div className="window-container">
                        <div className="window-passenger" />
                        <div className="window-passenger" />
                        <div className="window-passenger" />
                        <div className="window-passenger" />
                        <div className="window-passenger" />
                        <div className="window-passenger" />
                        <div className="window-passenger" />
                        <div className="window-cabin" />
                      </div>
                      
                      {/* Bogies */}
                      <div className="bogie left-[10%]">
                        <div className="bogie-wheel" />
                        <div className="bogie-wheel" />
                      </div>
                      <div className="bogie left-[20%]">
                        <div className="bogie-wheel" />
                        <div className="bogie-wheel" />
                      </div>
                      <div className="bogie right-[15%]">
                        <div className="bogie-wheel" />
                        <div className="bogie-wheel" />
                      </div>
                      <div className="bogie right-[25%]">
                        <div className="bogie-wheel" />
                        <div className="bogie-wheel" />
                      </div>
                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col p-6 z-10">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs font-black bg-slate-800 text-white px-2 py-0.5 rounded shadow-sm">{train.id}</span>
                            <h4 className="font-bold text-slate-800 text-lg">{train.name}</h4>
                          </div>

                        </div>

                        <div className="mt-6 space-y-2 w-[60%]">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <span>Efficiency</span>
                            <span className="text-slate-800">{train.efficiency}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                            <div className={`h-full ${config.progress} rounded-full`} style={{ width: `${train.efficiency}%` }} />
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <span className={`text-xs font-bold ${config.text}`}>{train.openIssues} Open {train.openIssues === 1 ? 'Issue' : 'Issues'}</span>
                            <div className="flex items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                              <span className="text-[10px] font-semibold mr-1">DIAGNOSTICS</span>
                              <ChevronRight className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Shared Railway Track for this row */}
            <div className="rail-track-container mt-0 mb-8">
              <div className="rail-line" />
              <div className="sleepers">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="sleeper" />
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
