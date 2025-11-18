import React from 'react';
import { FormFieldProps } from './types';

export function FormField({
  label,
  error,
  required,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-admin-white">
        {label}
        {required && <span className="text-admin-error ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-admin-muted">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs text-admin-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
