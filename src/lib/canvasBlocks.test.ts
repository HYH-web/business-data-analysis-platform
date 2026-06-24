import { describe, expect, it } from "vitest";
import { appendFollowUpBlock, createInitialBlocks, markChartDeleted } from "./canvasBlocks";

describe("canvasBlocks", () => {
  it("starts with health, alert, and four chart blocks", () => {
    const blocks = createInitialBlocks();
    expect(blocks.map((block) => block.type)).toContain("health");
    expect(blocks.filter((block) => block.type === "chart")).toHaveLength(4);
  });

  it("marks a chart as deleted without removing unrelated blocks", () => {
    const blocks = createInitialBlocks();
    const chart = blocks.find((block) => block.chartKind === "funnel");
    const updated = markChartDeleted(blocks, chart!.id);
    expect(updated.find((block) => block.id === chart!.id)?.body).toContain("已删除");
    expect(updated).toHaveLength(blocks.length);
  });

  it("appends a follow-up insight block after AI response", () => {
    const blocks = createInitialBlocks();
    const updated = appendFollowUpBlock(blocks, "analysis-1");
    const lastBlock = updated[updated.length - 1];
    expect(lastBlock?.id).toBe("analysis-1");
    expect(lastBlock?.type).toBe("insight");
  });
});
