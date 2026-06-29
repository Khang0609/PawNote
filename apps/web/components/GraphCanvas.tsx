"use client";

import React, { useRef } from "react";
import { useGraphContext } from "../context/GraphContext";
import { useGraphCanvas } from "../hooks/useGraphCanvas";

export const GraphCanvas = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { nodes, edges, zoom, pan, draggingNodeId } = useGraphContext();
  const {
    handleMouseDownBackground,
    handleMouseDownNode,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    resetViewport,
  } = useGraphCanvas(svgRef);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#001233",
        overflow: "hidden",
        userSelect: "none",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg
        ref={svgRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          cursor: draggingNodeId ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDownBackground}
        onWheel={handleWheel}
        data-testid="graph-svg"
      >
        {/* Subtle grid pattern to improve sense of movement */}
        <defs>
          <pattern
            id="grid-pattern"
            width={40}
            height={40}
            patternUnits="userSpaceOnUse"
            x={pan.x}
            y={pan.y}
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#0b285c"
              strokeWidth="1"
              opacity="0.5"
            />
          </pattern>
        </defs>
        
        {/* Grid Background */}
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        {/* Viewport Transform Group */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} data-testid="viewport-g">
          
          {/* Render Edges first so they lie behind nodes */}
          <g id="edges-group" data-testid="edges-group">
            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);

              if (!sourceNode || !targetNode) return null;

              return (
                <line
                  key={edge.id}
                  x1={sourceNode.position.x}
                  y1={sourceNode.position.y}
                  x2={targetNode.position.x}
                  y2={targetNode.position.y}
                  stroke="#858ae3"
                  strokeWidth={2}
                  opacity={0.8}
                  data-testid={`edge-${edge.id}`}
                />
              );
            })}
          </g>

          {/* Render Nodes */}
          <g id="nodes-group" data-testid="nodes-group">
            {nodes.map((node) => {
              const isDragging = draggingNodeId === node.id;
              
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.position.x}, ${node.position.y})`}
                  style={{ cursor: isDragging ? "grabbing" : "grab" }}
                  onMouseDown={(e) => handleMouseDownNode(e, node.id)}
                  data-testid={`node-group-${node.id}`}
                >
                  {/* Circle Node */}
                  <circle
                    r={24}
                    fill="#613dc1"
                    stroke={isDragging ? "#858ae3" : "none"}
                    strokeWidth={isDragging ? 3 : 0}
                    style={{
                      transition: isDragging ? "none" : "fill 0.2s, stroke 0.2s",
                    }}
                    data-testid={`node-circle-${node.id}`}
                  />
                  
                  {/* Title Label */}
                  <text
                    y={38}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={11}
                    fontWeight="500"
                    style={{
                      pointerEvents: "none",
                      textShadow: "0px 1px 3px rgba(0,0,0,0.8)",
                    }}
                  >
                    {node.title}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Floating Control UI */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          display: "flex",
          gap: 12,
          backgroundColor: "rgba(10, 20, 50, 0.8)",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #14b8a6",
          backdropFilter: "blur(4px)",
          color: "#ffffff",
          fontSize: 12,
          alignItems: "center",
        }}
      >
        <span>Zoom: {Math.round(zoom * 100)}%</span>
        <span>|</span>
        <span>Nodes: {nodes.length}</span>
        <span>|</span>
        <span>Edges: {edges.length}</span>
        <button
          onClick={resetViewport}
          style={{
            marginLeft: 8,
            backgroundColor: "#613dc1",
            color: "#ffffff",
            border: "none",
            borderRadius: 4,
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: 11,
          }}
        >
          Reset View
        </button>
      </div>
    </div>
  );
};
