import type { CleaningChoice, DataHealthSummary } from "../../types/domain";

interface DataHealthCardProps {
  summary: DataHealthSummary;
  selected: boolean;
  onChoice: (choice: CleaningChoice) => void;
}

export default function DataHealthCard({ summary, selected, onChoice }: DataHealthCardProps) {
  return (
    <section className="block-card" aria-labelledby="data-health-title">
      <div className="block-heading">
        <div>
          <h3 id="data-health-title">数据体检</h3>
          <p className="block-body">
            {summary.rowCount} 行 · {summary.columnCount} 列 · {summary.missingAovCount} 个客单价空值
          </p>
        </div>
        <span className="block-kind">清洗决策</span>
      </div>

      <div className="health-metrics">
        <div className="health-metric-row">
          <strong>样本行数</strong>
          <span>{summary.rowCount} 行</span>
        </div>
        <div className="health-metric-row">
          <strong>字段数量</strong>
          <span>{summary.columnCount} 列</span>
        </div>
        <div className="health-metric-row">
          <strong>异常窗口</strong>
          <span>{summary.anomalyWindow}</span>
        </div>
        <div className="health-metric-row">
          <strong>检测指标</strong>
          <span>{summary.detectedMetrics.join(" / ")}</span>
        </div>
      </div>

      <div className="health-alert">
        <strong>推荐方案</strong> 方案 A 保留整张表的口径，适合后续复盘。
      </div>

      <div className="health-actions">
        <button
          type="button"
          className="button-secondary"
          onClick={() => onChoice("mean-fill")}
          disabled={selected}
        >
          选择方案 A
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={() => onChoice("drop-rows")}
          disabled={selected}
        >
          选择方案 B
        </button>
      </div>
    </section>
  );
}
