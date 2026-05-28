'use client';

import { SkeletonTable } from '@/components/ui/skeleton';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useReducer, useRef } from 'react';
import { DataTableBody } from './DataTableBody';
import { DataTablePagination } from './DataTablePagination';
import { DataTableToolbar } from './DataTableToolbar';

/**
 * Server-side pagination info (Django Ninja format)
 */
interface ServerPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  showColumnToggle?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Server-side pagination (for Django integration) */
  serverPagination?: ServerPagination;
  /** Callback for server-side pagination */
  onPaginationChange?: (page: number, pageSize: number) => void;
  /** Callback for server-side search */
  onSearchChange?: (search: string) => void;
  /** Debounce delay for search (ms) */
  searchDebounce?: number;
}

interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: Record<string, boolean>;
  searchValue: string;
}

type TableAction =
  | { type: 'SET_SORTING'; payload: SortingState }
  | { type: 'SET_COLUMN_FILTERS'; payload: ColumnFiltersState }
  | { type: 'SET_COLUMN_VISIBILITY'; payload: VisibilityState }
  | { type: 'SET_ROW_SELECTION'; payload: Record<string, boolean> }
  | { type: 'SET_SEARCH_VALUE'; payload: string };

function tableReducer(state: TableState, action: TableAction): TableState {
  switch (action.type) {
    case 'SET_SORTING': return { ...state, sorting: action.payload };
    case 'SET_COLUMN_FILTERS': return { ...state, columnFilters: action.payload };
    case 'SET_COLUMN_VISIBILITY': return { ...state, columnVisibility: action.payload };
    case 'SET_ROW_SELECTION': return { ...state, rowSelection: action.payload };
    case 'SET_SEARCH_VALUE': return { ...state, searchValue: action.payload };
    default: return state;
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  showColumnToggle = true,
  showPagination = true,
  pageSize = 10,
  isLoading = false,
  serverPagination,
  onPaginationChange,
  onSearchChange,
  searchDebounce = 300,
}: DataTableProps<TData, TValue>) {
  const [tableState, dispatch] = useReducer(tableReducer, {
    sorting: [],
    columnFilters: [],
    columnVisibility: {},
    rowSelection: {},
    searchValue: '',
  });
  const { sorting, columnFilters, columnVisibility, rowSelection, searchValue } = tableState;

  const setSorting = (updater: SortingState | ((prev: SortingState) => SortingState)) =>
    dispatch({ type: 'SET_SORTING', payload: typeof updater === 'function' ? updater(sorting) : updater });
  const setColumnFilters = (updater: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) =>
    dispatch({ type: 'SET_COLUMN_FILTERS', payload: typeof updater === 'function' ? updater(columnFilters) : updater });
  const setColumnVisibility = (updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)) =>
    dispatch({ type: 'SET_COLUMN_VISIBILITY', payload: typeof updater === 'function' ? updater(columnVisibility) : updater });
  const setRowSelection = (updater: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) =>
    dispatch({ type: 'SET_ROW_SELECTION', payload: typeof updater === 'function' ? updater(rowSelection) : updater });
  const setSearchValue = (value: string) =>
    dispatch({ type: 'SET_SEARCH_VALUE', payload: value });

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (onSearchChange) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        onSearchChange(value);
      }, searchDebounce);
    }
  };

  const handleLocalSearchChange = (value: string) => {
    table.getColumn(searchKey!)?.setFilterValue(value);
  };

  const isServerSide = !!serverPagination;
  const pagination: PaginationState = isServerSide
    ? { pageIndex: serverPagination.page - 1, pageSize: serverPagination.pageSize }
    : { pageIndex: 0, pageSize };

  const handlePaginationChange: OnChangeFn<PaginationState> = updater => {
    if (!onPaginationChange) return;
    const newState = typeof updater === 'function' ? updater(pagination) : updater;
    onPaginationChange(newState.pageIndex + 1, newState.pageSize);
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isServerSide ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: isServerSide ? undefined : getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    ...(isServerSide
      ? {
          manualPagination: true,
          manualFiltering: true,
          pageCount: serverPagination.totalPages,
          onPaginationChange: handlePaginationChange,
        }
      : {
          initialState: { pagination: { pageSize } },
        }),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(isServerSide && { pagination }),
    },
  });

  if (isLoading && data.length === 0) {
    return <SkeletonTable rows={pageSize} columns={columns.length} />;
  }

  const currentPage = isServerSide
    ? serverPagination.page
    : table.getState().pagination.pageIndex + 1;
  const totalPages = isServerSide
    ? serverPagination.totalPages
    : table.getPageCount();
  const totalRows = isServerSide
    ? serverPagination.total
    : table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        searchPlaceholder={searchPlaceholder}
        showColumnToggle={showColumnToggle}
        isLoading={isLoading}
        searchValue={searchValue}
        onSearchChange={onSearchChange ? handleSearchChange : undefined}
        onLocalSearchChange={handleLocalSearchChange}
      />

      <DataTableBody table={table} columns={columns} />

      {showPagination && (
        <DataTablePagination
          table={table}
          data={data}
          isLoading={isLoading}
          isServerSide={isServerSide}
          serverPagination={serverPagination}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          onPaginationChange={onPaginationChange}
        />
      )}
    </div>
  );
}
