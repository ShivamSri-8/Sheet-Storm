import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartRendererProps {
  data: any[];
  xAxis: string;
  yAxis: string;
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'bubble' | 'doughnut' | 'polarArea' | 'heatmap';
  fileName: string;
  theme?: any;
}

export const ChartRenderer = ({ data, xAxis, yAxis, chartType, fileName, theme }: ChartRendererProps) => {
  const chartRef = useRef<any>(null);
  const { toast } = useToast();

  // Prepare chart data
  const prepareChartData = () => {
    const labels = data.map(row => row[xAxis]);
    const values = data.map(row => {
      const value = row[yAxis];
      return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    });

    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
    ];

    if (chartType === 'pie') {
      return {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
        }],
      };
    }

    if (chartType === 'scatter') {
      return {
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: data.map(row => ({
            x: isNaN(parseFloat(row[xAxis])) ? 0 : parseFloat(row[xAxis]),
            y: isNaN(parseFloat(row[yAxis])) ? 0 : parseFloat(row[yAxis]),
          })),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        }],
      };
    }

    return {
      labels,
      datasets: [{
        label: yAxis,
        data: values,
        backgroundColor: chartType === 'line' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        fill: chartType === 'line',
        tension: chartType === 'line' ? 0.4 : 0,
      }],
    };
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: `${yAxis} by ${xAxis}`,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    },
    scales: chartType !== 'pie' ? {
      x: {
        title: {
          display: true,
          text: xAxis,
          font: {
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: yAxis,
          font: {
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    } : {},
  };

  const downloadAsPNG = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current.canvas);
        const link = document.createElement('a');
        link.download = `${fileName}_chart.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        toast({
          title: "Chart downloaded!",
          description: "PNG file saved successfully",
        });
      } catch (error) {
        toast({
          title: "Download failed",
          description: "Could not save the chart",
          variant: "destructive",
        });
      }
    }
  };

  const downloadAsPDF = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current.canvas);
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF();
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.text(`Chart: ${yAxis} by ${xAxis}`, 20, 20);
        pdf.addImage(imgData, 'PNG', 10, 30, imgWidth, imgHeight);
        pdf.save(`${fileName}_chart.pdf`);
        
        toast({
          title: "Chart downloaded!",
          description: "PDF file saved successfully",
        });
      } catch (error) {
        toast({
          title: "Download failed",
          description: "Could not save the chart",
          variant: "destructive",
        });
      }
    }
  };

  const renderChart = () => {
    const chartData = prepareChartData();
    
    switch (chartType) {
      case 'bar':
        return <Bar ref={chartRef} data={chartData as any} options={chartOptions} />;
      case 'line':
        return <Line ref={chartRef} data={chartData as any} options={chartOptions} />;
      case 'pie':
        return <Pie ref={chartRef} data={chartData as any} options={chartOptions} />;
      case 'scatter':
        return <Scatter ref={chartRef} data={chartData as any} options={chartOptions} />;
      default:
        return <Bar ref={chartRef} data={chartData as any} options={chartOptions} />;
    }
  };

  return (
    <Card className="shadow-card-custom">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-analytics-blue" />
            <span>Chart Visualization</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={downloadAsPNG}>
              <Download className="h-4 w-4 mr-1" />
              PNG
            </Button>
            <Button variant="analytics" size="sm" onClick={downloadAsPDF}>
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          {renderChart()}
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Chart Details:</span> Showing {data.length} data points 
            of {yAxis} across different {xAxis} values from {fileName}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};