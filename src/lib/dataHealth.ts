import type { CleaningChoice, CleaningResult, DataHealthSummary, LiveMetricRow } from "../types/domain";

const cleaningResults: Record<CleaningChoice, CleaningResult> = {
  "mean-fill": {
    choice: "mean-fill",
    label: "方案 A",
    copy: "按均值填补客单价空值，能保全大盘口径，我推荐先用这个口径推进复盘。",
  },
  "drop-rows": {
    choice: "drop-rows",
    label: "方案 B",
    copy: "剔除 3 行空值记录，适合专门看极端异常，但会轻微影响大盘完整性。",
  },
};

export function buildDataHealthSummary(rows: LiveMetricRow[]): DataHealthSummary {
  return {
    rowCount: rows.length,
    columnCount: 13,
    missingAovCount: rows.filter((row) => row.aov === null).length,
    anomalyWindow: "21:00-21:30",
    recommendedChoice: "mean-fill",
    detectedMetrics: ["GMV", "PCU", "转化率", "退款率", "客单价", "商品", "时段"],
  };
}

export function applyCleaningChoice(choice: CleaningChoice): CleaningResult {
  return cleaningResults[choice];
}
