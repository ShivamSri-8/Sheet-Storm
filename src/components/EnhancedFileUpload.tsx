import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Loader2, Sheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface EnhancedFileUploadProps {
  onDataParsed: (data: any[], headers: string[], fileName: string) => void;
}

export const EnhancedFileUpload = ({ onDataParsed }: EnhancedFileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  const parseExcelFile = useCallback(async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: 'array' });
      
      setWorkbook(wb);
      setFileName(file.name);
      setSheetNames(wb.SheetNames);
      
      if (wb.SheetNames.length === 1) {
        // Auto-select if only one sheet
        processSheet(wb, wb.SheetNames[0], file.name);
      } else {
        // Show sheet selector
        setSelectedSheet('');
        toast({
          title: "Multiple Sheets Detected",
          description: `Found ${wb.SheetNames.length} sheets. Please select one below.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error parsing Excel file",
        description: "Please make sure the file is not corrupted",
        variant: "destructive",
      });
    }
  }, [toast, onDataParsed]);

  const parseCSVFile = useCallback(async (file: File) => {
    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            toast({
              title: "CSV parsing errors",
              description: "Some rows may have been skipped",
              variant: "destructive",
            });
          }
          
          const data = results.data as any[];
          const headers = Object.keys(data[0] || {});
          
          if (data.length === 0 || headers.length === 0) {
            toast({
              title: "No data found",
              description: "The CSV file appears to be empty",
              variant: "destructive",
            });
            return;
          }
          
          onDataParsed(data, headers, file.name);
          toast({
            title: "CSV file processed successfully",
            description: `Loaded ${data.length} rows with ${headers.length} columns`,
          });
        },
        error: (error) => {
          toast({
            title: "Error parsing CSV file",
            description: error.message,
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Error reading CSV file",
        description: "Please make sure the file is not corrupted",
        variant: "destructive",
      });
    }
  }, [toast, onDataParsed]);

  const processSheet = (wb: XLSX.WorkBook, sheetName: string, fileName: string) => {
    try {
      const worksheet = wb.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        toast({
          title: "No data found",
          description: "The selected sheet appears to be empty",
          variant: "destructive",
        });
        return;
      }
      
      const headers = jsonData[0] as string[];
      const data = jsonData.slice(1).map((row: any) => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
      
      onDataParsed(data, headers, fileName);
      
      toast({
        title: "File processed successfully",
        description: `Loaded ${data.length} rows with ${headers.length} columns from sheet "${sheetName}"`,
      });
    } catch (error) {
      toast({
        title: "Error processing sheet",
        description: "Please try a different sheet or check the file format",
        variant: "destructive",
      });
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsUploading(true);
    
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv') {
        await parseCSVFile(file);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        await parseExcelFile(file);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a CSV, XLS, or XLSX file",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error processing file",
        description: "Please try again with a different file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [parseExcelFile, parseCSVFile, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false,
  });

  const handleSheetSelection = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (workbook && fileName) {
      setIsUploading(true);
      processSheet(workbook, sheetName, fileName);
      setIsUploading(false);
      setSheetNames([]);
      setWorkbook(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Enhanced File Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`p-8 text-center cursor-pointer transition-colors rounded-lg ${
              isDragActive 
                ? 'bg-primary/10 border-primary' 
                : 'bg-muted/50 hover:bg-muted'
            }`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Processing file...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-semibold">
                    {isDragActive 
                      ? 'Drop your file here' 
                      : 'Drag & drop your file here, or click to browse'
                    }
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports CSV, XLS, and XLSX files
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum file size: 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sheet Selection */}
      {sheetNames.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sheet className="h-5 w-5" />
              Select Sheet to Analyze
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This Excel file contains multiple sheets. Please select which one to analyze:
              </p>
              <Select value={selectedSheet} onValueChange={handleSheetSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a sheet" />
                </SelectTrigger>
                <SelectContent>
                  {sheetNames.map(sheetName => (
                    <SelectItem key={sheetName} value={sheetName}>
                      {sheetName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};