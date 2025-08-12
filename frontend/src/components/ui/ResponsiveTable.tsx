import { type ReactNode } from 'react'

type ResponsiveTableProps = {
  children: ReactNode
  className?: string
  minWidth?: string
}

type ResponsiveTableHeaderProps = {
  children: ReactNode
  className?: string
}

type ResponsiveTableBodyProps = {
  children: ReactNode
  className?: string
}

type ResponsiveTableRowProps = {
  children: ReactNode
  className?: string
}

type ResponsiveTableCellProps = {
  children: ReactNode
  className?: string
  header?: boolean
  align?: 'left' | 'center' | 'right'
}

export function ResponsiveTable({ children, className = '', minWidth = '700px' }: ResponsiveTableProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-sky-200 shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table 
          className={`w-full divide-y divide-sky-200 bg-white ${className}`}
          style={{ minWidth }}
        >
          {children}
        </table>
      </div>
    </div>
  )
}

export function ResponsiveTableHeader({ children, className = '' }: ResponsiveTableHeaderProps) {
  return (
    <thead className={`bg-gradient-to-r from-sky-50 to-blue-50 ${className}`}>
      {children}
    </thead>
  )
}

export function ResponsiveTableBody({ children, className = '' }: ResponsiveTableBodyProps) {
  return (
    <tbody className={`bg-white divide-y divide-sky-100 ${className}`}>
      {children}
    </tbody>
  )
}

export function ResponsiveTableRow({ children, className = '' }: ResponsiveTableRowProps) {
  return (
    <tr className={`hover:bg-sky-50/50 transition-colors duration-200 ${className}`}>
      {children}
    </tr>
  )
}

export function ResponsiveTableCell({ children, className = '', header = false, align = 'left' }: ResponsiveTableCellProps) {
  const baseClasses = "px-3 py-4 whitespace-nowrap"
  const headerClasses = "text-xs font-semibold text-slate-700 uppercase tracking-wider"
  const cellClasses = "text-sm text-slate-600"
  const alignClasses = {
    left: 'text-left',
    center: 'text-center', 
    right: 'text-right'
  }
  
  const Tag = header ? 'th' : 'td'
  
  return (
    <Tag className={`${baseClasses} ${alignClasses[align]} ${header ? headerClasses : cellClasses} ${className}`}>
      {children}
    </Tag>
  )
}
