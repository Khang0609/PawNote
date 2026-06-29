"use client";

import React, { useRef } from "react";
  import { useGraphContext } from "../context/GraphContext";

export const useGraphCanvas = (svgRef: React.RefObject<SVGSVGElement | null>) => {
  const {
    nodes,
    zoom,
    pan,
    draggingNodeId,
    setZoom,
    setPan,
    setDraggingNodeId,
    updateNodePosition,
  } = useGraphContext();

  const isPanningRef = useRef<boolean>(false);
  const panStartMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const dragStartMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartNodePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDownBackground = (e: React.MouseEvent<SVGSVGElement>) => {
    // Only pan with middle click (button 1)
    if (e.button !== 1) return;
    e.preventDefault(); // Prevent browser's middle-click autoscroll
    
    isPanningRef.current = true;
    panStartMouseRef.current = { x: e.clientX, y: e.clientY };
    panStartOffsetRef.current = { ...pan };
  };

  const handleMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setDraggingNodeId(nodeId);
    dragStartMouseRef.current = { x: e.clientX, y: e.clientY };
    dragStartNodePosRef.current = { x: node.position.x, y: node.position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const dx = e.clientX - dragStartMouseRef.current.x;
      const dy = e.clientY - dragStartMouseRef.current.y;
      
      const newX = Math.round(dragStartNodePosRef.current.x + dx / zoom);
      const newY = Math.round(dragStartNodePosRef.current.y + dy / zoom);
      
      updateNodePosition(draggingNodeId, newX, newY);
    } else if (isPanningRef.current) {
      const dx = e.clientX - panStartMouseRef.current.x;
      const dy = e.clientY - panStartMouseRef.current.y;
      
      setPan({
        x: Math.round(panStartOffsetRef.current.x + dx),
        y: Math.round(panStartOffsetRef.current.y + dy),
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    isPanningRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomIntensity = 0.05;
    const zoomFactor = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
    
    const nextZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 5);
    
    // Zoom relative to mouse cursor
    const svgX = (mouseX - pan.x) / zoom;
    const svgY = (mouseY - pan.y) / zoom;

    const nextPanX = Math.round(mouseX - svgX * nextZoom);
    const nextPanY = Math.round(mouseY - svgY * nextZoom);

    setZoom(nextZoom);
    setPan({ x: nextPanX, y: nextPanY });
  };

  const resetViewport = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return {
    handleMouseDownBackground,
    handleMouseDownNode,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    resetViewport,
  };
};
