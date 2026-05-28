'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';
import { ChevronDown, Loader2 } from 'lucide-react';
import React from 'react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder: string;
  showColumnToggle: boolean;
  isLoading: boolean;
  searchValue: string;
  onSearchChange?: (value: string) => void;
  onLocalSearchChange?: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder,
  showColumnToggle,
  isLoading,
  searchValue,
  onSearchChange,
  onLocalSearchChange,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-x-2">
        {(searchKey || onSearchChange) && (
          <div className="relative">
            <Input
              placeholder={searchPlaceholder}
              value={
                onSearchChange
                  ? searchValue
                  : ((table
                      .getColumn(searchKey!)
                      ?.getFilterValue() as string) ?? '')
              }
              onChange={event =>
                onSearchChange
                  ? onSearchChange(event.target.value)
                  : onLocalSearchChange?.(event.target.value)
              }
              className="max-w-sm"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>
        )}
      </div>

      {showColumnToggle && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .reduce<React.ReactNode[]>((acc, column) => {
                if (!column.getCanHide()) return acc;
                acc.push(
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
                return acc;
              }, [])}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
