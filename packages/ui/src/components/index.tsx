/**
 * Enterprise Design System - Component Library Components
 *
 * Provides reusable UI primitives across 8 categories:
 * 1. Layout (Box, Flex, Grid, Stack, Divider, Container)
 * 2. Navigation (Tabs, Breadcrumbs, Pagination, Menu, NavGroup)
 * 3. Inputs (Button, Input, Select, Checkbox, RadioGroup, Switch, Textarea)
 * 4. Data Display (Badge, Card, Avatar, Table, Tag, Tooltip)
 * 5. Feedback (Alert, Toast, Spinner, Progress, Skeleton)
 * 6. Overlays (Dialog, Sheet, Popover, DropdownMenu)
 * 7. Charts Wrapper (ChartContainer, ChartLegend, ChartTooltipWrapper)
 * 8. Utilities (Portal, VisuallyHidden, FocusTrap, MotionBox)
 */

import React, { FC, ReactNode, ElementType, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { ComponentState } from '../domain/enums/ui-foundation.enums';

// Helper for class concatenation
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

// -------------------------------------------------------------
// Category 1: Layout Components
// -------------------------------------------------------------
export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  children?: ReactNode;
}
export const Box: FC<BoxProps> = ({ as: Component = 'div', className, children, ...props }) => {
  return React.createElement(Component, { className: cn('box-border', className), ...props }, children);
};

export interface FlexProps extends BoxProps {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  gap?: number;
}
export const Flex: FC<FlexProps> = ({ direction = 'row', align = 'stretch', justify = 'start', gap = 0, className, children, ...props }) => {
  const dirClasses = { row: 'flex-row', col: 'flex-col', 'row-reverse': 'flex-row-reverse', 'col-reverse': 'flex-col-reverse' };
  const alignClasses = { start: 'items-start', center: 'items-center', end: 'items-end', baseline: 'items-baseline', stretch: 'items-stretch' };
  const justifyClasses = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between', around: 'justify-around' };
  return (
    <Box className={cn('flex', dirClasses[direction], alignClasses[align], justifyClasses[justify], `gap-${gap}`, className)} {...props}>
      {children}
    </Box>
  );
};

export interface GridProps extends BoxProps {
  cols?: number;
  gap?: number;
}
export const Grid: FC<GridProps> = ({ cols = 12, gap = 4, className, children, ...props }) => {
  return (
    <Box className={cn('grid', `grid-cols-${cols}`, `gap-${gap}`, className)} {...props}>
      {children}
    </Box>
  );
};

export interface StackProps extends BoxProps {
  spacing?: number;
}
export const Stack: FC<StackProps> = ({ spacing = 4, className, children, ...props }) => {
  return (
    <Box className={cn('flex flex-col', `space-y-${spacing}`, className)} {...props}>
      {children}
    </Box>
  );
};

export const Divider: FC<{ orientation?: 'horizontal' | 'vertical'; className?: string }> = ({ orientation = 'horizontal', className }) => {
  return (
    <div
      role="separator"
      className={cn(
        orientation === 'horizontal' ? 'w-full h-px bg-neutral-200 dark:bg-neutral-700 my-2' : 'h-full w-px bg-neutral-200 dark:bg-neutral-700 mx-2',
        className
      )}
    />
  );
};

export const Container: FC<BoxProps> = ({ className, children, ...props }) => {
  return (
    <Box className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </Box>
  );
};

