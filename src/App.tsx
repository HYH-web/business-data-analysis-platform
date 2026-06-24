import { useMemo, useState } from "react";
import AIContextBubble from "./components/AIContextBubble";
import AppShell from "./components/AppShell";
import CanvasBoard from "./components/CanvasBoard";
import { mockLiveRows } from "./data/mockLiveData";
import { buildDataHealthSummary } from "./lib/dataHealth";
import { appendFollowUpBlock, createInitialBlocks, markChartDeleted } from "./lib/canvasBlocks";
import type { ChartKind, CleaningChoice } from "./types/domain";

export default function App() {
  const initialBlocks = useMemo(() => createInitialBlocks(), []);
  const healthSummary = useMemo(() => buildDataHealthSummary(mockLiveRows), []);
  const [cleaningChoice, setCleaningChoice] = useState<CleaningChoice | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartKind | null>(null);
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
  };

  return (
    <AppShell onClean={handleClean} onReport={handleReport} onExport={handleExport}>
      <CanvasBoard
        blocks={blocks}
        healthSummary={healthSummary}
        cleaningSelected={cleaningChoice !== null}
        onCleaningChoice={setCleaningChoice}
        onSelectChart={setSelectedChart}
        onDeleteChart={(id) => {
          setSelectedChart(null);
          setBlocks((current) => markChartDeleted(current, id));
        }}
      />
      <AIContextBubble
        visible={selectedChart !== null && cleaningChoice !== null}
        onSubmit={handleFollowUp}
      />
    </AppShell>
  );
}
