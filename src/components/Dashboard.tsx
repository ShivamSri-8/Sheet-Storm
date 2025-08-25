import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnhancedFileUpload } from './EnhancedFileUpload';
import { ChartRenderer } from './ChartRenderer';
import { AxisSelector } from './AxisSelector';
import { UploadHistory } from './UploadHistory';
import { DataFilter, FilterCondition } from './DataFilter';
import { CalculatedFields, CalculatedField } from './CalculatedFields';
import { PivotTable } from './PivotTable';
import { InteractiveDashboard } from './InteractiveDashboard';
import { ThemeCustomizer } from './ThemeCustomizer';
import { BarChart3, TrendingUp, FileText, Users, Upload, Filter, Calculator, Grid3X3, Layout, Palette } from "lucide-react";

interface DashboardData {
  data: any[];
  headers: string[];
  fileName: string;
  uploadedAt: Date;
}

interface DashboardProps {
  user: { name: string; email: string; role: string };
}

export const Dashboard = ({ user }: DashboardProps) => {
  const [uploadHistory, setUploadHistory] = useState<DashboardData[]>([]);
  const [currentData, setCurrentData] = useState<DashboardData | null>(null);
  const [selectedXAxis, setSelectedXAxis] = useState<string>('');
  const [selectedYAxis, setSelectedYAxis] = useState<string>('');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter' | 'bubble' | 'doughnut' | 'polarArea' | 'heatmap'>('bar');
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [calculatedFields, setCalculatedFields] = useState<CalculatedField[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'filter' | 'calculate' | 'pivot' | 'dashboard' | 'theme'>('upload');
  const [theme, setTheme] = useState<any>(null);

  const handleDataParsed = (data: any[], headers: string[], fileName: string) => {
    const newData: DashboardData = {
      data,
      headers,
      fileName,
      uploadedAt: new Date(),
    };
    
    setCurrentData(newData);
    setUploadHistory(prev => [newData, ...prev]);
    
    // Auto-select first two numeric columns
    const numericHeaders = headers.filter(header => {
      return data.some(row => !isNaN(parseFloat(row[header])));
    });
    
    if (numericHeaders.length >= 2) {
      setSelectedXAxis(numericHeaders[0]);
      setSelectedYAxis(numericHeaders[1]);
    } else if (headers.length >= 2) {
      setSelectedXAxis(headers[0]);
      setSelectedYAxis(headers[1]);
    }
  };

  const handleHistorySelect = (historyData: DashboardData) => {
    setCurrentData(historyData);
    setSelectedXAxis('');
    setSelectedYAxis('');
    setFilters([]);
    setCalculatedFields([]);
  };

  // Apply filters to data
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

  // Apply calculated fields to data
  const applyCalculatedFields = (data: any[]): any[] => {
    if (calculatedFields.length === 0) return data;
    
    return data.map(row => {
      const newRow = { ...row };
      
      calculatedFields.forEach(field => {
        try {
          let expression = field.formula;
          const availableHeaders = currentData?.headers || [];
          
          // Replace column names with values
          availableHeaders.forEach(header => {
            const value = parseFloat(row[header]) || 0;
            expression = expression.replace(new RegExp(`\\b${header}\\b`, 'g'), value.toString());
          });

          // Basic arithmetic evaluation (safe)
          if (/^[0-9+\-*/().\s]+$/.test(expression)) {
            newRow[field.name] = Function(`"use strict"; return (${expression})`)();
          } else {
            newRow[field.name] = 0;
          }
        } catch {
          newRow[field.name] = 0;
        }
      });
      
      return newRow;
    });
  };

  // Get processed data
  const getProcessedData = () => {
    if (!currentData) return { data: [], headers: [] };
    
    let processedData = applyFilters(currentData.data);
    processedData = applyCalculatedFields(processedData);
    
    const allHeaders = [
      ...currentData.headers,
      ...calculatedFields.map(field => field.name)
    ];
    
    return { data: processedData, headers: allHeaders };
  };

  const { data: processedData, headers: allHeaders } = getProcessedData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="shadow-card-custom">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Uploads</p>
                  <p className="text-2xl font-bold text-analytics-blue">{uploadHistory.length}</p>
                </div>
                <FileText className="h-8 w-8 text-analytics-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card-custom">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Data Points</p>
                  <p className="text-2xl font-bold text-analytics-blue">
                    {currentData ? currentData.data.length : 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-analytics-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card-custom">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Charts Created</p>
                  <p className="text-2xl font-bold text-analytics-blue">
                    {currentData && selectedXAxis && selectedYAxis ? 1 : 0}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-analytics-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card-custom">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">User Role</p>
                  <p className="text-lg font-semibold text-analytics-blue capitalize">{user.role}</p>
                </div>
                <Users className="h-8 w-8 text-analytics-blue" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <Card className="shadow-card-custom">
              <CardHeader>
                <CardTitle>Analytics Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === 'upload' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('upload')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Data Upload
                </Button>
                <Button
                  variant={activeTab === 'filter' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('filter')}
                  disabled={!currentData}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Data Filters
                </Button>
                <Button
                  variant={activeTab === 'calculate' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('calculate')}
                  disabled={!currentData}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculated Fields
                </Button>
                <Button
                  variant={activeTab === 'pivot' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('pivot')}
                  disabled={!currentData}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Pivot Table
                </Button>
                <Button
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('dashboard')}
                  disabled={!currentData}
                >
                  <Layout className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === 'theme' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('theme')}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Themes
                </Button>
              </CardContent>
            </Card>

            {/* Upload History */}
            <div className="mt-6">
              <UploadHistory
                history={uploadHistory}
                onSelect={handleHistorySelect}
                currentFile={currentData?.fileName}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Data Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                {!currentData ? (
                  <div className="animate-fade-in">
                    <EnhancedFileUpload onDataParsed={handleDataParsed} />
                  </div>
                ) : (
                  <Card className="shadow-card-custom">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Another File</h3>
                          <p className="text-sm text-gray-600">Current file: {currentData.fileName}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentData(null)}
                          className="border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Chart Configuration */}
                {currentData && (
                  <div className="animate-slide-up">
                    <AxisSelector
                      headers={allHeaders}
                      selectedXAxis={selectedXAxis}
                      selectedYAxis={selectedYAxis}
                      chartType={chartType}
                      onXAxisChange={setSelectedXAxis}
                      onYAxisChange={setSelectedYAxis}
                      onChartTypeChange={setChartType}
                    />
                  </div>
                )}

                {/* Chart Display */}
                {currentData && selectedXAxis && selectedYAxis && (
                  <div className="animate-bounce-gentle">
                    <ChartRenderer
                      data={processedData}
                      xAxis={selectedXAxis}
                      yAxis={selectedYAxis}
                      chartType={chartType}
                      fileName={currentData.fileName}
                      theme={theme}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Data Filters Tab */}
            {activeTab === 'filter' && currentData && (
              <DataFilter
                headers={currentData.headers}
                filters={filters}
                onFiltersChange={setFilters}
                data={currentData.data}
              />
            )}

            {/* Calculated Fields Tab */}
            {activeTab === 'calculate' && currentData && (
              <CalculatedFields
                headers={currentData.headers}
                calculatedFields={calculatedFields}
                onCalculatedFieldsChange={setCalculatedFields}
                data={currentData.data}
              />
            )}

            {/* Pivot Table Tab */}
            {activeTab === 'pivot' && currentData && (
              <PivotTable
                data={processedData}
                headers={allHeaders}
              />
            )}

            {/* Interactive Dashboard Tab */}
            {activeTab === 'dashboard' && currentData && (
              <InteractiveDashboard
                data={processedData}
                headers={allHeaders}
                fileName={currentData.fileName}
                onAddChart={() => {}}
              />
            )}

            {/* Theme Customizer Tab */}
            {activeTab === 'theme' && (
              <ThemeCustomizer onThemeChange={setTheme} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};