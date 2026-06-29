"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { GraphNode, GraphEdge, SharedGraphData } from "@pawnote/types";

interface GraphContextType {
  nodes: GraphNode[];
  edges: GraphEdge[];
  zoom: number;
  pan: { x: number; y: number };
  draggingNodeId: string | null;
  setNodes: React.Dispatch<React.SetStateAction<GraphNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<GraphEdge[]>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setDraggingNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  updateNodePosition: (id: string, x: number, y: number) => void;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export const GraphProvider = ({
  initialData,
  children,
}: {
  initialData: SharedGraphData;
  children: ReactNode;
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>(initialData.nodes);
  const [edges, setEdges] = useState<GraphEdge[]>(initialData.edges);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id ? { ...node, position: { ...node.position, x, y } } : node
      )
    );
  };

  return (
    <GraphContext.Provider
      value={{
        nodes,
        edges,
        zoom,
        pan,
        draggingNodeId,
        setNodes,
        setEdges,
        setZoom,
        setPan,
        setDraggingNodeId,
        updateNodePosition,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const useGraphContext = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }
  return context;
};
