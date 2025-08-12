import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useStats } from '../../hooks/useStats'
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react'

export function StatsOverview() {
  const { topCustomers, isLoading } = useStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: "Maior Volume",
      value: topCustomers?.highestVolume?.totalVolume?.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }) || 'R$ 0',
      description: topCustomers?.highestVolume?.customerName || 'N/A',
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Maior Média",
      value: topCustomers?.highestAverage?.averageValue?.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }) || 'R$ 0',
      description: topCustomers?.highestAverage?.customerName || 'N/A',
      icon: DollarSign,
      color: "text-blue-600"
    },
    {
      title: "Maior Exclusividade",
      value: `${topCustomers?.mostFrequent?.exclusiveDays || 0} dias`,
      description: `${topCustomers?.mostFrequent?.customerName || 'N/A'} - Vendas exclusivas`,
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "Total Clientes",
      value: topCustomers?.totalCustomers?.toString() || "0",
      description: "Clientes cadastrados",
      icon: Users,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
