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

  it("detects the weakest conversion window from uploaded rows", () => {
    const summary = buildDataHealthSummary([
      {
        timeSlot: "10:00",
        pcu: 210,
        gmv: 12000,
        exposure: 1000,
        enterRoom: 260,
        productClick: 92,
        orderSubmit: 40,
        payment: 31,
        refundRate: 0.06,
        aov: 129,
        productName: "连衣裙",
        userSegment: "新客",
        repurchaseCohort: "首购",
      },
      {
        timeSlot: "10:05",
        pcu: 120,
        gmv: 5200,
        exposure: 1000,
        enterRoom: 180,
        productClick: 54,
        orderSubmit: 14,
        payment: 8,
        refundRate: 0.11,
        aov: 128,
        productName: "上衣",
        userSegment: "新客",
        repurchaseCohort: "7日",
      },
      {
        timeSlot: "10:10",
        pcu: 205,
        gmv: 11900,
        exposure: 1000,
        enterRoom: 248,
        productClick: 88,
        orderSubmit: 38,
        payment: 29,
        refundRate: 0.05,
        aov: 130,
        productName: "外套",
        userSegment: "老客",
        repurchaseCohort: "14日",
      },
    ]);

    expect(summary.columnCount).toBe(13);
    expect(summary.anomalyWindow).toBe("10:05");
  });
});
