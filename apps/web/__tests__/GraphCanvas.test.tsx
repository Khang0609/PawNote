import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { GraphProvider } from "../context/GraphContext";
import { GraphCanvas } from "../components/GraphCanvas";
import { SharedGraphData } from "@pawnote/types";

const mockData: SharedGraphData = {
  nodes: [
    {
      id: "node-1",
      title: "Node 1",
      slug: "node-1",
      position: { x: 100, y: 150 },
      size: { width: 120, height: 40 },
      type: "text",
      color: "#613dc1",
      createdAt: 1700000000000,
      updatedAt: 1700000000000,
    },
    {
      id: "node-2",
      title: "Node 2",
      slug: "node-2",
      position: { x: 300, y: 350 },
      size: { width: 120, height: 40 },
      type: "canvas",
      createdAt: 1700000000000,
      updatedAt: 1700000000000,
    },
  ],
  edges: [
    {
      id: "edge-1",
      source: "node-1",
      target: "node-2",
      type: "directional",
    },
  ],
};

describe("GraphCanvas Component", () => {
  test("renders SVG, nodes, and edges correctly", () => {
    render(
      <GraphProvider initialData={mockData}>
        <GraphCanvas />
      </GraphProvider>
    );

    // 1. Check if the root SVG container is rendered
    const svg = screen.getByTestId("graph-svg");
    expect(svg).toBeInTheDocument();

    // 2. Verify all nodes are rendered with correct labels
    expect(screen.getByText("Node 1")).toBeInTheDocument();
    expect(screen.getByText("Node 2")).toBeInTheDocument();

    // 3. Verify node graphics exist
    const node1Circle = screen.getByTestId("node-circle-node-1");
    const node2Circle = screen.getByTestId("node-circle-node-2");
    expect(node1Circle).toBeInTheDocument();
    expect(node2Circle).toBeInTheDocument();

    // 4. Verify node styling colors
    expect(node1Circle).toHaveAttribute("fill", "#613dc1");
    expect(node2Circle).toHaveAttribute("fill", "#613dc1");

    // 5. Verify edges are rendered as straight lines with correct positions
    const edge = screen.getByTestId("edge-edge-1");
    expect(edge).toBeInTheDocument();
    expect(edge).toHaveAttribute("x1", "100");
    expect(edge).toHaveAttribute("y1", "150");
    expect(edge).toHaveAttribute("x2", "300");
    expect(edge).toHaveAttribute("y2", "350");
    expect(edge).toHaveAttribute("stroke", "#858ae3");
  });
});
