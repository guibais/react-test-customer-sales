import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = "",
}: PaginationProps) {
  const getVisiblePages = () => {
    if (totalPages === 1) {
      return [1];
    }

    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages < 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2 text-sm text-slate-600">
        {totalItems && itemsPerPage && (
          <span>
            Mostrando{" "}
            <span className="font-medium text-slate-900">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            até{" "}
            <span className="font-medium text-slate-900">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            de <span className="font-medium text-slate-900">{totalItems}</span>{" "}
            resultados
          </span>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center space-x-1 border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>

        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="px-3 py-2 text-slate-500"
                >
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={
                  currentPage === page
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg hover:from-sky-600 hover:to-blue-700"
                    : "border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300"
                }
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center space-x-1 border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">Próxima</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
