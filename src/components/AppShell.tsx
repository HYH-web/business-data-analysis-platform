import { useState, type ReactNode, type FormEvent } from "react";

interface AppShellProps {
  children: ReactNode;
  onClean: () => void;
  onReport: () => void;
  onExport: () => void;
}

export default function AppShell({ children, onClean, onReport, onExport }: AppShellProps) {
  const [projectName, setProjectName] = useState("业务数据智能分析平台");

  const handleProjectNameInput = (event: FormEvent<HTMLHeadingElement>) => {
    setProjectName(event.currentTarget.textContent ?? "");
  };

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-brand">
          <div className="project-meta">
            <h1
              className="project-title"
              contentEditable
              suppressContentEditableWarning
              onInput={handleProjectNameInput}
            >
              {projectName}
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
          <button type="button" className="button-primary" onClick={onExport}>
            导出
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
