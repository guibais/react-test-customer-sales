import { type ReactNode } from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { X } from 'lucide-react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl'
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'md' 
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Glass backdrop com blur e menos opacidade */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal card com efeito glass */}
      <Card className={`
        relative w-full ${maxWidthClasses[maxWidth]} mx-4 
        bg-white/90 backdrop-blur-md border border-sky-200/50 
        shadow-2xl shadow-sky-500/10
        animate-in fade-in-0 zoom-in-95 duration-300
      `}>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-transparent">
            {title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-sky-50 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