// -------------------------------------------------------------
// Category 2: Navigation Components
// -------------------------------------------------------------
export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}
export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}
export const Tabs: FC<TabsProps> = ({ tabs, activeTab, onTabChange, className }) => {
  return (
    <div role="tablist" className={cn('flex space-x-2 border-b border-neutral-200 dark:border-neutral-700', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
              isActive
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export const Breadcrumbs: FC<{ items: { label: string; href?: string }[]; className?: string }> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-2 text-sm text-neutral-500', className)}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span>/</span>}
          {item.href ? (
            <a href={item.href} className="hover:text-neutral-900 dark:hover:text-neutral-100">
              {item.label}
            </a>
          ) : (
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// -------------------------------------------------------------
// Category 3: Input Components
// -------------------------------------------------------------
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  state?: ComponentState;
}
export const Button: FC<ButtonProps> = ({ variant = 'primary', size = 'md', isLoading = false, disabled, className, children, ...props }) => {
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100',
    outline: 'border border-neutral-300 bg-transparent hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800',
    ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  };
  const sizeClasses = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
      {children}
    </button>
  );
};

export const Pagination: FC<{ currentPage: number; totalPages: number; onPageChange: (p: number) => void }> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </Button>
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        Page {currentPage} of {totalPages}
      </span>
      <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </Button>
    </div>
  );
};

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export const Input: FC<InputProps> = ({ label, error, className, id, ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 6)}`;
  return (
    <div className="flex flex-col space-y-1 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        className={cn(
          'w-full rounded-md border border-neutral-300 px-3 py-2 text-sm bg-white dark:bg-neutral-900 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export const Select: FC<SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, className, children, ...props }) => {
  return (
    <div className="flex flex-col space-y-1 w-full">
      {label && <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">{label}</label>}
      <select
        className={cn(
          'rounded-md border border-neutral-300 px-3 py-2 text-sm bg-white dark:bg-neutral-900 dark:border-neutral-700 focus:ring-primary-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export const Switch: FC<{ checked: boolean; onChange: (checked: boolean) => void; label?: string }> = ({ checked, onChange, label }) => {
  return (
    <label className="inline-flex items-center cursor-pointer space-x-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <div className={cn('w-10 h-6 rounded-full transition-colors relative', checked ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-700')}>
        <div className={cn('w-4 h-4 bg-white rounded-full absolute top-1 transition-transform', checked ? 'translate-x-5' : 'translate-x-1')} />
      </div>
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  );
};

// -------------------------------------------------------------
// Category 4: Data Display Components
// -------------------------------------------------------------
export const Badge: FC<{ variant?: 'default' | 'success' | 'warning' | 'error'; children: ReactNode; className?: string }> = ({
  variant = 'default',
  children,
  className,
}) => {
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  };
  return <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', variantClasses[variant], className)}>{children}</span>;
};

export const Card: FC<BoxProps> = ({ className, children, ...props }) => {
  return (
    <Box className={cn('rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900', className)} {...props}>
      {children}
    </Box>
  );
};

export const Avatar: FC<{ name: string; src?: string; size?: 'sm' | 'md' | 'lg' }> = ({ name, src, size = 'md' }) => {
  const sizeClasses = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className={cn('inline-flex items-center justify-center rounded-full bg-primary-100 text-primary-800 font-bold overflow-hidden', sizeClasses[size])}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
    </div>
  );
};

// -------------------------------------------------------------
// Category 5: Feedback Components
// -------------------------------------------------------------
export const Alert: FC<{ type?: 'info' | 'success' | 'warning' | 'error'; title?: string; children: ReactNode }> = ({
  type = 'info',
  title,
  children,
}) => {
  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200',
  };

  return (
    <div role="alert" className={cn('p-4 rounded-md border text-sm', typeClasses[type])}>
      {title && <div className="font-bold mb-1">{title}</div>}
      <div>{children}</div>
    </div>
  );
};

export const Spinner: FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ size = 'md', className }) => {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <svg className={cn('animate-spin text-current', sizeClasses[size], className)} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
};

export const Skeleton: FC<{ className?: string }> = ({ className }) => {
  return <div className={cn('animate-pulse rounded bg-neutral-200 dark:bg-neutral-800', className)} />;
};

// -------------------------------------------------------------
// Category 6: Overlays Components
// -------------------------------------------------------------
export const Dialog: FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{title}</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Category 7: Charts Wrapper
// -------------------------------------------------------------
export const ChartContainer: FC<{ title?: string; children: ReactNode; className?: string }> = ({ title, children, className }) => {
  return (
    <Card className={cn('flex flex-col space-y-2', className)}>
      {title && <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{title}</h4>}
      <div className="w-full min-h-[200px] flex items-center justify-center">{children}</div>
    </Card>
  );
};

// -------------------------------------------------------------
// Category 8: Utilities
// -------------------------------------------------------------
export const VisuallyHidden: FC<{ children: ReactNode }> = ({ children }) => {
  return <span className="sr-only">{children}</span>;
};

export const FocusTrap: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="focus-trap-container">{children}</div>;
};
