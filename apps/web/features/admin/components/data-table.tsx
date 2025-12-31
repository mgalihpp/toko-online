"use client";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/lib/utils";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  searchKey?: string | string[];
  stickyLastColumn?: boolean;
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (term: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchKey = "name",
  stickyLastColumn = true,
  page,
  pageCount,
  onPageChange,
  onSearch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const isServerSide = typeof pageCount === "number";

  const table = useReactTable({
    data,
    columns,
    pageCount: isServerSide ? (pageCount ?? -1) : undefined,
    manualPagination: isServerSide,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(isServerSide && page !== undefined
        ? {
            pagination: {
              pageIndex: page - 1,
              pageSize: 10,
            },
          }
        : {}),
    },
  });

  /** 🔍 Fungsi bantu: ambil nilai nested seperti "user.name" */
  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  /** 🔎 Filter data secara manual (Client Side Only) */
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const filteredData = useMemo(() => {
    if (isServerSide) return data; // Skip filtering if server-side
    if (!globalFilter) return data;
    const keys = Array.isArray(searchKey) ? searchKey : [searchKey];
    const search = globalFilter.toLowerCase();

    return data.filter((item) =>
      keys.some((key) => {
        const value = getNestedValue(item, key);
        return value?.toString().toLowerCase().includes(search);
      }),
    );
  }, [data, globalFilter, searchKey, isServerSide]);

  table.setOptions((prev) => ({
    ...prev,
    data: filteredData,
  }));

  const renderSortIcon = (isSorted: false | "asc" | "desc") => {
    if (isSorted === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
    if (isSorted === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
  };

  useEffect(() => {
    if (!onSearch) return;

    const timeoutId = setTimeout(() => {
      onSearch(globalFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [globalFilter, onSearch]);

  const handleSearch = (value: string) => {
    setGlobalFilter(value);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto bg-transparent">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table className="w-full min-w-max">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const isLast = index === headerGroup.headers.length - 1;
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "whitespace-nowrap",
                        stickyLastColumn &&
                          isLast &&
                          "sticky right-0 bg-background/95 backdrop-blur z-20 border-l shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]",
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          onClick={() => header.column.toggleSorting()}
                          className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer select-none"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() &&
                            renderSortIcon(header.column.getIsSorted())}
                        </button>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => {
                    const isLast = index === row.getVisibleCells().length - 1;
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          stickyLastColumn &&
                            isLast &&
                            "sticky right-0 bg-background/95 backdrop-blur z-10 border-l shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {/* Untuk server side, kita pakai total data dari props pageCount (if available) or something else. 
              Tapi pageCount in tanstack is just total Pages. 
              Usually we want 'rows total'. 
              For now keep client side count logic or improvement needed? 
              Existing: table.getFilteredRowModel().rows.length.
              Client side: shows current page rows count if paginated? NO getFilteredRowModel returns ALL filtered rows.
              Server side: data.length is only current page rows.
              Let's just show current page info for server side.
           */}
          {isServerSide
            ? `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`
            : `${table.getFilteredRowModel().rows.length} row(s) total`}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isServerSide && onPageChange && page) {
                onPageChange(page - 1);
              } else {
                table.previousPage();
              }
            }}
            disabled={
              isServerSide && page ? page <= 1 : !table.getCanPreviousPage()
            }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isServerSide && onPageChange && page) {
                onPageChange(page + 1);
              } else {
                table.nextPage();
              }
            }}
            disabled={
              isServerSide && page && pageCount
                ? page >= pageCount
                : !table.getCanNextPage()
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
