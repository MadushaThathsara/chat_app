import React from 'react'

export default function UsersLoadingSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-slate-800/30 p-1 sm:p-2 rounded-lg animate-pulse">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-2 sm:h-3 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-1 sm:h-2 bg-slate-700/70 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
