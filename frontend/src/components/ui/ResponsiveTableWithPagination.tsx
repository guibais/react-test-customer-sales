import { type ReactNode } from "react";
import { Pagination } from "./Pagination";

type ResponsiveTableWithPaginationProps = {
  children: ReactNode;
  className?: string;
  minWidth?: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  loadingRows?: number;
};

type ResponsiveTableHeaderProps = {
  children: ReactNode;
  className?: string;
};

type ResponsiveTableBodyProps = {
  children: ReactNode;
  className?: string;
};

type ResponsiveTableRowProps = {
  children: ReactNode;
  className?: string;
};

type ResponsiveTableCellProps = {
  children: ReactNode;
  className?: string;
  header?: boolean;
  align?: "left" | "center" | "right";
};

export function ResponsiveTableWithPagination({
  children,
  className = "",
  minWidth = "700px",
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "Nenhum resultado encontrado",
  loadingRows = 5,
}: ResponsiveTableWithPaginationProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-sky-200 shadow-lg overflow-hidden max-w-[95vw]">
        <div className="overflow-x-auto w-full">
          <div style={{ minWidth }}>
            <table
              className={`w-full divide-y divide-sky-200 bg-white ${className}`}
            >
              {children}
            </table>
          </div>
        </div>

        {isLoading && (
          <div className="p-4 space-y-4">
            {[...Array(loadingRows)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        )}

        {isEmpty && !isLoading && (
          <div className="text-center py-8 text-slate-500">{emptyMessage}</div>
        )}
      </div>

      {!isLoading && !isEmpty && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-sky-200/50"
        />
      )}
    </div>
  );
}

export function ResponsiveTableHeader({
  children,
  className = "",
}: ResponsiveTableHeaderProps) {
  return (
    <thead className={`bg-gradient-to-r from-sky-50 to-blue-50 ${className}`}>
      {children}
    </thead>
  );
}

export function ResponsiveTableBody({
  children,
  className = "",
}: ResponsiveTableBodyProps) {
  return (
    <tbody className={`bg-white divide-y divide-sky-100 ${className}`}>
      {children}
    </tbody>
  );
}

export function ResponsiveTableRow({
  children,
  className = "",
}: ResponsiveTableRowProps) {
  return (
    <tr
      className={`hover:bg-sky-50/50 transition-colors duration-200 ${className}`}
    >
      {children}
    </tr>
  );
}

export function ResponsiveTableCell({
  children,
  className = "",
  header = false,
  align = "left",
}: ResponsiveTableCellProps) {
  const baseClasses = "px-3 py-4 whitespace-nowrap";
  const headerClasses =
    "text-xs font-semibold text-slate-700 uppercase tracking-wider";
  const cellClasses = "text-sm text-slate-600";
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const Tag = header ? "th" : "td";

  return (
    <Tag
      className={`${baseClasses} ${alignClasses[align]} ${header ? headerClasses : cellClasses} ${className}`}
    >
      {children}
    </Tag>
  );
}
