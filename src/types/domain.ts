export type CleaningChoice = "mean-fill" | "drop-rows";

export type ChartKind = "funnel" | "cohort" | "trend" | "pareto";

export type BlockType = "health" | "alert" | "chart" | "insight";

export interface LiveMetricRow {
  timeSlot: string;
  pcu: number;
  gmv: number;
  exposure: number;
  enterRoom: number;
  productClick: number;
  orderSubmit: number;
  payment: number;
  refundRate: number;
  aov: number | null;
  productName: string;
  userSegment: string;
  repurchaseCohort: string;
}

export interface DataHealthSummary {
  rowCount: number;
  columnCount: number;
  missingAovCount: number;
  anomalyWindow: string;
  recommendedChoice: CleaningChoice;
  detectedMetrics: string[];
}

export interface CleaningResult {
  choice: CleaningChoice;
  label: string;
  copy: string;
}

export interface CanvasBlock {
  id: string;
  type: BlockType;
  title: string;
  chartKind?: ChartKind;
  body?: string;
}
