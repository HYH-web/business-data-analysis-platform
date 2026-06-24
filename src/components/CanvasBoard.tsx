import type { KeyboardEvent } from "react";
import type { CanvasBlock, ChartKind, CleaningChoice, DataHealthSummary } from "../types/domain";
import AlertCard from "./blocks/AlertCard";
import DataHealthCard from "./blocks/DataHealthCard";
import InsightBlock from "./blocks/InsightBlock";

interface CanvasBoardProps {
  blocks: CanvasBlock[];
  healthSummary: DataHealthSummary;
  cleaningSelected: boolean;
  onCleaningChoice: (choice: CleaningChoice) => void;
  onSelectChart: (kind: ChartKind) => void;
  onDeleteChart: (id: string) => void;
}

const chartLabels: Record<ChartKind, string> = {
  funnel: "转化漏斗",
  cohort: "同期群",
  trend: "趋势图",
  pareto: "帕累托",
};

function isActivationKey(event: KeyboardEvent<HTMLElement>) {
  return event.key === "Enter" || event.key === " ";
}

export default function CanvasBoard({
  blocks,
  healthSummary,
  cleaningSelected,
  onCleaningChoice,
  onSelectChart,
}: CanvasBoardProps) {
  return (
    <main className="canvas-board">
      <section className="canvas-hero" aria-label="canvas intro">
        <h2>解析这场直播复盘的业务脉络</h2>
        <p>先清洗数据，再逐块拼接图表、告警和结论，最后沉淀成可复用的 BP 草稿。</p>
        <div className="canvas-chip-row">
          <span className="canvas-chip">导入完成</span>
          <span className="canvas-chip">数据校验通过</span>
          <span className="canvas-chip">待生成图表</span>
        </div>
      </section>

      <section className="block-grid" aria-label="canvas blocks">
        {blocks.map((block) => {
          if (block.type === "health") {
            return (
              <DataHealthCard
                key={block.id}
                summary={healthSummary}
                selected={cleaningSelected}
                onChoice={onCleaningChoice}
              />
            );
          }

          if (block.type === "alert") {
            return <AlertCard key={block.id} title={block.title} body={block.body} />;
          }

          if (block.type === "chart" && block.chartKind) {
            const chartKind = block.chartKind;
            const selectChart = () => onSelectChart(chartKind);

            return (
              <section
                key={block.id}
                className="block-card chart-placeholder"
                tabIndex={0}
                role="button"
                aria-label={`${block.title} ${chartLabels[chartKind]}`}
                onFocus={selectChart}
                onMouseEnter={selectChart}
                onClick={selectChart}
                onKeyDown={(event) => {
                  if (isActivationKey(event)) {
                    event.preventDefault();
                    selectChart();
                  }
                }}
              >
                <div className="block-heading">
                  <div>
                    <h3>{block.title}</h3>
                    <p className="block-body">
                      图表占位 · {chartLabels[chartKind]} · 后续接入 ECharts。
                    </p>
                  </div>
                  <span className="block-kind">图表</span>
                </div>
                <span className="chart-pill">{chartLabels[chartKind]}</span>
                <p className="chart-meta">悬停或聚焦时会进入图表编辑态。</p>
              </section>
            );
          }

          return <InsightBlock key={block.id} title={block.title} body={block.body ?? "该图表已删除，可通过撤销恢复。"} />;
        })}
      </section>
    </main>
  );
}
