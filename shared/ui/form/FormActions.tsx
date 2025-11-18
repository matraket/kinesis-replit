import React from 'react';
import { FormActionsProps } from './types';

export function FormActions({
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryDisabled,
  secondaryDisabled,
  isLoading,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-6 border-t border-admin-border">
      {secondaryLabel && (
        <button
          type="button"
          onClick={onSecondary}
          disabled={secondaryDisabled || isLoading}
          className="px-4 py-2 text-sm font-medium text-admin-muted bg-admin-navy rounded-md hover:bg-admin-surfaceLight disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {secondaryLabel}
        </button>
      )}
      <button
        type={onPrimary ? 'button' : 'submit'}
        onClick={onPrimary}
        disabled={primaryDisabled || isLoading}
        className="px-4 py-2 text-sm font-medium text-white bg-admin-accent rounded-md hover:bg-admin-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {primaryLabel}
      </button>
    </div>
  );
}
