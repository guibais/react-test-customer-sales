import { SalesChart } from "./SalesChart";
import { useStats } from "../../hooks/useStats";
import { Loader2, DollarSign, TrendingUp, Calendar, Users } from "lucide-react";

export function StatsPage() {
  const { data: dailyStats, topCustomers, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Carregando estatísticas
            </h3>
            <p className="text-slate-500">
              Aguarde enquanto processamos os dados...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-700 text-center">
          Erro ao carregar estatísticas. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-transparent">
            Estatísticas
          </h1>
          <p className="text-slate-500 mt-1">
            Análise completa de vendas e performance
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Dados atualizados em tempo real</span>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-sky-200 shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="flex items-center text-sky-800">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Vendas por Dia</h3>
              <p className="text-sm text-sky-600 font-normal">
                Evolução temporal das vendas
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {dailyStats && dailyStats.length > 0 ? (
            <SalesChart data={dailyStats} />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-sky-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-700 mb-2">
                Nenhum dado disponível
              </h4>
              <p className="text-slate-500">
                Dados de vendas serão exibidos aqui quando disponíveis
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="group bg-gradient-to-br from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200 transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl border border-sky-200 overflow-hidden">
          <div className="p-4 sm:p-6 pb-4">
            <div className="flex items-center text-sky-800">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Maior Volume</h3>
                <p className="text-sm text-sky-600 font-normal">
                  Total em vendas
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
            {topCustomers?.highestVolume ? (
              <div className="space-y-3">
                <div className="p-3 bg-white/60 rounded-xl border border-sky-200">
                  <p className="font-bold text-lg text-slate-800 mb-1">
                    {topCustomers.highestVolume.customerName}
                  </p>
                  <p className="text-3xl font-black text-sky-700 mb-2">
                    R${" "}
                    {(
                      topCustomers.highestVolume.totalVolume || 0
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <div className="flex items-center text-sm text-sky-600">
                    <div className="w-2 h-2 bg-sky-500 rounded-full mr-2"></div>
                    {topCustomers.highestVolume.totalSales || 0} compras realizadas
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sky-600">Nenhum dado disponível</p>
              </div>
            )}
          </div>
        </div>

        <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl border border-emerald-200 overflow-hidden">
          <div className="p-4 sm:p-6 pb-4">
            <div className="flex items-center text-emerald-800">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Maior Média</h3>
                <p className="text-sm text-emerald-600 font-normal">
                  Valor médio por venda
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
            {topCustomers?.highestAverage ? (
              <div className="space-y-3">
                <div className="p-3 bg-white/60 rounded-xl border border-emerald-200">
                  <p className="font-bold text-lg text-slate-800 mb-1">
                    {topCustomers.highestAverage.customerName}
                  </p>
                  <p className="text-3xl font-black text-emerald-700 mb-2">
                    R${" "}
                    {(
                      topCustomers.highestAverage.averageValue || 0
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <div className="flex items-center text-sm text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    Média por transação
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-emerald-600">Nenhum dado disponível</p>
              </div>
            )}
          </div>
        </div>

        <div className="group bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-xl border border-amber-200 overflow-hidden">
          <div className="p-4 sm:p-6 pb-4">
            <div className="flex items-center text-amber-800">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Maior Frequência</h3>
                <p className="text-sm text-amber-600 font-normal">
                  Dias únicos de venda exclusiva
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
            {topCustomers?.mostFrequent ? (
              <div className="space-y-3">
                <div className="p-3 bg-white/60 rounded-xl border border-amber-200">
                  <p className="font-bold text-lg text-slate-800 mb-1">
                    {topCustomers.mostFrequent.customerName}
                  </p>
                  <p className="text-3xl font-black text-amber-700 mb-2">
                    {topCustomers.mostFrequent.exclusiveDays || 0}
                  </p>
                  <div className="flex items-center text-sm text-amber-600">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    Dias com vendas exclusivas
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-amber-600">Nenhum dado disponível</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-sky-200 shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-sky-200">
          <div className="flex items-center text-slate-800">
            <Users className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-semibold">Resumo Geral</h3>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {dailyStats
                  ?.reduce((acc: number, day: any) => acc + day.totalAmount, 0)
                  .toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }) || "R$ 0,00"}
              </p>
              <p className="text-sm text-slate-600">Total Vendas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {dailyStats?.reduce(
                  (acc: number, day: any) => acc + day.totalSales,
                  0
                ) || 0}
              </p>
              <p className="text-sm text-slate-600">Vendas Realizadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {dailyStats?.length || 0}
              </p>
              <p className="text-sm text-slate-600">Dias com Vendas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {dailyStats && dailyStats.length > 0
                  ? (
                      dailyStats.reduce(
                        (acc: number, day: any) => acc + day.totalAmount,
                        0
                      ) /
                      dailyStats.reduce(
                        (acc: number, day: any) => acc + day.totalSales,
                        0
                      )
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "R$ 0,00"}
              </p>
              <p className="text-sm text-slate-600">Ticket Médio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
