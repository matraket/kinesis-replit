export interface FormProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  columns?: 1 | 2;
  onSubmit?: (e: React.FormEvent) => void;
}

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export interface FormActionsProps {
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  primaryDisabled?: boolean;
  secondaryDisabled?: boolean;
  isLoading?: boolean;
}
