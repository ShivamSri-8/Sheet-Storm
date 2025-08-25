import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Grid3X3, X } from "lucide-react";

interface PivotTableProps {
  data: any[];
  headers: string[];
}

interface PivotConfig {
  rows: string[];
  values: string[];
  aggregation: 'sum' | 'count' | 'average' | 'min' | 'max';
}

export const PivotTable = ({ data, headers }: PivotTableProps) => {
  const [pivotConfig, setPivotConfig] = useState<PivotConfig>({
    rows: [],
    values: [],
    aggregation: 'sum'
  });

  const addRowField = (field: string) => {
    if (!pivotConfig.rows.includes(field)) {
      setPivotConfig(prev => ({
        ...prev,
        rows: [...prev.rows, field]
      }));
    }
  };

  const removeRowField = (field: string) => {
    setPivotConfig(prev => ({
      ...prev,
      rows: prev.rows.filter(r => r !== field)
    }));
  };

  const addValueField = (field: string) => {
    if (!pivotConfig.values.includes(field)) {
      setPivotConfig(prev => ({
        ...prev,
        values: [...prev.values, field]
      }));
    }
  };

  const removeValueField = (field: string) => {
    setPivotConfig(prev => ({
      ...prev,
      values: prev.values.filter(v => v !== field)
    }));
  };

  const pivotData = useMemo(() => {
    if (pivotConfig.rows.length === 0 || pivotConfig.values.length === 0) {
      return { rows: [], headers: [] };
    }

    const groups: { [key: string]: any[] } = {};
    
    // Group data by row fields
    data.forEach(row => {
      const key = pivotConfig.rows.map(field => row[field]).join(' | ');
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(row);
    });

    // Calculate aggregations
    const pivotRows = Object.entries(groups).map(([key, rows]) => {
      const result: any = {};
      
      // Add row field values
      const keyParts = key.split(' | ');
      pivotConfig.rows.forEach((field, index) => {
        result[field] = keyParts[index];
      });

      // Calculate value field aggregations
      pivotConfig.values.forEach(valueField => {
        const values = rows.map(row => parseFloat(row[valueField]) || 0);
        
        switch (pivotConfig.aggregation) {
          case 'sum':
            result[`${valueField} (Sum)`] = values.reduce((a, b) => a + b, 0);
            break;
          case 'count':
            result[`${valueField} (Count)`] = values.length;
            break;
          case 'average':
            result[`${valueField} (Avg)`] = values.reduce((a, b) => a + b, 0) / values.length;
            break;
          case 'min':
            result[`${valueField} (Min)`] = Math.min(...values);
            break;
          case 'max':
            result[`${valueField} (Max)`] = Math.max(...values);
            break;
        }
      });

      return result;
    });

    const pivotHeaders = [
      ...pivotConfig.rows,
      ...pivotConfig.values.map(v => `${v} (${pivotConfig.aggregation.charAt(0).toUpperCase() + pivotConfig.aggregation.slice(1)})`)
    ];

    return { rows: pivotRows, headers: pivotHeaders };
  }, [data, pivotConfig]);

  const numericHeaders = headers.filter(header => {
    return data.some(row => !isNaN(parseFloat(row[header])));
  });

  const availableRowFields = headers.filter(h => !pivotConfig.rows.includes(h));
  const availableValueFields = numericHeaders.filter(h => !pivotConfig.values.includes(h));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5" />
          Pivot Table Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Row Fields */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Row Fields</div>
            <div className="min-h-[80px] p-2 border-2 border-dashed rounded-lg">
              {pivotConfig.rows.length === 0 ? (
                <div className="text-sm text-muted-foreground">Drop fields here</div>
              ) : (
                <div className="space-y-1">
                  {pivotConfig.rows.map(field => (
                    <Badge key={field} variant="secondary" className="flex items-center gap-1">
                      {field}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeRowField(field)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Select onValueChange={addRowField}>
              <SelectTrigger>
                <SelectValue placeholder="Add row field" />
              </SelectTrigger>
              <SelectContent>
                {availableRowFields.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Value Fields */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Value Fields</div>
            <div className="min-h-[80px] p-2 border-2 border-dashed rounded-lg">
              {pivotConfig.values.length === 0 ? (
                <div className="text-sm text-muted-foreground">Drop fields here</div>
              ) : (
                <div className="space-y-1">
                  {pivotConfig.values.map(field => (
                    <Badge key={field} variant="secondary" className="flex items-center gap-1">
                      {field}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeValueField(field)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Select onValueChange={addValueField}>
              <SelectTrigger>
                <SelectValue placeholder="Add value field" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                {availableValueFields.length > 0 ? (
                  availableValueFields.map(header => (
                    <SelectItem key={header} value={header}>{header}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-fields" disabled>No numeric fields available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Aggregation */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Aggregation</div>
            <Select
              value={pivotConfig.aggregation}
              onValueChange={(value: any) => setPivotConfig(prev => ({ ...prev, aggregation: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sum">Sum</SelectItem>
                <SelectItem value="count">Count</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="min">Minimum</SelectItem>
                <SelectItem value="max">Maximum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pivot Table Results */}
        {pivotData.rows.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Results</div>
            <div className="border rounded-lg overflow-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    {pivotData.headers.map(header => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pivotData.rows.map((row, index) => (
                    <TableRow key={index}>
                      {pivotData.headers.map(header => (
                        <TableCell key={header}>
                          {typeof row[header] === 'number' ? row[header].toFixed(2) : row[header]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};