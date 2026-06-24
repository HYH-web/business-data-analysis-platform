import { useMemo, useState } from "react";
import AIContextBubble from "./components/AIContextBubble";
import AppShell from "./components/AppShell";
import CanvasBoard from "./components/CanvasBoard";
import { mockLiveRows } from "./data/mockLiveData";
import { buildDataHealthSummary } from "./lib/dataHealth";
import { appendFollowUpBlock, createInitialBlocks, markChartDeleted } from "./lib/canvasBlocks";
import type { CanvasBlock, ChartKind, CleaningChoice } from "./types/domain";

interface SelectedChart {
  id: string;
  kind: ChartKind;
}

function findChartBlockId(blocks: CanvasBlock[], kind: ChartKind) {
  return blocks.find((block) => block.type === "chart" && block.chartKind === kind)?.id ?? null;
}

export default function App() {
  const initialBlocks = useMemo(() => createInitialBlocks(), []);
  const healthSummary = useMemo(() => buildDataHealthSummary(mockLiveRows), []);
  const [cleaningChoice, setCleaningChoice] = useState<CleaningChoice | null>(null);
  const [selectedChart, setSelectedChart] = useState<SelectedChart | null>(null);
  const [blocks, setBlocks] = useState(initialBlocks);

  const handleClean = () => {
    setCleaningChoice("mean-fill");
  };

  const handleReport = () => {
    return;
  };

  const handleExport = () => {
    return;
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
      <CanvasBoard
        blocks={blocks}
        healthSummary={healthSummary}
        cleaningSelected={cleaningChoice !== null}
        onCleaningChoice={setCleaningChoice}
        onSelectChart={handleSelectChart}
        onDeleteChart={handleDeleteChart}
      />
      <AIContextBubble
        visible={selectedChart !== null && cleaningChoice !== null}
        onSubmit={handleFollowUp}
      />
    </AppShell>
  );
}
