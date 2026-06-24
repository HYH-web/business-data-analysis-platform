import { useMemo, useState } from "react";
import AppShell from "./components/AppShell";
import CanvasBoard from "./components/CanvasBoard";
import { mockLiveRows } from "./data/mockLiveData";
import { buildDataHealthSummary } from "./lib/dataHealth";
import { createInitialBlocks, markChartDeleted } from "./lib/canvasBlocks";
import type { CleaningChoice } from "./types/domain";

export default function App() {
  const initialBlocks = useMemo(() => createInitialBlocks(), []);
  const healthSummary = useMemo(() => buildDataHealthSummary(mockLiveRows), []);
  const [cleaningChoice, setCleaningChoice] = useState<CleaningChoice | null>(null);
  const [blocks, setBlocks] = useState(initialBlocks);

  const handleClean = () => {
    setCleaningChoice("mean-fill");
  };

  const handleReport = () => {
    return;
  };

  return (
    <AppShell onClean={handleClean} onReport={handleReport}>
      <CanvasBoard
        blocks={blocks}
        healthSummary={healthSummary}
        cleaningSelected={cleaningChoice !== null}
        onCleaningChoice={setCleaningChoice}
        onSelectChart={() => {
          return;
        }}
        onDeleteChart={(id) => {
          setBlocks((current) => markChartDeleted(current, id));
        }}
      />
    </AppShell>
  );
}
