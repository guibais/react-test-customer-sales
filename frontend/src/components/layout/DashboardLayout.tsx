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
      <header className="bg-gradient-to-r from-white/95 via-sky-50/90 to-blue-50/95 backdrop-blur-xl shadow-2xl border-b border-sky-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
                    <ShoppingCart className="h-6 w-6 text-white drop-shadow-sm" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-sm"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-sky-600 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                    Toy Store
                  </h1>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">Admin Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500">Administrador</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center border-sky-200/50 bg-white/50 text-sky-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:border-sky-300 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline font-medium">Sair</span>
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
          bg-gradient-to-b from-white/95 via-sky-50/90 to-blue-50/95 backdrop-blur-xl shadow-2xl border-r border-sky-200/50
          transform transition-all duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:min-h-[calc(100vh-5rem)] overflow-y-auto
        `}
        >
          <div className="p-6 pt-8">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Menu Principal
                </h2>
              </div>
            </div>

            <ul className="space-y-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="group relative flex items-center px-4 py-4 text-slate-600 rounded-2xl hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:text-sky-700 transition-all duration-300 font-semibold hover:shadow-lg hover:scale-105 transform"
                      activeProps={{
                        className:
                          "bg-gradient-to-r from-sky-500 via-blue-500 to-purple-600 text-white shadow-xl hover:from-sky-600 hover:via-blue-600 hover:to-purple-700 hover:text-white hover:shadow-2xl",
                      }}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="relative">
                        <Icon className="h-6 w-6 mr-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                      </div>
                      <span className="relative">
                        {item.label}
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full transition-all duration-300"></div>
                      </span>
                      <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-12 p-5 bg-gradient-to-br from-sky-50 via-blue-50 to-purple-50 rounded-2xl border border-sky-200/50 shadow-lg lg:hidden backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-base drop-shadow-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white shadow-sm"></div>
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
