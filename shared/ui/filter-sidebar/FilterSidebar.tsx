import React, { useState, useEffect } from 'react';
import { FilterSidebarProps, FilterSection } from './types';
import { X, Filter } from 'lucide-react';

export function FilterSidebar({
  sections,
  isOpen,
  onToggle,
  onApply,
  onReset,
}: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    const initialFilters: Record<string, any> = {};
    sections.forEach((section) => {
      if (section.filter.type === 'checkbox') {
        initialFilters[section.id] = section.filter.options
          .filter((opt) => opt.checked)
          .map((opt) => opt.value);
      } else if (section.filter.type === 'radio') {
        initialFilters[section.id] = section.filter.selected || '';
      } else if (section.filter.type === 'dateRange') {
        initialFilters[section.id] = {
          from: section.filter.from || '',
          to: section.filter.to || '',
        };
      }
    });
    setLocalFilters(initialFilters);
  }, [sections]);

  const handleCheckboxChange = (sectionId: string, value: string, checked: boolean) => {
    setLocalFilters((prev) => {
      const current = prev[sectionId] || [];
      return {
        ...prev,
        [sectionId]: checked
          ? [...current, value]
          : current.filter((v: string) => v !== value),
      };
    });
  };

  const handleRadioChange = (sectionId: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [sectionId]: value,
    }));
  };

  const handleDateRangeChange = (sectionId: string, field: 'from' | 'to', value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [field]: value,
      },
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const resetFilters: Record<string, any> = {};
    sections.forEach((section) => {
      if (section.filter.type === 'checkbox') {
        resetFilters[section.id] = [];
      } else if (section.filter.type === 'radio') {
        resetFilters[section.id] = '';
      } else if (section.filter.type === 'dateRange') {
        resetFilters[section.id] = { from: '', to: '' };
      }
    });
    setLocalFilters(resetFilters);
    onReset();
  };

  const renderFilter = (section: FilterSection) => {
    if (section.filter.type === 'checkbox') {
      return (
        <div className="space-y-2">
          {section.filter.options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={localFilters[section.id]?.includes(option.value) || false}
                onChange={(e) =>
                  handleCheckboxChange(section.id, option.value, e.target.checked)
                }
                className="w-4 h-4 rounded border-admin-border bg-admin-surface text-admin-accent focus:ring-2 focus:ring-admin-accent focus:ring-offset-0"
              />
              <span className="text-sm text-admin-white group-hover:text-admin-accent transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      );
    }

    if (section.filter.type === 'radio') {
      return (
        <div className="space-y-2">
          {section.filter.options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name={section.id}
                checked={localFilters[section.id] === option.value}
                onChange={() => handleRadioChange(section.id, option.value)}
                className="w-4 h-4 border-admin-border bg-admin-surface text-admin-accent focus:ring-2 focus:ring-admin-accent focus:ring-offset-0"
              />
              <span className="text-sm text-admin-white group-hover:text-admin-accent transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      );
    }

    if (section.filter.type === 'dateRange') {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-admin-muted mb-1">Desde</label>
            <input
              type="date"
              value={localFilters[section.id]?.from || ''}
              onChange={(e) => handleDateRangeChange(section.id, 'from', e.target.value)}
              className="w-full px-3 py-2 bg-admin-navy border border-admin-border rounded-md text-sm text-admin-white focus:outline-none focus:ring-2 focus:ring-admin-accent"
            />
          </div>
          <div>
            <label className="block text-xs text-admin-muted mb-1">Hasta</label>
            <input
              type="date"
              value={localFilters[section.id]?.to || ''}
              onChange={(e) => handleDateRangeChange(section.id, 'to', e.target.value)}
              className="w-full px-3 py-2 bg-admin-navy border border-admin-border rounded-md text-sm text-admin-white focus:outline-none focus:ring-2 focus:ring-admin-accent"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen w-80 bg-admin-surface border-r border-admin-border
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-admin-border">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-admin-accent" />
              <h3 className="font-semibold text-admin-white">Filtros</h3>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-md hover:bg-admin-navy transition-colors"
              aria-label="Cerrar filtros"
            >
              <X className="h-5 w-5 text-admin-muted" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {sections.map((section) => (
              <div key={section.id}>
                <h4 className="text-sm font-semibold text-admin-white mb-3">
                  {section.title}
                </h4>
                {renderFilter(section)}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-admin-border flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 text-sm font-medium text-admin-muted bg-admin-navy rounded-md hover:bg-admin-surfaceLight transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-admin-accent rounded-md hover:bg-admin-accent/90 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
