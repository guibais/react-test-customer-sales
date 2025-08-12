import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type SalesData = {
  date: string
  totalAmount: number
  totalSales: number
}

type SalesChartProps = {
  data: SalesData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-sky-200 rounded-xl p-4 shadow-lg">
        <p className="text-slate-800 font-semibold mb-2">{`Data: ${label}`}</p>
        <div className="space-y-1">
          <p className="text-sky-700 font-medium">
            {`Vendas: ${payload[1]?.value || 0}`}
          </p>
          <p className="text-blue-700 font-medium">
            {`Valor: ${(payload[0]?.value || 0).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}`}
          </p>
        </div>
      </div>
    )
  }
  return null
}

export function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="text-center">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LineChart className="h-8 w-8 text-sky-400" />
          </div>
          <p className="font-medium">Nenhum dado disponível</p>
          <p className="text-sm">Dados aparecerão quando houver vendas</p>
        </div>
      </div>
    )
  }

  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    })
  }))

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="totalAmount" 
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2, fill: '#ffffff' }}
          />
          <Line 
            type="monotone" 
            dataKey="totalSales" 
            stroke="#2563eb"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: '#2563eb', strokeWidth: 2, fill: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}