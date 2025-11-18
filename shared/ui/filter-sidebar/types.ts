export type FilterType = 'checkbox' | 'radio' | 'dateRange';

export interface CheckboxFilter {
  type: 'checkbox';
  options: Array<{
    value: string;
    label: string;
    checked?: boolean;
  }>;
}

export interface RadioFilter {
  type: 'radio';
  options: Array<{
    value: string;
    label: string;
  }>;
  selected?: string;
}

export interface DateRangeFilter {
  type: 'dateRange';
  from?: string;
  to?: string;
}

export interface FilterSection {
  id: string;
  title: string;
  filter: CheckboxFilter | RadioFilter | DateRangeFilter;
}

export interface FilterSidebarProps {
  sections: FilterSection[];
  isOpen: boolean;
  onToggle: () => void;
  onApply: (filters: Record<string, any>) => void;
  onReset: () => void;
}
