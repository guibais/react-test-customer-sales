import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  ResponsiveTable,
  ResponsiveTableHeader,
  ResponsiveTableBody,
  ResponsiveTableRow,
  ResponsiveTableCell,
} from "../ui/ResponsiveTable";

type SalesTableProps = {
  onEdit?: (saleId: string) => void;
  onDelete?: (saleId: string) => void;
  showActions?: boolean;
};

export function SalesTable({ onEdit, onDelete, showActions = true }: SalesTableProps) {
  // Mock data for demonstration
  const salesData = {
    sales: [
      {
        id: "1",
        customerName: "Guilherme Bais",
        amount: 100.00,
        saleDate: "2025-08-01",
        createdAt: "2025-08-12"
      }
    ]
  };
  const isLoading = false;

  const handleDelete = (saleId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
      onDelete?.(saleId);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-sky-200 shadow-lg overflow-hidden">
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveTable minWidth="700px">
        <ResponsiveTableHeader>
          <ResponsiveTableRow>
            <ResponsiveTableCell header>Cliente</ResponsiveTableCell>
            <ResponsiveTableCell header>Valor</ResponsiveTableCell>
            <ResponsiveTableCell header>Data da Venda</ResponsiveTableCell>
            <ResponsiveTableCell header>Data Cadastro</ResponsiveTableCell>
            {showActions && (
              <ResponsiveTableCell header>Ações</ResponsiveTableCell>
            )}
          </ResponsiveTableRow>
        </ResponsiveTableHeader>
        <ResponsiveTableBody>
          {salesData?.sales?.map((sale) => (
            <ResponsiveTableRow key={sale.id}>
              <ResponsiveTableCell>
                <div className="font-medium text-slate-900">
                  {sale.customerName}
                </div>
              </ResponsiveTableCell>
              <ResponsiveTableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  R$ {sale.amount.toFixed(2)}
                </span>
              </ResponsiveTableCell>
              <ResponsiveTableCell>
                {new Date(sale.saleDate).toLocaleDateString("pt-BR")}
              </ResponsiveTableCell>
              <ResponsiveTableCell>
                {new Date(sale.createdAt).toLocaleDateString("pt-BR")}
              </ResponsiveTableCell>
              {showActions && (
                <ResponsiveTableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(sale.id)}
                      className="text-sky-600 hover:text-sky-900 hover:bg-sky-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sale.id)}
                      className="text-red-600 hover:text-red-900 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </ResponsiveTableCell>
              )}
            </ResponsiveTableRow>
          ))}
        </ResponsiveTableBody>
      </ResponsiveTable>
      {!salesData?.sales?.length && (
        <div className="text-center py-8 text-slate-500">
          Nenhuma venda encontrada
        </div>
      )}
    </div>
  );
}
