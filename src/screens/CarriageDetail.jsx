import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import {
  Area,
  AreaChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { EmptyState } from '../components/EmptyState'
import { getActiveIssuesByCarriage, getCarriageSystems, getTrainById } from '../data/mockData'

const getGaugeColor = (health) => {
  if (health >= 86) return '#34d399'
  if (health >= 70) return '#fbbf24'
  return '#f43f5e'
}

const priorityClass = {
  high: 'bg-rose-50 text-rose-600 border-rose-200',
  medium: 'bg-amber-50 text-amber-500 border-amber-200',
  low: 'bg-blue-50 text-blue-600 border-blue-200',
}

export function CarriageDetail() {
  const { trainId, carriageId } = useParams()
  const train = getTrainById(trainId)

  if (!train) {
    return <EmptyState title="Train Not Found" description="Please return to Fleet and choose a valid train." />
  }

  const systems = getCarriageSystems(trainId, carriageId)
  const contextualIssues = getActiveIssuesByCarriage(trainId, carriageId)

  return (
    <section className="space-y-6">
      <Link
        to={`/train/${trainId}`}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Train
      </Link>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Carriage Detail</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-slate-900">
          {train.id} / {carriageId}
        </h1>
        <p className="mt-2 text-sm text-slate-500">System health and active issues scoped to this carriage only.</p>
      </article>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {systems.map((system) => {
          const gaugeData = [{ name: system.name, value: system.health, fill: getGaugeColor(system.health) }]

          return (
            <article key={system.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{system.name}</h2>
                  <p className="text-sm text-slate-500">Health score: {system.health}%</p>
                </div>
                <div className="h-20 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="68%" outerRadius="100%" data={gaugeData} startAngle={90} endAngle={-270}>
                      <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                      <RadialBar background clockWise dataKey="value" cornerRadius={7} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-3 h-14 rounded-lg bg-slate-50 p-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={system.trend}>
                    <defs>
                      <linearGradient id={`gradient-${system.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getGaugeColor(system.health)} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={getGaugeColor(system.health)} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        color: '#0f172a',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={getGaugeColor(system.health)}
                      fill={`url(#gradient-${system.id})`}
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>
          )
        })}
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Active Contextual Issues</h2>
        <p className="mt-1 text-sm text-slate-500">Only issues affecting {train.id} / {carriageId} are shown.</p>

        {contextualIssues.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No Active Issues" description="This carriage is operating within expected thresholds." />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-3 py-2">Issue ID</th>
                  <th className="px-3 py-2">System</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Priority</th>
                  <th className="px-3 py-2">Assignee</th>
                </tr>
              </thead>
              <tbody>
                {contextualIssues.map((issue) => (
                  <tr key={issue.id} className="border-t border-slate-200 text-slate-700">
                    <td className="px-3 py-3 font-medium">{issue.id}</td>
                    <td className="px-3 py-3">{issue.system}</td>
                    <td className="px-3 py-3">{issue.description}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase ${priorityClass[issue.priority]}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-3 py-3">{issue.assignee ? issue.assignee.name : 'Unassigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  )
}
