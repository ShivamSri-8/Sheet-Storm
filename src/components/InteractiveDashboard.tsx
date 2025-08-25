import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartRenderer } from './ChartRenderer';
import { Layout, Plus } from "lucide-react";

interface ChartNodeData {
  data: any[];
  xAxis: string;
  yAxis: string;
  chartType: 'bar' | 'line' | 'pie' | 'scatter';
  fileName: string;
  title?: string;
  [key: string]: any;
}

interface InteractiveDashboardProps {
  data: any[];
  headers: string[];
  fileName: string;
  onAddChart: () => void;
}

const ChartNode = ({ data }: { data: ChartNodeData }) => {
  return (
    <div className="bg-white border rounded-lg shadow-lg min-w-[400px] min-h-[300px]">
      <div className="p-4 border-b">
        <h3 className="font-semibold">{data.title || `${data.xAxis} vs ${data.yAxis}`}</h3>
      </div>
      <div className="p-4">
        <ChartRenderer
          data={data.data}
          xAxis={data.xAxis}
          yAxis={data.yAxis}
          chartType={data.chartType}
          fileName={data.fileName}
        />
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  chartNode: ChartNode,
};

export const InteractiveDashboard = ({ 
  data, 
  headers, 
  fileName, 
  onAddChart 
}: InteractiveDashboardProps) => {
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'chartNode',
      position: { x: 100, y: 100 },
      data: {
        data,
        xAxis: headers[0],
        yAxis: headers[1],
        chartType: 'bar',
        fileName,
        title: 'Sample Chart 1'
      } as ChartNodeData,
    },
    {
      id: '2',
      type: 'chartNode',
      position: { x: 600, y: 100 },
      data: {
        data,
        xAxis: headers[0],
        yAxis: headers[2] || headers[1],
        chartType: 'line',
        fileName,
        title: 'Sample Chart 2'
      } as ChartNodeData,
    },
  ];

  const initialEdges: Edge[] = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNewChart = () => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type: 'chartNode',
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      data: {
        data,
        xAxis: headers[0],
        yAxis: headers[1],
        chartType: 'bar',
        fileName,
        title: `Chart ${nodes.length + 1}`
      } as ChartNodeData,
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const proOptions = { hideAttribution: true };

  return (
    <Card className="h-[800px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Interactive Dashboard
          </div>
          <Button onClick={addNewChart} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Chart
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full p-0">
        <div className="h-full w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            proOptions={proOptions}
            style={{ background: '#f8fafc' }}
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
};