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

function getConversionRate(row: LiveMetricRow) {
  return row.productClick > 0 ? row.payment / row.productClick : 0;
}

function getMedian(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

function getLongestRun(indexes: number[]) {
  if (indexes.length === 0) {
    return null;
  }

  let bestStart = indexes[0];
  let bestEnd = indexes[0];
  let currentStart = indexes[0];
  let currentEnd = indexes[0];

  for (let index = 1; index < indexes.length; index += 1) {
    const value = indexes[index];
    if (value === currentEnd + 1) {
      currentEnd = value;
    } else {
      if (currentEnd - currentStart > bestEnd - bestStart) {
        bestStart = currentStart;
        bestEnd = currentEnd;
      }
      currentStart = value;
      currentEnd = value;
    }
  }

  if (currentEnd - currentStart > bestEnd - bestStart) {
    bestStart = currentStart;
    bestEnd = currentEnd;
  }

  return { start: bestStart, end: bestEnd };
}

function detectAnomalyWindow(rows: LiveMetricRow[]) {
  if (rows.length === 0) {
    return "暂无数据";
  }

  const rates = rows.map(getConversionRate);
  const medianRate = getMedian(rates);
  const weakIndexes = rates
    .map((rate, index) => ({ rate, index }))
    .filter(({ rate }) => rate <= medianRate * 0.72)
    .map(({ index }) => index);

  if (weakIndexes.length === 0) {
    const weakestIndex = rates.reduce((weakest, rate, index) => (rate < rates[weakest] ? index : weakest), 0);
    return rows[weakestIndex]?.timeSlot ?? "暂无数据";
  }

  const run = getLongestRun(weakIndexes);
  if (!run) {
    return "暂无数据";
  }

  const start = rows[run.start]?.timeSlot ?? "暂无数据";
  const end = rows[run.end]?.timeSlot ?? start;
  return start === end ? start : `${start}-${end}`;
}

export function buildDataHealthSummary(rows: LiveMetricRow[]): DataHealthSummary {
  return {
    rowCount: rows.length,
    columnCount: Object.keys(rows[0] ?? {}).length,
    missingAovCount: rows.filter((row) => row.aov === null).length,
    anomalyWindow: detectAnomalyWindow(rows),
    recommendedChoice: "mean-fill",
    detectedMetrics: ["GMV", "PCU", "转化率", "退款率", "客单价", "商品", "时段"],
  };
}

export function applyCleaningChoice(choice: CleaningChoice): CleaningResult {
  return cleaningResults[choice];
}
