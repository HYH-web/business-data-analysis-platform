import type { FocusEvent, MouseEvent } from "react";
import ReactECharts from "echarts-for-react";
import { BarChart3, Table2, Trash2 } from "lucide-react";
import { buildChartOption } from "../../charts/chartOptions";
import type { ChartKind, LiveMetricRow } from "../../types/domain";

export type ChartSelectSource = "focus" | "action";

interface ChartCardProps {
  id: string;
  title: string;
  kind: ChartKind;
  rows: LiveMetricRow[];
  onSelect: (kind: ChartKind, source?: ChartSelectSource) => void;
  onDelete: (id: string) => void;
}

const chartLabels: Record<ChartKind, string> = {
  funnel: "转化漏斗",
  cohort: "同期群",
  trend: "趋势图",
  pareto: "帕累托",
};

const chartConclusions: Record<ChartKind, string> = {
  funnel: "21:30 附近从进房到支付的衰减明显，商品点击后的承接需要优先复盘。",
  cohort: "高复购老客贡献稳定，新客首购后的 7 日回访仍有提升空间。",
  trend: "PCU 异常窗口内回落，但 GMV 未同步修复，说明成交效率承压。",
  pareto: "头部商品贡献集中，后续陈列应围绕高 GMV 款补充连带搭配。",
};

export default function ChartCard({ id, title, kind, rows, onSelect, onDelete }: ChartCardProps) {
  const handleSelect = (source?: ChartSelectSource) => onSelect(kind, source);
  const handleCardFocus = (event: FocusEvent<HTMLElement>) => {
    if (event.currentTarget === event.target) {
      handleSelect("focus");
    }
  };
  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest(".chart-actions")) {
      return;
    }

    handleSelect("action");
  };

  return (
    <section
      className="block-card chart-card"
      aria-label={`${title} ${chartLabels[kind]}`}
      tabIndex={0}
      onFocus={handleCardFocus}
      onClick={handleCardClick}
    >
      <div className="chart-card-header">
        <div>
          <p className="block-kind">图表 · {chartLabels[kind]}</p>
          <h3>{title}</h3>
        </div>
        <div className="chart-actions" aria-label="图表操作">
          <button type="button" aria-label="切换图表类型" onClick={() => handleSelect("action")}>
            <BarChart3 size={16} aria-hidden="true" />
          </button>
          <button type="button" aria-label="查看原始数据" onClick={() => handleSelect("action")}>
            <Table2 size={16} aria-hidden="true" />
          </button>
          <button type="button" aria-label="删除该图表" onClick={() => onDelete(id)}>
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <ReactECharts option={buildChartOption(kind, rows)} style={{ height: 260 }} />

      <p className="chart-conclusion">{chartConclusions[kind]}</p>
    </section>
  );
}
