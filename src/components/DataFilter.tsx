import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Filter } from "lucide-react";

export interface FilterCondition {
  id: string;
  column: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'not_equals';
  value: string;
}

interface DataFilterProps {
  headers: string[];
  filters: FilterCondition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
  data: any[];
}

export const DataFilter = ({ headers, filters, onFiltersChange, data }: DataFilterProps) => {
  const [newFilter, setNewFilter] = useState<Omit<FilterCondition, 'id'>>({
    column: '',
    operator: 'equals',
    value: ''
  });

  const addFilter = () => {
    if (newFilter.column && newFilter.value) {
      const filter: FilterCondition = {
        ...newFilter,
        id: Date.now().toString()
      };
      onFiltersChange([...filters, filter]);
      setNewFilter({ column: '', operator: 'equals', value: '' });
    }
  };

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter(f => f.id !== id));
  };

  const applyFilters = (data: any[]): any[] => {
    return data.filter(row => {
      return filters.every(filter => {
        const cellValue = row[filter.column];
        const filterValue = filter.value;
        
        switch (filter.operator) {
          case 'equals':
            return cellValue?.toString().toLowerCase() === filterValue.toLowerCase();
          case 'contains':
            return cellValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
          case 'greater':
            return parseFloat(cellValue) > parseFloat(filterValue);
          case 'less':
            return parseFloat(cellValue) < parseFloat(filterValue);
          case 'not_equals':
            return cellValue?.toString().toLowerCase() !== filterValue.toLowerCase();
          default:
            return true;
        }
      });
    });
  };

  const filteredCount = applyFilters(data).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Data Filters
          {filters.length > 0 && (
            <Badge variant="secondary">
              {filteredCount} / {data.length} rows
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Filters */}
        {filters.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <Badge key={filter.id} variant="outline" className="flex items-center gap-1">
                  {filter.column} {filter.operator} "{filter.value}"
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeFilter(filter.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add New Filter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Select
            value={newFilter.column}
            onValueChange={(value) => setNewFilter(prev => ({ ...prev, column: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {headers.map(header => (
                <SelectItem key={header} value={header}>{header}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={newFilter.operator}
            onValueChange={(value: any) => setNewFilter(prev => ({ ...prev, operator: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equals">Equals</SelectItem>
              <SelectItem value="contains">Contains</SelectItem>
              <SelectItem value="greater">Greater than</SelectItem>
              <SelectItem value="less">Less than</SelectItem>
              <SelectItem value="not_equals">Not equals</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Filter value"
            value={newFilter.value}
            onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && addFilter()}
          />

          <Button onClick={addFilter} disabled={!newFilter.column || !newFilter.value}>
            <Plus className="h-4 w-4 mr-1" />
            Add Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};