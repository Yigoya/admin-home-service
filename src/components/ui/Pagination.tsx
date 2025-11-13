interface PaginationProps {
  currentPage: number; // zero-based
  totalPages: number; // total pages
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: PaginationProps) {
  const hasPrev = currentPage > 0;
  const hasNext = currentPage + 1 < totalPages;

  const from = totalItems && itemsPerPage ? currentPage * itemsPerPage + 1 : undefined;
  const to = totalItems && itemsPerPage ? Math.min(totalItems, (currentPage + 1) * itemsPerPage) : undefined;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        {from !== undefined && to !== undefined && totalItems !== undefined ? (
          <span>
            Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </span>
        ) : (
          <span>Page {currentPage + 1} of {Math.max(totalPages, 1)}</span>
        )}
      </div>
      <div className="inline-flex gap-2">
        <button
          type="button"
          className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50"
          onClick={() => hasPrev && onPageChange(currentPage - 1)}
          disabled={!hasPrev}
        >
          Previous
        </button>
        <button
          type="button"
          className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50"
          onClick={() => hasNext && onPageChange(currentPage + 1)}
          disabled={!hasNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
