import React, { useState } from 'react';
import { Column, DataTableProps, SortState } from './types';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export function DataTable<TData extends Record<string, any>>({
  columns,
  data,
  isLoading,
  onRowClick,
  page,
  pageSize,
  total,
  onPageChange,
  emptyMessage = 'No se encontraron datos',
  emptyAction,
}: DataTableProps<TData>) {
  const [sortState, setSortState] = useState<SortState | null>(null);

  const handleSort = (column: Column<TData>) => {
    if (!column.sortable) return;

    setSortState((prev) => {
      if (prev?.key === column.key) {
        return { key: column.key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key: column.key, direction: 'asc' };
    });
  };

  const sortedData = React.useMemo(() => {
    if (!sortState) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortState.key];
      const bValue = b[sortState.key];

      if (aValue === bValue) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortState]);

  const totalPages = Math.ceil(total / pageSize);
  const canPreviousPage = page > 1;
  const canNextPage = page < totalPages;

  const getSortIcon = (column: Column<TData>) => {
    if (!column.sortable) return null;
    
    if (sortState?.key === column.key) {
      return sortState.direction === 'asc' ? (
        <ArrowUp className="h-4 w-4 ml-1" />
      ) : (
        <ArrowDown className="h-4 w-4 ml-1" />
      );
    }
    return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
  };

  if (isLoading) {
    return (
      <div className="w-full bg-admin-surface rounded-lg border border-admin-border overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-admin-surfaceLight border-b border-admin-border" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b border-admin-border bg-admin-surface" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-admin-surface rounded-lg border border-admin-border p-12 text-center">
        <p className="text-admin-muted mb-4">{emptyMessage}</p>
        {emptyAction && (
          <button
            onClick={emptyAction.onClick}
            className="px-4 py-2 bg-admin-accent text-white rounded-lg hover:bg-admin-accent/90 transition-colors"
          >
            {emptyAction.label}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-admin-surface rounded-lg border border-admin-border overflow-hidden">
      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-admin-surfaceLight border-b border-admin-border">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-semibold text-admin-muted uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-admin-surface select-none' : ''
                  } ${column.className || ''}`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`transition-colors ${
                  onRowClick
                    ? 'cursor-pointer hover:bg-admin-surfaceLight'
                    : ''
                } ${rowIndex % 2 === 0 ? 'bg-admin-surface' : 'bg-admin-navy'}`}
                onClick={() => onRowClick?.(row)}
                style={{ minHeight: '44px' }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 text-sm text-admin-white ${column.className || ''}`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Visible on Mobile Only */}
      <div className="sm:hidden divide-y divide-admin-border">
        {sortedData.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`p-4 ${rowIndex % 2 === 0 ? 'bg-admin-surface' : 'bg-admin-navy'}`}
          >
            {columns.filter(col => col.key !== 'actions').map((column) => (
              <div key={column.key} className="flex justify-between py-2 text-sm">
                <span className="text-admin-muted font-medium">{column.label}:</span>
                <span className="text-admin-white text-right ml-2">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </span>
              </div>
            ))}
            {/* Actions row at bottom of card */}
            {(() => {
              const actionsColumn = columns.find(col => col.key === 'actions');
              if (actionsColumn && actionsColumn.render) {
                return (
                  <div className="pt-3 mt-2 border-t border-admin-border flex justify-end gap-2">
                    {actionsColumn.render(undefined, row)}
                  </div>
                );
              }
              return null;
            })()}
          </div>
        ))}
      </div>

      {/* Pagination - Responsive */}
      <div className="px-4 sm:px-6 py-4 bg-admin-surfaceLight border-t border-admin-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs sm:text-sm text-admin-muted text-center sm:text-left">
          Mostrando {Math.min((page - 1) * pageSize + 1, total)} a{' '}
          {Math.min(page * pageSize, total)} de {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!canPreviousPage}
            className="p-2 rounded-md hover:bg-admin-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-5 w-5 text-admin-muted" />
          </button>
          <span className="text-xs sm:text-sm text-admin-white px-2 sm:px-4">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!canNextPage}
            className="p-2 rounded-md hover:bg-admin-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-5 w-5 text-admin-muted" />
          </button>
        </div>
      </div>
    </div>
  );
}
