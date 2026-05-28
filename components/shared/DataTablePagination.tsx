'use client';

import { Button } from '@/components/ui/button';
import { Table } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface ServerPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  data: TData[];
  isLoading: boolean;
  isServerSide: boolean;
  serverPagination?: ServerPagination;
  currentPage: number;
  totalPages: number;
  totalRows: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
}

export function DataTablePagination<TData>({
  table,
  data,
  isLoading,
  isServerSide,
  serverPagination,
  currentPage,
  totalPages,
  totalRows,
  onPaginationChange,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {isServerSide ? (
          <>
            Showing {data.length} of {totalRows} row(s)
          </>
        ) : (
          <>
            {table.getFilteredSelectedRowModel().rows.length} of {totalRows}{' '}
            row(s) selected.
          </>
        )}
      </div>
      <div className="flex items-center gap-x-6 lg:gap-x-8">
        <div className="flex items-center gap-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <select
            value={
              isServerSide
                ? serverPagination!.pageSize
                : table.getState().pagination.pageSize
            }
            onChange={e => {
              const newSize = Number(e.target.value);
              if (onPaginationChange) {
                onPaginationChange(1, newSize);
              } else {
                table.setPageSize(newSize);
              }
            }}
            className="h-8 w-[70px] rounded border border-input bg-background px-2 text-sm"
            disabled={isLoading}
          >
            {[10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages || 1}
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => {
              if (onPaginationChange) {
                onPaginationChange(1, serverPagination!.pageSize);
              } else {
                table.setPageIndex(0);
              }
            }}
            disabled={currentPage <= 1 || isLoading}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => {
              if (onPaginationChange) {
                onPaginationChange(currentPage - 1, serverPagination!.pageSize);
              } else {
                table.previousPage();
              }
            }}
            disabled={currentPage <= 1 || isLoading}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-0"
            onClick={() => {
              if (onPaginationChange) {
                onPaginationChange(currentPage + 1, serverPagination!.pageSize);
              } else {
                table.nextPage();
              }
            }}
            disabled={currentPage >= totalPages || isLoading}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => {
              if (onPaginationChange) {
                onPaginationChange(totalPages, serverPagination!.pageSize);
              } else {
                table.setPageIndex(totalPages - 1);
              }
            }}
            disabled={currentPage >= totalPages || isLoading}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
