import { describe, expect, it } from "vitest";
import { mockLiveRows } from "../data/mockLiveData";
import { buildDataHealthSummary, applyCleaningChoice } from "./dataHealth";

describe("dataHealth", () => {
  it("detects the mocked three missing AOV values", () => {
    const summary = buildDataHealthSummary(mockLiveRows);
    expect(summary.rowCount).toBeGreaterThan(20);
    expect(summary.missingAovCount).toBe(3);
    expect(summary.recommendedChoice).toBe("mean-fill");
  });

  it("returns business copy for the recommended cleaning choice", () => {
    const result = applyCleaningChoice("mean-fill");
    expect(result.label).toBe("方案 A");
    expect(result.copy).toContain("保全大盘口径");
  });

  it("returns business copy for the row-dropping cleaning choice", () => {
    const result = applyCleaningChoice("drop-rows");
    expect(result.choice).toBe("drop-rows");
    expect(result.label).toBe("方案 B");
    expect(result.copy).toContain("大盘完整性");
  });
});
