import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  ResponsiveTableWithPagination,
  ResponsiveTableHeader,
  ResponsiveTableBody,
  ResponsiveTableRow,
  ResponsiveTableCell,
} from "../ui/ResponsiveTableWithPagination";
import { useSales } from "../../hooks/useSales";
import type { NormalizedSale } from "../../services/salesService";
import { useState } from "react";

type SalesTableProps = {
  onEdit?: (saleId: string) => void;
  onDelete?: (saleId: string) => void;
  showActions?: boolean;
};

export function SalesTable({
  onEdit,
  onDelete,
  showActions = true,
}: SalesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const { data: salesData, isLoading, error } = useSales({
    page: currentPage,
    limit: itemsPerPage,
  });

  const handleDelete = (saleId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
      onDelete?.(saleId);
    }
  };

  if (error) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-red-200 shadow-lg overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-red-600">
            Erro ao carregar vendas. Tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveTableWithPagination
      minWidth="700px"
      currentPage={currentPage}
      totalPages={salesData?.pagination?.totalPages || 1}
      totalItems={salesData?.pagination?.total || 0}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      isLoading={isLoading}
      isEmpty={!salesData?.sales?.length}
      emptyMessage="Nenhuma venda encontrada"
    >
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
        {salesData?.sales?.map((sale: NormalizedSale) => (
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
    </ResponsiveTableWithPagination>
  );
}
