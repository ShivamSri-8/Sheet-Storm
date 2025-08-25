import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onDataParsed: (data: any[], headers: string[], fileName: string) => void;
}

export const FileUpload = ({ onDataParsed }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const parseExcelFile = useCallback((file: File) => {
    setUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1);
          
          // Convert rows to objects
          const formattedData = rows.map((row: any[]) => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] || '';
            });
            return obj;
          });
          
          onDataParsed(formattedData, headers, file.name);
          
          toast({
            title: "File uploaded successfully!",
            description: `Parsed ${formattedData.length} rows from ${file.name}`,
          });
        } else {
          throw new Error('No data found in the file');
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        toast({
          title: "Error parsing file",
          description: "Please make sure the file is a valid Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    };
    
    reader.readAsArrayBuffer(file);
  }, [onDataParsed, toast]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      parseExcelFile(file);
    }
  }, [parseExcelFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  return (
    <Card className="shadow-card-custom">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileSpreadsheet className="h-6 w-6 text-analytics-blue" />
          <span>Upload Excel File</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-smooth ${
            isDragActive
              ? 'border-analytics-blue bg-analytics-light'
              : 'border-gray-300 hover:border-analytics-blue hover:bg-analytics-light'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-12 w-12 text-analytics-blue" />
            
            {uploading ? (
              <div className="text-analytics-blue">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-analytics-blue mx-auto mb-2"></div>
                <p>Processing file...</p>
              </div>
            ) : (
              <>
                <div className="text-lg font-medium text-gray-700">
                  {isDragActive ? 'Drop the file here' : 'Drag & drop your Excel file here'}
                </div>
                <p className="text-gray-500">or</p>
                <Button variant="upload" size="lg">
                  Choose File
                </Button>
                <p className="text-sm text-gray-400">
                  Supported formats: .xlsx, .xls
                </p>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">File Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Excel files (.xlsx or .xls format)</li>
                <li>First row should contain column headers</li>
                <li>Data should be in the first worksheet</li>
                <li>Maximum file size: 10MB</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};