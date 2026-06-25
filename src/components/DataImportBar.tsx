import { FileSpreadsheet, RotateCcw, Upload } from "lucide-react";
import type { ChangeEvent } from "react";

interface DataImportBarProps {
  sourceName: string;
  rowCount: number;
  columnCount: number;
  mappedColumns: string[];
  warnings: string[];
  error: string | null;
  isLoading: boolean;
  isUploaded: boolean;
  onFileSelected: (file: File) => void;
  onReset: () => void;
}

export default function DataImportBar({
  sourceName,
  rowCount,
  columnCount,
  mappedColumns,
  warnings,
  error,
  isLoading,
  isUploaded,
  onFileSelected,
  onReset,
}: DataImportBarProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    event.currentTarget.value = "";
  };

  return (
    <section className="data-import-bar" aria-label="数据导入">
      <div className="data-import-copy">
        <p>Data source</p>
        <strong>导入真实业务数据</strong>
        <span>支持 CSV / Excel，上传后数据体检、图表和分析结论会切换到你的文件。</span>
      </div>

      <div className="data-import-actions">
        <label className="data-import-upload">
          <Upload size={16} aria-hidden="true" />
          <span>{isLoading ? "解析中" : "选择文件"}</span>
          <input
            aria-label="导入数据文件"
            type="file"
            accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            disabled={isLoading}
            onChange={handleFileChange}
          />
        </label>
        <button
          type="button"
          className="button-secondary data-import-reset"
          disabled={!isUploaded || isLoading}
          onClick={onReset}
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span>恢复示例数据</span>
        </button>
      </div>

      <div className="data-import-status" aria-live="polite">
        <span>
          <FileSpreadsheet size={15} aria-hidden="true" />
          当前文件：{sourceName}
        </span>
        <span>{isUploaded ? `已导入 ${rowCount} 行` : `示例数据 ${rowCount} 行`}</span>
        <span>{columnCount} 列</span>
      </div>

      <p className="data-import-fields">
        识别字段：{mappedColumns.length > 0 ? mappedColumns.slice(0, 8).join(" / ") : "内置演示字段"}
      </p>

      {isUploaded && warnings.length > 0 ? (
        <p className="data-import-warning">部分字段未识别，系统已按当前分析模型自动补齐。</p>
      ) : null}

      {error ? (
        <p className="data-import-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
