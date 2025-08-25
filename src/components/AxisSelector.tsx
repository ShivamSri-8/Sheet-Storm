import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, BarChart3, LineChart, PieChart, Zap } from "lucide-react";

interface AxisSelectorProps {
  headers: string[];
  selectedXAxis: string;
  selectedYAxis: string;
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'bubble' | 'doughnut' | 'polarArea' | 'heatmap';
  onXAxisChange: (value: string) => void;
  onYAxisChange: (value: string) => void;
  onChartTypeChange: (type: 'bar' | 'line' | 'pie' | 'scatter' | 'bubble' | 'doughnut' | 'polarArea' | 'heatmap') => void;
}

export const AxisSelector = ({
  headers,
  selectedXAxis,
  selectedYAxis,
  chartType,
  onXAxisChange,
  onYAxisChange,
  onChartTypeChange,
}: AxisSelectorProps) => {
  const chartOptions = [
    { type: 'bar' as const, label: 'Bar Chart', icon: BarChart3 },
    { type: 'line' as const, label: 'Line Chart', icon: LineChart },
    { type: 'pie' as const, label: 'Pie Chart', icon: PieChart },
    { type: 'scatter' as const, label: 'Scatter Plot', icon: Zap },
  ];

  return (
    <Card className="shadow-card-custom">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-6 w-6 text-analytics-blue" />
          <span>Chart Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart Type Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Chart Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {chartOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.type}
                  variant={chartType === option.type ? "analytics" : "outline"}
                  onClick={() => onChartTypeChange(option.type)}
                  className="h-16 flex-col space-y-1"
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{option.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Axis Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              X-Axis (Categories)
            </label>
            <Select value={selectedXAxis} onValueChange={onXAxisChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select X-axis" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Y-Axis (Values)
            </label>
            <Select value={selectedYAxis} onValueChange={onYAxisChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Y-axis" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedXAxis && selectedYAxis && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <span className="font-medium">Ready to generate chart:</span> {selectedXAxis} vs {selectedYAxis}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};