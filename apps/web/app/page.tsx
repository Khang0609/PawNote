import React from "react";
import { GraphPageClient } from "../components/GraphPageClient";
import initialData from "../../../temp/mock-graph.json";
import { SharedGraphData } from "@pawnote/types";

// Force static rendering since the mock data is constant at build time
export const dynamic = "force-static";

export default function Home() {
  // Cast initialData to SharedGraphData
  const graphData = initialData as SharedGraphData;

  return (
    <main style={{ margin: 0, padding: 0, width: "100%", height: "100vh" }}>
      <GraphPageClient initialData={graphData} />
    </main>
  );
}
