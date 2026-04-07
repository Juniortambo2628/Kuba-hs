"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  LayoutGrid, 
  List, 
  Filter,
  CheckSquare,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

interface DataToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  
  viewMode?: 'grid' | 'list';
  onViewChange?: (mode: 'grid' | 'list') => void;
  
  filters?: FilterGroup[];
  
  selectedCount?: number;
  onSelectAll?: (checked: boolean) => void;
  bulkActions?: BulkAction[];
}

export function DataToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  viewMode,
  onViewChange,
  filters = [],
  selectedCount = 0,
  onSelectAll,
  bulkActions = [],
}: DataToolbarProps) {
  const activeFiltersCount = filters.filter(f => f.value && f.value !== "all" && f.value !== "").length;

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-card p-4 rounded-xl border border-border shadow-sm mb-6">
      
      {/* Search & Actions */}
      <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-12 bg-background border-border h-10 w-full rounded-lg"
          />
        </div>

        {/* Filters */}
        {filters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 border-border bg-background gap-2 font-medium">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="hidden sm:inline">Filter</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] rounded-sm">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filters.map((filter, idx) => (
                 <div key={filter.id} className="py-2">
                   <p className="px-2 text-xs font-medium text-foreground mb-1.5">{filter.label}</p>
                   {filter.options.map(opt => (
                     <DropdownMenuCheckboxItem
                       key={opt.value}
                       checked={filter.value === opt.value}
                       onCheckedChange={() => filter.onChange(opt.value)}
                       className="rounded-lg text-sm cursor-pointer"
                     >
                       {opt.label}
                     </DropdownMenuCheckboxItem>
                   ))}
                   {idx < filters.length - 1 && <DropdownMenuSeparator className="mt-2" />}
                 </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* View Toggles & Bulk Actions */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {onSelectAll && bulkActions.length > 0 && (
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="secondary" className="h-10 gap-2 font-medium relative overflow-hidden">
                 {selectedCount > 0 ? (
                    <span className="flex items-center gap-2 text-primary font-bold">
                      <CheckSquare className="w-4 h-4" />
                      {selectedCount} Selected
                    </span>
                 ) : (
                    <span className="flex items-center gap-2 text-muted-foreground">
                       <CheckSquare className="w-4 h-4 opacity-50" />
                       Bulk Actions
                    </span>
                 )}
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-48 rounded-xl p-1">
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5">Action on {selectedCount > 0 ? selectedCount : 'all'} items</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                   onClick={() => onSelectAll(selectedCount === 0)}
                   className="rounded-lg cursor-pointer"
                >
                   {selectedCount > 0 ? 'Deselect All' : 'Select All'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {bulkActions.map((action, i) => (
                  <DropdownMenuItem 
                    key={i} 
                    onClick={action.onClick}
                    disabled={selectedCount === 0}
                    className={`rounded-lg cursor-pointer flex items-center gap-2 ${action.destructive ? 'text-red-500 focus:text-red-600 focus:bg-red-50' : ''}`}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}
             </DropdownMenuContent>
           </DropdownMenu>
        )}

        {/* View Toggles */}
        {viewMode && onViewChange && (
          <div className="flex items-center bg-background border border-border rounded-lg p-1">
            <button
              onClick={() => onViewChange('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
}
