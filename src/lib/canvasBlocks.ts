import type { CanvasBlock } from "../types/domain";
import { alertCopy, followUpCopy } from "../data/mockInsights";

export function createInitialBlocks(): CanvasBlock[] {
  return [
    { id: "health-card", type: "health", title: "数据体检" },
    { id: "alert-card", type: "alert", title: "异常报警", body: alertCopy },
    { id: "chart-funnel", type: "chart", title: "转化漏斗", chartKind: "funnel" },
    { id: "chart-trend", type: "chart", title: "PCU / GMV 双轴趋势", chartKind: "trend" },
    { id: "chart-cohort", type: "chart", title: "同期群复购热力图", chartKind: "cohort" },
    { id: "chart-pareto", type: "chart", title: "商品 GMV 帕累托", chartKind: "pareto" },
  ];
}

export function markChartDeleted(blocks: CanvasBlock[], id: string): CanvasBlock[] {
  return blocks.map((block) =>
    block.id === id
      ? { ...block, body: "该图表已删除，可通过撤销恢复。", chartKind: undefined }
      : block,
  );
}

export function appendFollowUpBlock(blocks: CanvasBlock[], id: string): CanvasBlock[] {
  return [
    ...blocks,
    {
      id,
      type: "insight",
      title: "AI BP 追问结论",
      body: followUpCopy,
    },
  ];
}
