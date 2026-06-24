import { CheckCircle2, Download, FileText, Files, Table2, X, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { reportSections } from "../data/mockInsights";

interface ReportPreviewProps {
  open: boolean;
  onClose: () => void;
}

interface ExportAction {
  label: string;
  description: string;
  icon: LucideIcon;
}

const initialMockStatus =
  "当前为 Mock Export：仅展示前端成功状态，不会生成真实文件、调用飞书或请求后端服务。";

const exportActions: ExportAction[] = [
  {
    label: "生成飞书文档",
    description: "已模拟写入复盘大纲和行动建议，等待正式接入飞书文档接口。",
    icon: FileText,
  },
  {
    label: "同步飞书多维表格",
    description: "已模拟同步指标口径、异常窗口和跟进人字段。",
    icon: Table2,
  },
  {
    label: "导出 Word/PPTX",
    description: "已模拟整理成汇报版结构，暂不创建本地文件。",
    icon: Files,
  },
  {
    label: "导出 PDF",
    description: "已模拟完成 PDF 快照队列，暂不触发真实导出。",
    icon: Download,
  },
];

export default function ReportPreview({ open, onClose }: ReportPreviewProps) {
  const [mockStatus, setMockStatus] = useState(initialMockStatus);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setMockStatus(initialMockStatus);
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <section className="report-panel" aria-label="复盘报告预览" role="dialog" aria-modal="true">
      <div className="report-panel-header">
        <div className="report-title-group">
          <p className="report-kicker">Replay report</p>
          <h2>复盘报告预览</h2>
          <p>清洗决策、异常归因和行动建议已沉淀成第一版复盘骨架。</p>
        </div>
        <button type="button" className="report-close-button" onClick={onClose} ref={closeButtonRef}>
          <X size={16} aria-hidden="true" />
          <span>关闭</span>
        </button>
      </div>

      <ol className="report-section-list">
        {reportSections.map((section, index) => (
          <li key={section}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{section}</p>
          </li>
        ))}
      </ol>

      <div className="report-export-area" aria-label="mock export actions">
        <div className="report-export-heading">
          <strong>Mock export</strong>
          <span>首版只反馈模拟状态，正式导出链路待后端和权限接入。</span>
        </div>
        <div className="report-export-grid">
          {exportActions.map(({ label, description, icon: Icon }) => (
            <button
              type="button"
              className="report-export-button"
              key={label}
              onClick={() => setMockStatus(`${label} 已模拟成功：${description}`)}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="report-mock-note" role="status" aria-live="polite">
        <CheckCircle2 size={18} aria-hidden="true" />
        <p>
          <strong>导出状态</strong>
          <span>{mockStatus}</span>
        </p>
      </div>
    </section>
  );
}
