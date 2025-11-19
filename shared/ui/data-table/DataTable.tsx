import React, { useState } from 'react';
import { Column, DataTableProps, SortState } from './types';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react';

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
  mobileActions,
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

  // Get primary and secondary columns for mobile
  const primaryColumn = columns.find(col => col.key !== 'actions') || columns[0];
  const secondaryColumn = columns.find(col => col.key !== 'actions' && col.key !== primaryColumn.key);

  return (
    <div className="w-full">
      {/* DESKTOP TABLE VIEW - Only visible on sm and up (>=640px) */}
      <div className="hidden sm:block bg-admin-surface rounded-lg border border-admin-border overflow-hidden">
        <div className="overflow-x-auto">
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

        {/* Desktop Pagination */}
        <div className="px-6 py-4 bg-admin-surfaceLight border-t border-admin-border flex items-center justify-between">
          <div className="text-sm text-admin-muted">
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
            <span className="text-sm text-admin-white px-4">
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

      {/* MOBILE CARD VIEW - Only visible below sm (<640px) */}
      <div className="block sm:hidden">
        {/* Mobile Cards Container with minimal padding */}
        <div className="px-2 py-3 space-y-2">
          {sortedData.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`bg-admin-surface border border-admin-border rounded-lg p-3 shadow-sm ${
                onRowClick ? 'cursor-pointer active:bg-admin-surfaceLight' : ''
              }`}
              onClick={() => onRowClick?.(row)}
            >
              {/* Primary info (Name) - Large and bold */}
              <div className="mb-2">
                <h3 className="text-base font-semibold text-admin-white">
                  {primaryColumn.render
                    ? primaryColumn.render(row[primaryColumn.key], row)
                    : row[primaryColumn.key]}
                </h3>
              </div>

              {/* Secondary info (Role) - Small text */}
              {secondaryColumn && (
                <div className="mb-2">
                  <p className="text-sm text-admin-muted">
                    {secondaryColumn.render
                      ? secondaryColumn.render(row[secondaryColumn.key], row)
                      : row[secondaryColumn.key]}
                  </p>
                </div>
              )}

              {/* Other columns (badges, flags) - Compact row */}
              <div className="flex flex-wrap gap-2 mb-3">
                {columns
                  .filter(col => 
                    col.key !== 'actions' && 
                    col.key !== primaryColumn.key && 
                    col.key !== secondaryColumn?.key
                  )
                  .map((column) => (
                    <div key={column.key} className="text-xs">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </div>
                  ))}
              </div>

              {/* Action buttons - Full width, accessible */}
              {mobileActions && (
                <div className="flex gap-2 pt-3 border-t border-admin-border">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      mobileActions.onEdit(row);
                    }}
                    className="flex-1 h-11 bg-admin-accent text-white rounded-lg hover:bg-admin-accent/90 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      mobileActions.onDelete(row);
                    }}
                    className="flex-1 h-11 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Pagination - Single line, compact */}
        <div className="px-3 py-3 bg-admin-surfaceLight border-t border-admin-border flex items-center justify-between">
          <span className="text-xs text-admin-muted">
            {Math.min((page - 1) * pageSize + 1, total)}-{Math.min(page * pageSize, total)} de {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={!canPreviousPage}
              className="p-2 rounded-md hover:bg-admin-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4 w-4 text-admin-muted" />
            </button>
            <span className="text-xs text-admin-white px-2">
              {page}/{totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={!canNextPage}
              className="p-2 rounded-md hover:bg-admin-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-4 w-4 text-admin-muted" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
