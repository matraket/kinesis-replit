import React from 'react';
import { FormProps } from './types';

export function Form({
  title,
  description,
  children,
  columns = 1,
  onSubmit,
}: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-admin-surface rounded-lg border border-admin-border p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-admin-white">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-admin-muted">{description}</p>
        )}
      </div>

      <div
        className={`grid gap-6 ${
          columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {children}
      </div>
    </form>
  );
}
