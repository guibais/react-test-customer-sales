import { type ReactNode, useState } from "react";
import { Button } from "../ui/button";
import {
  LogOut,
  Users,
  BarChart3,
  Home,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "@tanstack/react-router";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/customers", icon: Users, label: "Clientes" },
    { to: "/sales", icon: ShoppingCart, label: "Vendas" },
    { to: "/stats", icon: BarChart3, label: "Estatísticas" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-sky-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-3 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-transparent">
                  Loja de Brinquedos
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <span className="text-sm text-slate-600 font-medium">
                  Olá, {user?.name}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative min-h-0 flex-1">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <nav
          className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 
          bg-white/90 backdrop-blur-md shadow-xl border-r border-sky-200
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:min-h-[calc(100vh-4rem)] overflow-y-auto
        `}
        >
          <div className="p-6 pt-8">
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Navegação
              </h2>
            </div>

            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="group flex items-center px-4 py-3 text-slate-600 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-all duration-200 font-medium"
                      activeProps={{
                        className:
                          "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg hover:from-sky-600 hover:to-blue-700 hover:text-white",
                      }}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 p-4 bg-gradient-to-r from-sky-50 to-blue-100 rounded-xl border border-sky-200 lg:hidden">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500">Administrador</p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 lg:ml-0 min-h-0">
          <div className="p-3 sm:p-4 lg:p-6 w-full max-w-full overflow-x-auto">
            <div className="animate-fade-in min-w-0">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
