import { useMemo, useState } from "react";
import AIContextBubble from "./components/AIContextBubble";
import AppShell from "./components/AppShell";
import CanvasBoard from "./components/CanvasBoard";
import DataImportBar from "./components/DataImportBar";
import ReportPreview from "./components/ReportPreview";
import { mockLiveRows } from "./data/mockLiveData";
import { buildDataHealthSummary } from "./lib/dataHealth";
import { importAnalysisFile, type ImportedDataset } from "./lib/dataImport";
import { appendFollowUpBlock, createInitialBlocks, markChartDeleted } from "./lib/canvasBlocks";
import type { CanvasBlock, ChartKind, CleaningChoice, LiveMetricRow } from "./types/domain";

interface SelectedChart {
  id: string;
  kind: ChartKind;
}

interface DatasetState {
  sourceName: string;
  rows: LiveMetricRow[];
  rowCount: number;
  columnCount: number;
  mappedColumns: string[];
  warnings: string[];
  isUploaded: boolean;
}

const demoMappedColumns = ["时间", "GMV", "PCU", "转化率", "退款率", "客单价", "商品", "人群"];

function findChartBlockId(blocks: CanvasBlock[], kind: ChartKind) {
  return blocks.find((block) => block.type === "chart" && block.chartKind === kind)?.id ?? null;
}

function createDemoDataset(): DatasetState {
  return {
    sourceName: "示例数据",
    rows: mockLiveRows,
    rowCount: mockLiveRows.length,
    columnCount: Object.keys(mockLiveRows[0] ?? {}).length,
    mappedColumns: demoMappedColumns,
    warnings: [],
    isUploaded: false,
  };
}

function createUploadedDataset(result: ImportedDataset): DatasetState {
  return {
    sourceName: result.sourceName,
    rows: result.rows,
    rowCount: result.rowCount,
    columnCount: result.columnCount,
    mappedColumns: result.mappedColumns,
    warnings: result.warnings,
    isUploaded: true,
  };
}

function getImportErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "文件解析失败，请检查表头和数据格式。";
}

export default function App() {
  const initialBlocks = useMemo(() => createInitialBlocks(), []);
  const [dataset, setDataset] = useState<DatasetState>(() => createDemoDataset());
  const healthSummary = useMemo(() => buildDataHealthSummary(dataset.rows), [dataset.rows]);
  const [cleaningChoice, setCleaningChoice] = useState<CleaningChoice | null>(null);
  const [selectedChart, setSelectedChart] = useState<SelectedChart | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleClean = () => {
    setCleaningChoice("mean-fill");
  };

  const handleReport = () => {
    setReportOpen(true);
  };

  const handleExport = () => {
    setReportOpen(true);
  };

  const handleFileSelected = async (file: File) => {
    setImportError(null);
    setIsImporting(true);

    try {
      const result = await importAnalysisFile(file);
      setDataset(createUploadedDataset(result));
      setCleaningChoice(null);
      setSelectedChart(null);
    } catch (error) {
      setImportError(getImportErrorMessage(error));
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetDataset = () => {
    setDataset(createDemoDataset());
    setImportError(null);
    setCleaningChoice(null);
    setSelectedChart(null);
  };

  const handleFollowUp = () => {
    setBlocks((current) => appendFollowUpBlock(current, `analysis-${current.length + 1}`));
    setSelectedChart(null);
  };

  const handleSelectChart = (kind: ChartKind) => {
    const id = findChartBlockId(blocks, kind);
    if (id) {
      setSelectedChart({ id, kind });
    }
  };

  const handleDeleteChart = (id: string) => {
    setSelectedChart((current) => (current?.id === id ? null : current));
    setBlocks((current) => markChartDeleted(current, id));
  };

  return (
    <AppShell onClean={handleClean} onReport={handleReport} onExport={handleExport}>
      <DataImportBar
        sourceName={dataset.sourceName}
        rowCount={dataset.rowCount}
        columnCount={dataset.columnCount}
        mappedColumns={dataset.mappedColumns}
        warnings={dataset.warnings}
        error={importError}
        isLoading={isImporting}
        isUploaded={dataset.isUploaded}
        onFileSelected={handleFileSelected}
        onReset={handleResetDataset}
      />
      <CanvasBoard
        blocks={blocks}
        rows={dataset.rows}
        healthSummary={healthSummary}
        cleaningSelected={cleaningChoice !== null}
        sourceName={dataset.sourceName}
        mappedColumns={dataset.mappedColumns}
        onCleaningChoice={setCleaningChoice}
        onSelectChart={handleSelectChart}
        onDeleteChart={handleDeleteChart}
      />
      <AIContextBubble
        visible={selectedChart !== null && cleaningChoice !== null}
        onSubmit={handleFollowUp}
      />
      <ReportPreview open={reportOpen} onClose={() => setReportOpen(false)} />
    </AppShell>
  );
}
