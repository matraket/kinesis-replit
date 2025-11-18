export interface Column<TData> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: TData) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<TData> {
  columns: Column<TData>[];
  data: TData[];
  isLoading: boolean;
  onRowClick?: (row: TData) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
}

export interface SortState {
  key: string;
  direction: 'asc' | 'desc';
}
