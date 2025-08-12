import { type ReactNode } from 'react'

type ResponsiveContainerProps = {
  children: ReactNode
  className?: string
}

export function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  return (
    <div className={`w-full max-w-full overflow-x-auto ${className}`}>
      <div className="min-w-0 px-1 sm:px-0">
        {children}
      </div>
    </div>
  )
}

type ResponsiveGridProps = {
  children: ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4
}

export function ResponsiveGrid({ children, className = '', cols = 3 }: ResponsiveGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[cols]} gap-4 sm:gap-6 w-full ${className}`}>
      {children}
    </div>
  )
}

type ResponsiveCardProps = {
  children: ReactNode
  className?: string
}

export function ResponsiveCard({ children, className = '' }: ResponsiveCardProps) {
  return (
    <div className={`
      bg-white/70 backdrop-blur-sm rounded-xl border border-sky-200 shadow-lg
      p-4 sm:p-6 w-full min-w-0 overflow-hidden
      ${className}
    `}>
      {children}
    </div>
  )
}
