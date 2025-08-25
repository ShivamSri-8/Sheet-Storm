import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Clock, ChevronRight, Trash2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface HistoryItem {
  data: any[];
  headers: string[];
  fileName: string;
  uploadedAt: Date;
}

interface UploadHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  currentFile?: string;
}

export const UploadHistory = ({ history, onSelect, currentFile }: UploadHistoryProps) => {
  return (
    <Card className="shadow-card-custom">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-6 w-6 text-analytics-blue" />
          <span>Upload History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No files uploaded yet</p>
            <p className="text-sm">Upload an Excel file to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-smooth cursor-pointer ${
                  currentFile === item.fileName
                    ? 'bg-analytics-light border-analytics-blue'
                    : 'bg-white border-gray-200 hover:border-analytics-blue hover:bg-analytics-light'
                }`}
                onClick={() => onSelect(item)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="h-5 w-5 text-analytics-blue flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.fileName}
                      </p>
                    </div>
                    
                    <div className="mt-1 text-xs text-gray-500 space-y-1">
                      <p>{item.data.length} rows • {item.headers.length} columns</p>
                      <p>
                        Uploaded {formatDistanceToNow(item.uploadedAt, { addSuffix: true })}
                      </p>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.headers.slice(0, 3).map((header, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {header}
                        </span>
                      ))}
                      {item.headers.length > 3 && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{item.headers.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            ))}
            
            {history.length > 5 && (
              <div className="pt-3 border-t">
                <Button variant="ghost" size="sm" className="w-full">
                  View All History
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};