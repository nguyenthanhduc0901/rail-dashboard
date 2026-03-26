import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { getCarriagesByTrain, getTrainById } from '../data/mockData'

const statusConfig = {
  healthy: { progress: 'bg-emerald-500', label: 'Healthy', bg: 'bg-emerald-100 border-emerald-300' },
  warning: { progress: 'bg-amber-500', label: 'Warning', bg: 'bg-amber-100 border-amber-300' },
  critical: { progress: 'bg-red-500', label: 'Critical', bg: 'bg-red-100 border-red-300' },
}

// Component phụ để vẽ Bánh xe (Bogie) dùng chung cho mọi toa
const TrainBogie = ({ className }) => (
  <div className={`absolute -bottom-3 flex gap-1 bg-slate-800 p-1 rounded-sm z-10 ${className}`}>
    <div className="w-4 h-4 rounded-full bg-slate-300 border-[3px] border-slate-600" />
    <div className="w-4 h-4 rounded-full bg-slate-300 border-[3px] border-slate-600" />
  </div>
)

export function TrainDetail() {
  const { trainId } = useParams()
  const train = getTrainById(trainId)
  const carriages = getCarriagesByTrain(trainId)

  if (!train) {
    return (
      <EmptyState
        title="Train Not Found"
        description="The selected train does not exist in the mock fleet."
      />
    )
  }

  const engineConfig = statusConfig[train.status]

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Fleet
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">{train.name}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Train {train.id} • {carriages.length} Carriages • Efficiency: {train.efficiency}%
          </p>
        </div>
      </div>

      {carriages.length === 0 ? (
        <EmptyState title="No Carriages" description="No carriage data is available for this train." />
      ) : (
        <div className="space-y-0 relative pt-10">
          
          {/* Vùng hiển thị toàn bộ đoàn tàu */}
          <div className="flex items-end gap-0 overflow-x-auto pb-10 px-4 scrollbar-thin scrollbar-thumb-slate-300">
            
            {/* 1. ĐẦU TÀU (Locomotive) */}
            <div className={`relative flex-shrink-0 h-40 w-56 border-2 ${engineConfig.bg} rounded-l-[3rem] rounded-r-lg shadow-md flex flex-col justify-between overflow-visible`}>
              
              {/* Kính lái (Driver Cabin Window) */}
              <div className="absolute top-4 left-2 w-12 h-10 bg-slate-800/80 rounded-l-[2rem] rounded-r-sm border-2 border-slate-600 shadow-inner" />
              
              {/* Nội dung thông tin đầu tàu */}
              <div className="absolute inset-0 pl-16 pr-4 py-4 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-black bg-slate-800 text-white px-2 py-0.5 rounded shadow-sm">
                    {train.id}
                  </span>
                  <span className="text-xs font-bold text-slate-700">ENGINE</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500">
                    <span>Efficiency</span>
                    <span>{train.efficiency}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${train.efficiency}%` }} />
                  </div>
                </div>
              </div>

              {/* Gầm tàu */}
              <div className="h-3 w-full bg-slate-700 rounded-bl-[2rem] rounded-br-sm mt-auto" />
              
              {/* Bánh xe đầu tàu */}
              <TrainBogie className="left-[15%]" />
              <TrainBogie className="right-[15%]" />
            </div>

            {/* 2. CÁC TOA TÀU VÀ ĐUÔI TÀU */}
            {carriages.map((carriage, index) => {
              const carriageConfig = statusConfig[carriage.status]
              const isLast = index === carriages.length - 1 // Xác định toa cuối cùng

              // Classes định hình toa (Giữa vs Đuôi)
              const shapeClasses = isLast 
                ? "rounded-r-[3rem] rounded-l-lg" // Toa đuôi
                : "rounded-lg" // Toa giữa

              // Dáng gầm tàu cho toa đuôi
              const chassisClasses = isLast
                ? "rounded-br-[2rem] rounded-bl-sm"
                : "rounded-b-sm"

              return (
                <React.Fragment key={carriage.id}>
                  {/* Khớp nối (Coupler) */}
                  <div className="w-4 h-3 bg-slate-800 mb-6 flex-shrink-0 border-y border-slate-600 shadow-sm z-0" />

                  {/* Bản thân toa tàu */}
                  <Link
                    to={`/train/${trainId}/carriage/${carriage.id}`}
                    className={`relative flex-shrink-0 h-40 w-44 border-2 ${carriageConfig.bg} ${shapeClasses} shadow-md flex flex-col justify-between cursor-pointer transition-transform hover:-translate-y-1 group z-10`}
                  >
                    {/* Cửa sổ hành khách */}
                    <div className="absolute top-6 left-0 right-0 px-4 flex gap-2">
                      <div className="flex-1 h-8 bg-slate-800/60 rounded-sm border border-slate-600" />
                      <div className="flex-1 h-8 bg-slate-800/60 rounded-sm border border-slate-600" />
                      {!isLast && <div className="flex-1 h-8 bg-slate-800/60 rounded-sm border border-slate-600" />}
                    </div>

                    {/* Nội dung thông tin toa */}
                    <div className="absolute inset-0 mt-16 px-4 py-2 flex flex-col justify-end pb-5">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold text-slate-700 bg-white/50 px-1.5 py-0.5 rounded">
                          {carriage.type}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] text-slate-600">
                          <span>Issues</span>
                          <span className="font-bold">{carriage.issues}</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${carriageConfig.progress} rounded-full`} 
                            style={{ width: `${Math.min(carriage.issues * 20, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gầm tàu */}
                    <div className={`h-3 w-full bg-slate-700 mt-auto ${chassisClasses}`} />

                    {/* Bánh xe */}
                    <TrainBogie className="left-[15%]" />
                    <TrainBogie className="right-[15%]" />
                  </Link>
                </React.Fragment>
              )
            })}
          </div>

          {/* 3. ĐƯỜNG RAY (Tracks) */}
          {/* Được đặt absolute đè lên phần padding bottom của container để ăn khớp với bánh xe */}
          <div className="absolute bottom-11 left-0 right-0 h-2 bg-slate-400 rounded-full flex items-center shadow-sm z-0 mx-2">
             <div className="w-full h-[1px] bg-slate-500/50" />
          </div>
        </div>
      )}

      {/* Lưới thông tin chi tiết các toa */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 border-t pt-8">
        <h3 className="col-span-full text-lg font-bold text-slate-800 mb-2">Carriage Analytics</h3>
        {carriages.map((carriage) => {
          const carriageConfig = statusConfig[carriage.status]

          return (
            <Link
              key={carriage.id}
              to={`/train/${trainId}/carriage/${carriage.id}`}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block text-xs font-black bg-slate-800 text-white px-2 py-0.5 rounded mb-1">{carriage.id}</span>
                  <h4 className="font-bold text-slate-800">{carriage.type}</h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${carriageConfig.bg} ${carriageConfig.progress.replace('bg-', 'text-')}`}>
                  {carriageConfig.label}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Active Issues</span>
                  <span className="font-bold text-slate-800">{carriage.issues}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${carriageConfig.progress} rounded-full`}
                    style={{ width: `${Math.min(carriage.issues * 20, 100)}%` }}
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}