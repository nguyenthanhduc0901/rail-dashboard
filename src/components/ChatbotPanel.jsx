import { useMemo, useState } from 'react'
import { Bot, MessageSquare, SendHorizontal, Sparkles, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const getContextSubtitle = (pathname) => {
  if (pathname.includes('/carriage/')) {
    const segments = pathname.split('/').filter(Boolean)
    return `Analyzing ${segments[1]} / ${segments[3]} context...`
  }

  if (pathname.includes('/train/')) {
    const segments = pathname.split('/').filter(Boolean)
    return `Analyzing ${segments[1]} context...`
  }

  if (pathname.includes('/issues')) {
    return 'Analyzing issue management context...'
  }

  return 'Analyzing full fleet context...'
}

export function ChatbotPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const location = useLocation()

  const subtitle = useMemo(() => getContextSubtitle(location.pathname), [location.pathname])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_40px_rgba(16,185,129,0.32)] transition hover:brightness-110"
      >
        <MessageSquare className="h-4 w-4" />
        AI Copilot
      </button>

      <div
        className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-200 bg-white p-5 transition duration-300 shadow-xl sm:w-[420px] ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-600">AI Ops Assistant</p>
              <h3 className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Bot className="h-5 w-5 text-emerald-600" />
                Fleet Analyst
              </h3>
              <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-slate-700">
              <p className="font-medium text-emerald-600">Insight</p>
              <p className="mt-1">Train T03 brake and power systems show correlated degradation. Recommend pre-emptive maintenance in next 12 hours.</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-slate-700">
              <p className="flex items-center gap-2 font-medium text-amber-500">
                <Sparkles className="h-4 w-4" /> Suggested Prompt
              </p>
              <p className="mt-1">Compare open issues trend between T02 and T06 for the last 7 days.</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about current context..."
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
            />
            <button className="rounded-lg bg-emerald-500 p-2 text-slate-900">
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
