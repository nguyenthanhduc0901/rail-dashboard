import { useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { carriagesByTrain, issues, trains } from '../data/mockData'

const priorityClass = {
  high: 'bg-rose-50 text-rose-600 border-rose-200',
  medium: 'bg-amber-50 text-amber-500 border-amber-200',
  low: 'bg-blue-50 text-blue-600 border-blue-200',
}

const statusClass = {
  open: 'text-rose-600',
  'in-progress': 'text-amber-500',
  closed: 'text-emerald-600',
}

const defaultFilters = {
  trainId: 'all',
  carriageId: 'all',
  priority: 'all',
  status: 'all',
  date: '',
}

export function IssueManagement() {
  const [filters, setFilters] = useState(defaultFilters)

  const carriageOptions = useMemo(() => {
    if (filters.trainId === 'all') {
      return Object.entries(carriagesByTrain).flatMap(([trainId, carriages]) =>
        carriages.map((carriage) => ({ value: `${trainId}:${carriage.id}`, label: `${trainId} / ${carriage.id}` })),
      )
    }

    return (carriagesByTrain[filters.trainId] || []).map((carriage) => ({
      value: `${filters.trainId}:${carriage.id}`,
      label: `${filters.trainId} / ${carriage.id}`,
    }))
  }, [filters.trainId])

  const filteredIssues = useMemo(
    () =>
      issues.filter((issue) => {
        const locationValue = `${issue.trainId}:${issue.carriageId}`

        if (filters.trainId !== 'all' && issue.trainId !== filters.trainId) return false
        if (filters.carriageId !== 'all' && locationValue !== filters.carriageId) return false
        if (filters.priority !== 'all' && issue.priority !== filters.priority) return false
        if (filters.status !== 'all' && issue.status !== filters.status) return false
        if (filters.date && issue.date < filters.date) return false

        return true
      }),
    [filters],
  )

  const updateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'trainId' ? { carriageId: 'all' } : null),
    }))
  }

  return (
    <section className="space-y-6">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-slate-900">Issue Management</h1>
        <p className="mt-2 text-sm text-slate-500">Filter and assign active rail fleet issues by train, carriage, priority, status, and date.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <select
            value={filters.trainId}
            onChange={(event) => updateFilter('trainId', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="all">All Trains</option>
            {trains.map((train) => (
              <option key={train.id} value={train.id}>
                {train.id}
              </option>
            ))}
          </select>

          <select
            value={filters.carriageId}
            onChange={(event) => updateFilter('carriageId', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="all">All Carriages</option>
            {carriageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(event) => updateFilter('priority', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filters.status}
            onChange={(event) => updateFilter('status', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(event) => updateFilter('date', event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          />
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {filteredIssues.length === 0 ? (
          <EmptyState
            title="No Issues Match Current Filters"
            description="Try broadening the filters or clearing the date boundary."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-3 py-2">Issue ID</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Short Description</th>
                  <th className="px-3 py-2">Priority</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Assignee</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="border-t border-slate-200 text-slate-700">
                    <td className="px-3 py-3 font-medium">{issue.id}</td>
                    <td className="px-3 py-3">{issue.trainId} / {issue.carriageId} / {issue.system}</td>
                    <td className="px-3 py-3">{issue.description}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase ${priorityClass[issue.priority]}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className={`px-3 py-3 text-xs font-semibold uppercase ${statusClass[issue.status]}`}>{issue.status}</td>
                    <td className="px-3 py-3">
                      {issue.assignee ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${issue.assignee.color}`}
                            title={issue.assignee.name}
                          >
                            {issue.assignee.initials}
                          </span>
                          <span className="text-slate-300">{issue.assignee.name}</span>
                        </div>
                      ) : (
                        <button className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100">
                          Assign
                        </button>
                      )}
                    </td>
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
