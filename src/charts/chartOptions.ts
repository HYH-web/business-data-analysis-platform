import type { EChartsOption } from "echarts";
import type { ChartKind, LiveMetricRow } from "../types/domain";

type ChartSeriesOption = Record<string, unknown> & {
  type?: string;
};

type ChartAxisOption = Record<string, unknown>;

type ChartOption = Omit<EChartsOption, "series" | "yAxis"> & {
  series?: ChartSeriesOption[];
  yAxis?: ChartAxisOption | ChartAxisOption[];
};

const anomalyRowIndex = 18;

const formatNumber = (value: number) =>
  new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: 0,
  }).format(value);

const formatDecimal = (value: number) =>
  new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

function getAnomalyRow(rows: LiveMetricRow[]) {
  return rows[Math.min(anomalyRowIndex, rows.length - 1)] ?? rows[0];
}

function getFormatterItem(params: unknown) {
  return (Array.isArray(params) ? params[0] : params) as {
    name?: string;
    value?: unknown;
  };
}

function buildFunnelOption(rows: LiveMetricRow[]): ChartOption {
  const row = getAnomalyRow(rows);
  const data = row
    ? [
        { name: "Exposure", value: row.exposure },
        { name: "Enter", value: row.enterRoom },
        { name: "Product Click", value: row.productClick },
        { name: "Submit", value: row.orderSubmit },
        { name: "Payment", value: row.payment },
      ]
    : [];

  return {
    color: ["#2f6bff", "#22a06b", "#f2a900", "#e86c4f", "#7c5cff"],
    tooltip: {
      trigger: "item",
      formatter: (params: unknown) => {
        const { name, value } = getFormatterItem(params);
        const numericValue = typeof value === "number" ? value : Number(value);
        const formattedValue = Number.isFinite(numericValue) ? formatDecimal(numericValue) : value;
        return `${name}: ${formattedValue}`;
      },
    },
    series: [
      {
        name: row ? `${row.timeSlot} conversion` : "conversion",
        type: "funnel",
        left: "5%",
        top: 12,
        bottom: 8,
        width: "90%",
        minSize: "20%",
        maxSize: "100%",
        sort: "descending",
        gap: 3,
        label: {
          show: true,
          formatter: "{b}",
        },
        labelLine: {
          length: 8,
          lineStyle: {
            width: 1,
          },
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
        },
        emphasis: {
          label: {
            fontWeight: "bold",
          },
        },
        data,
      },
    ],
  };
}

function buildTrendOption(rows: LiveMetricRow[]): ChartOption {
  return {
    color: ["#2f6bff", "#22a06b"],
    tooltip: {
      trigger: "axis",
    },
    legend: {
      top: 0,
      data: ["PCU", "GMV"],
    },
    grid: {
      left: 44,
      right: 48,
      top: 42,
      bottom: 32,
    },
    xAxis: {
      type: "category",
      boundaryGap: true,
      data: rows.map((row) => row.timeSlot),
    },
    yAxis: [
      {
        type: "value",
        name: "PCU",
        axisLabel: {
          formatter: (value: number) => formatNumber(value),
        },
      },
      {
        type: "value",
        name: "GMV",
        axisLabel: {
          formatter: (value: number) => `${formatNumber(value / 10000)}万`,
        },
      },
    ],
    series: [
      {
        name: "PCU",
        type: "line",
        smooth: true,
        symbolSize: 5,
        data: rows.map((row) => row.pcu),
      },
      {
        name: "GMV",
        type: "bar",
        yAxisIndex: 1,
        barMaxWidth: 18,
        data: rows.map((row) => row.gmv),
      },
    ],
  };
}

