import type { CanvasBlock, ChartKind, CleaningChoice, DataHealthSummary, LiveMetricRow } from "../types/domain";
import AlertCard from "./blocks/AlertCard";
import ChartCard, { type ChartSelectSource } from "./blocks/ChartCard";
import DataHealthCard from "./blocks/DataHealthCard";
import InsightBlock from "./blocks/InsightBlock";
import SlashCommand from "./SlashCommand";

interface CanvasBoardProps {
  blocks: CanvasBlock[];
  rows: LiveMetricRow[];
  healthSummary: DataHealthSummary;
  cleaningSelected: boolean;
  sourceName: string;
  mappedColumns: string[];
  onCleaningChoice: (choice: CleaningChoice) => void;
  onSelectChart: (kind: ChartKind, source?: ChartSelectSource) => void;
  onDeleteChart: (id: string) => void;
}

export default function CanvasBoard({
  blocks,
  rows,
  healthSummary,
  cleaningSelected,
  sourceName,
  mappedColumns,
  onCleaningChoice,
  onSelectChart,
  onDeleteChart,
}: CanvasBoardProps) {
  return (
    <main className="canvas-board">
      <section className="canvas-hero" aria-label="canvas intro">
        <h2>解析这场直播复盘的业务脉络</h2>
        <p>先清洗数据，再逐块拼接图表、告警和结论，最后沉淀成可复用的 BP 草稿。</p>
        <div className="canvas-chip-row">
          <span className="canvas-chip">数据源：{sourceName}</span>
          <span className="canvas-chip">{rows.length} 行数据</span>
          <span className="canvas-chip">识别字段：{mappedColumns.slice(0, 4).join(" / ") || "内置演示字段"}</span>
        </div>
      </section>

      <SlashCommand onCommand={() => undefined} />

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
            return (
              <ChartCard
                key={block.id}
                id={block.id}
                title={block.title}
                kind={block.chartKind}
                rows={rows}
                onSelect={onSelectChart}
                onDelete={onDeleteChart}
              />
            );
          }

          return <InsightBlock key={block.id} title={block.title} body={block.body ?? "该图表已删除，可通过撤销恢复。"} />;
        })}
      </section>
    </main>
  );
}
