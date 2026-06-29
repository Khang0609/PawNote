"use client";

import React from "react";
import { GraphProvider } from "../context/GraphContext";
import { GraphCanvas } from "./GraphCanvas";
import { SharedGraphData } from "@pawnote/types";

export const GraphPageClient = ({ initialData }: { initialData: SharedGraphData }) => {
  return (
    <GraphProvider initialData={initialData}>
      <GraphCanvas />
    </GraphProvider>
  );
};
