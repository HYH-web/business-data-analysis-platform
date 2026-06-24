import { describe, expect, it } from "vitest";
import { mockLiveRows } from "../data/mockLiveData";
import { buildChartOption } from "./chartOptions";

describe("chartOptions", () => {
  it("builds a funnel chart option", () => {
    const option = buildChartOption("funnel", mockLiveRows);
    expect(option.series?.[0]?.type).toBe("funnel");
  });

  it("builds a dual-axis trend chart option", () => {
    const option = buildChartOption("trend", mockLiveRows);
    expect(option.yAxis).toHaveLength(2);
    expect(option.series).toHaveLength(2);
  });
});
