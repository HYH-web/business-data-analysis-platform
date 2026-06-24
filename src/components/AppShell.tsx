import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  onClean: () => void;
  onReport: () => void;
}

export default function AppShell({ children, onClean, onReport }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-brand">
          <div className="project-meta">
            <h1 className="project-title" contentEditable suppressContentEditableWarning>
              11.11女装大促复盘_v1
            </h1>
            <p className="project-status">已自动保存于 14:30</p>
          </div>
        </div>
        <div className="topbar-actions">
          <button type="button" className="button-secondary" onClick={onClean}>
            一键清洗
          </button>
          <button type="button" className="button-secondary" onClick={onReport}>
            沉淀报告
          </button>
          <button type="button" className="button-primary" onClick={onReport}>
            导出
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
