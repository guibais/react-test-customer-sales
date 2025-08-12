import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { StatsOverview } from '../components/dashboard/StatsOverview'
import { Link } from '@tanstack/react-router'
import { BarChart3, Users, ShoppingCart, TrendingUp, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const quickActions = [
    {
      title: 'Ver Clientes',
      description: 'Gerenciar base de clientes',
      icon: Users,
      to: '/customers',
      color: 'from-sky-500 to-blue-600',
      bgColor: 'from-sky-50 to-sky-100',
      borderColor: 'border-sky-200'
    },
    {
      title: 'Nova Venda',
      description: 'Registrar nova transação',
      icon: ShoppingCart,
      to: '/sales',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Estatísticas Detalhadas',
      description: 'Análise completa e gráficos',
      icon: BarChart3,
      to: '/stats',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-200'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Visão geral do sistema de vendas
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema online</span>
          </div>
        </div>

        {/* Resumo Rápido */}
        <StatsOverview />

        {/* Ações Rápidas */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-sky-200 shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50">
            <div className="flex items-center text-sky-800">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Ações Rápidas</h3>
                <p className="text-sm text-sky-600 font-normal">
                  Acesso direto às principais funcionalidades
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className={`group bg-gradient-to-br ${action.bgColor} hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl border ${action.borderColor} overflow-hidden block`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 mb-2">
                        {action.title}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Link para Estatísticas Completas */}
        <div className="text-center">
          <Link
            to="/stats"
            className="inline-flex items-center space-x-2 text-sky-600 hover:text-sky-700 font-medium group"
          >
            <span>Ver análise completa com gráficos detalhados</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
