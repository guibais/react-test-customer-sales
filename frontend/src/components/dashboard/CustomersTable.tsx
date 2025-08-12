import { Button } from "../ui/button";
import { useCustomers, useDeleteCustomer } from "../../hooks/useCustomers";
import { Edit, Trash2 } from "lucide-react";
import {
  ResponsiveTableWithPagination,
  ResponsiveTableHeader,
  ResponsiveTableBody,
  ResponsiveTableRow,
  ResponsiveTableCell,
} from "../ui/ResponsiveTableWithPagination";
import { useState } from "react";

type CustomersTableProps = {
  onEdit?: (customerId: string) => void;
  onDelete?: (customerId: string) => void;
  showActions?: boolean;
};

export function CustomersTable({
  onEdit,
  onDelete,
  showActions = true,
}: CustomersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const { data: customersData, isLoading } = useCustomers({
    page: currentPage,
    limit: itemsPerPage,
  });
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  const handleDelete = (customerId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      deleteCustomer(customerId);
      onDelete?.(customerId);
    }
  };



  return (
    <ResponsiveTableWithPagination
      minWidth="800px"
      currentPage={currentPage}
      totalPages={customersData?.pagination?.totalPages || 1}
      totalItems={customersData?.pagination?.total || 0}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      isLoading={isLoading}
      isEmpty={!customersData?.customers?.length}
      emptyMessage="Nenhum cliente encontrado"
    >
      <ResponsiveTableHeader>
        <ResponsiveTableRow>
          <ResponsiveTableCell header>Nome</ResponsiveTableCell>
          <ResponsiveTableCell header>Email</ResponsiveTableCell>
          <ResponsiveTableCell header>Telefone</ResponsiveTableCell>
          <ResponsiveTableCell header>Data Nascimento</ResponsiveTableCell>
          <ResponsiveTableCell header>Total Vendas</ResponsiveTableCell>
          <ResponsiveTableCell header>Letra Ausente</ResponsiveTableCell>
          {showActions && (
            <ResponsiveTableCell header>Ações</ResponsiveTableCell>
          )}
        </ResponsiveTableRow>
      </ResponsiveTableHeader>
      <ResponsiveTableBody>
        {customersData?.customers?.map((customer) => (
          <ResponsiveTableRow key={customer.id}>
            <ResponsiveTableCell>
              <div className="font-medium text-slate-900">
                {customer.name}
              </div>
            </ResponsiveTableCell>
            <ResponsiveTableCell>{customer.email}</ResponsiveTableCell>
            <ResponsiveTableCell>{customer.phone || "-"}</ResponsiveTableCell>
            <ResponsiveTableCell>
              {customer.birthDate
                ? new Date(customer.birthDate).toLocaleDateString("pt-BR")
                : "-"}
            </ResponsiveTableCell>
            <ResponsiveTableCell>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                {customer.totalSales || 0}
              </span>
            </ResponsiveTableCell>
            <ResponsiveTableCell>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold">
                {customer.missingLetter}
              </span>
            </ResponsiveTableCell>
            {showActions && (
              <ResponsiveTableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(customer.id)}
                    className="text-sky-600 hover:text-sky-900 hover:bg-sky-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(customer.id)}
                    className="text-red-600 hover:text-red-900 hover:bg-red-50"
                    disabled={isDeleting}
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