function buildCohortOption(rows: LiveMetricRow[]): ChartOption {
  const cohorts = ["首购", "7日", "14日", "30日"];
  const segments = Array.from(new Set(rows.map((row) => row.userSegment)));
  const cohortMatchers: Record<string, (value: string) => boolean> = {
    首购: (value) => value.includes("首") || value.includes("棣"),
    "7日": (value) => value.includes("7"),
    "14日": (value) => value.includes("14"),
    "30日": (value) => value.includes("30"),
  };
  const heatmapData = segments.flatMap((segment, segmentIndex) =>
    cohorts.map((cohort, cohortIndex) => {
      const matchingRows = rows.filter(
        (row) => row.userSegment === segment && cohortMatchers[cohort](row.repurchaseCohort),
      );
      const totalPayment = matchingRows.reduce((sum, row) => sum + row.payment, 0);
      const value = matchingRows.length > 0 ? Number((totalPayment / matchingRows.length).toFixed(2)) : 0;
      return [cohortIndex, segmentIndex, value];
    }),
  );
  const values = heatmapData.map((entry) => entry[2] as number);

  return {
    color: ["#2f6bff"],
    tooltip: {
      position: "top",
      formatter: (params: unknown) => {
        const { value } = getFormatterItem(params);
        const [cohortIndex, segmentIndex, payment] = value as [number, number, number];
        return `${segments[segmentIndex]} / ${cohorts[cohortIndex]}: ${formatDecimal(payment)}`;
      },
    },
    grid: {
      left: 92,
      right: 24,
      top: 24,
      bottom: 42,
    },
    xAxis: {
      type: "category",
      data: cohorts,
      splitArea: {
        show: true,
      },
    },
    yAxis: {
      type: "category",
      data: segments,
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      min: 0,
      max: Math.max(...values, 1),
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 0,
      inRange: {
        color: ["#eef4ff", "#8bb6ff", "#2f6bff"],
      },
    },
    series: [
      {
        name: "复购热度",
        type: "heatmap",
        data: heatmapData,
        label: {
          show: true,
          formatter: (params: unknown) => {
            const { value } = getFormatterItem(params);
            return formatNumber((value as [number, number, number])[2]);
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(47, 107, 255, 0.25)",
          },
        },
      },
    ],
  };
}

function buildParetoOption(rows: LiveMetricRow[]): ChartOption {
  const productTotals = new Map<string, number>();
  rows.forEach((row) => {
    productTotals.set(row.productName, (productTotals.get(row.productName) ?? 0) + row.gmv);
  });
  const sortedProducts = Array.from(productTotals.entries()).sort((a, b) => b[1] - a[1]);
  const totalGmv = sortedProducts.reduce((sum, [, gmv]) => sum + gmv, 0);
  let runningTotal = 0;
  const cumulativePercent = sortedProducts.map(([, gmv]) => {
    runningTotal += gmv;
    return totalGmv > 0 ? Number(((runningTotal / totalGmv) * 100).toFixed(2)) : 0;
  });

  return {
    color: ["#2f6bff", "#e86c4f"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      top: 0,
      data: ["GMV", "累计占比"],
    },
    grid: {
      left: 64,
      right: 48,
      top: 42,
      bottom: 48,
    },
    xAxis: {
      type: "category",
      data: sortedProducts.map(([productName]) => productName),
      axisLabel: {
        interval: 0,
        width: 72,
        overflow: "truncate",
      },
    },
    yAxis: [
      {
        type: "value",
        name: "GMV",
        axisLabel: {
          formatter: (value: number) => `${formatNumber(value / 10000)}万`,
        },
      },
      {
        type: "value",
        name: "累计占比",
        min: 0,
        max: 100,
        axisLabel: {
          formatter: "{value}%",
        },
      },
    ],
    series: [
      {
        name: "GMV",
        type: "bar",
        barMaxWidth: 28,
        data: sortedProducts.map(([, gmv]) => gmv),
      },
      {
        name: "累计占比",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        symbolSize: 6,
        data: cumulativePercent,
      },
    ],
  };
}

export function buildChartOption(kind: ChartKind, rows: LiveMetricRow[]): ChartOption {
  switch (kind) {
    case "funnel":
      return buildFunnelOption(rows);
    case "trend":
      return buildTrendOption(rows);
    case "cohort":
      return buildCohortOption(rows);
    case "pareto":
      return buildParetoOption(rows);
  }
}
