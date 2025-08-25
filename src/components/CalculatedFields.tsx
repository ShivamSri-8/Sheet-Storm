import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface CalculatedField {
  id: string;
  name: string;
  formula: string;
  type: 'arithmetic' | 'aggregation';
}

interface CalculatedFieldsProps {
  headers: string[];
  calculatedFields: CalculatedField[];
  onCalculatedFieldsChange: (fields: CalculatedField[]) => void;
  data: any[];
}

export const CalculatedFields = ({ 
  headers, 
  calculatedFields, 
  onCalculatedFieldsChange, 
  data 
}: CalculatedFieldsProps) => {
  const [newField, setNewField] = useState({
    name: '',
    formula: '',
    type: 'arithmetic' as const
  });
  const { toast } = useToast();

  const addCalculatedField = () => {
    if (!newField.name || !newField.formula) {
      toast({
        title: "Error",
        description: "Please provide both field name and formula",
        variant: "destructive"
      });
      return;
    }

    try {
      // Test the formula with first row
      if (data.length > 0) {
        evaluateFormula(newField.formula, data[0], headers);
      }

      const field: CalculatedField = {
        ...newField,
        id: Date.now().toString()
      };
      
      onCalculatedFieldsChange([...calculatedFields, field]);
      setNewField({ name: '', formula: '', type: 'arithmetic' });
      
      toast({
        title: "Success",
        description: "Calculated field added successfully"
      });
    } catch (error) {
      toast({
        title: "Invalid Formula",
        description: "Please check your formula syntax",
        variant: "destructive"
      });
    }
  };

  const removeCalculatedField = (id: string) => {
    onCalculatedFieldsChange(calculatedFields.filter(f => f.id !== id));
  };

  const evaluateFormula = (formula: string, row: any, availableHeaders: string[]): number => {
    let expression = formula;
    
    // Replace column names with values
    availableHeaders.forEach(header => {
      const value = parseFloat(row[header]) || 0;
      expression = expression.replace(new RegExp(`\\b${header}\\b`, 'g'), value.toString());
    });

    // Basic arithmetic evaluation (safe)
    try {
      // Only allow numbers, operators, and parentheses
      if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        throw new Error('Invalid characters in formula');
      }
      return Function(`"use strict"; return (${expression})`)();
    } catch {
      return 0;
    }
  };

  const insertColumn = (columnName: string) => {
    setNewField(prev => ({
      ...prev,
      formula: prev.formula + columnName
    }));
  };

  const insertOperator = (operator: string) => {
    setNewField(prev => ({
      ...prev,
      formula: prev.formula + ` ${operator} `
    }));
  };

  const commonFormulas = [
    { name: 'Sum', formula: 'column1 + column2' },
    { name: 'Difference', formula: 'column1 - column2' },
    { name: 'Product', formula: 'column1 * column2' },
    { name: 'Ratio', formula: 'column1 / column2' },
    { name: 'Percentage', formula: '(column1 / column2) * 100' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculated Fields
          {calculatedFields.length > 0 && (
            <Badge variant="secondary">{calculatedFields.length} fields</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Calculated Fields */}
        {calculatedFields.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Active Fields:</div>
            <div className="space-y-2">
              {calculatedFields.map(field => (
                <div key={field.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{field.name}</div>
                    <div className="text-sm text-muted-foreground">{field.formula}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCalculatedField(field.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Calculated Field */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Field name (e.g., Profit)"
              value={newField.name}
              onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
            />
            <Select
              value={newField.type}
              onValueChange={(value: any) => setNewField(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arithmetic">Arithmetic</SelectItem>
                <SelectItem value="aggregation">Aggregation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            placeholder="Formula (e.g., Revenue - Cost)"
            value={newField.formula}
            onChange={(e) => setNewField(prev => ({ ...prev, formula: e.target.value }))}
          />

          {/* Quick Insert Buttons */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Insert Columns:</div>
            <div className="flex flex-wrap gap-1">
              {headers.map(header => (
                <Button
                  key={header}
                  variant="outline"
                  size="sm"
                  onClick={() => insertColumn(header)}
                >
                  {header}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Insert Operators:</div>
            <div className="flex gap-1">
              {['+', '-', '*', '/', '(', ')'].map(op => (
                <Button
                  key={op}
                  variant="outline"
                  size="sm"
                  onClick={() => insertOperator(op)}
                >
                  {op}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Common Formulas:</div>
            <div className="flex flex-wrap gap-1">
              {commonFormulas.map(formula => (
                <Button
                  key={formula.name}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewField(prev => ({ ...prev, formula: formula.formula }))}
                >
                  {formula.name}
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={addCalculatedField} className="w-full">
            <Plus className="h-4 w-4 mr-1" />
            Add Calculated Field
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};