import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { mockLiveRows } from "../data/mockLiveData";
import { applyCleaningChoice, buildDataHealthSummary } from "../lib/dataHealth";
import { createInitialBlocks } from "../lib/canvasBlocks";
import CanvasBoard from "./CanvasBoard";

describe("CanvasBoard", () => {
  it("shows the core workspace blocks and lets the user choose cleaning方案A", async () => {
    const user = userEvent.setup();
    const onCleaningChoice = vi.fn();
    const optionA = applyCleaningChoice("mean-fill");
    const optionB = applyCleaningChoice("drop-rows");

    render(
      <CanvasBoard
        blocks={createInitialBlocks()}
        rows={mockLiveRows}
        healthSummary={buildDataHealthSummary(mockLiveRows)}
        cleaningSelected={false}
        sourceName="示例数据"
        mappedColumns={["时间", "GMV", "PCU"]}
        onCleaningChoice={onCleaningChoice}
        onSelectChart={vi.fn()}
        onDeleteChart={vi.fn()}
      />,
    );

    expect(screen.getByText("数据体检")).toBeInTheDocument();
    expect(screen.getByText("异常报警")).toBeInTheDocument();
    expect(screen.getByText(/3\s*个客单价空值/)).toBeInTheDocument();
    expect(screen.getByText(optionA.label)).toBeInTheDocument();
    expect(screen.getByText(optionA.copy)).toBeInTheDocument();
    expect(screen.getByText(optionB.label)).toBeInTheDocument();
    expect(screen.getByText(optionB.copy)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "选择方案 A" }));

    expect(onCleaningChoice).toHaveBeenCalledWith("mean-fill");
  });

  it("selects chart cards and deletes them from the action button", async () => {
    const user = userEvent.setup();
    const onSelectChart = vi.fn();
    const onDeleteChart = vi.fn();

    render(
      <CanvasBoard
        blocks={createInitialBlocks()}
        rows={mockLiveRows}
        healthSummary={buildDataHealthSummary(mockLiveRows)}
        cleaningSelected={false}
        sourceName="示例数据"
        mappedColumns={["时间", "GMV", "PCU"]}
        onCleaningChoice={vi.fn()}
        onSelectChart={onSelectChart}
        onDeleteChart={onDeleteChart}
      />,
    );

    const card = screen.getByLabelText("转化漏斗 转化漏斗");

    await user.hover(card);
    card.blur();
    onSelectChart.mockClear();

    card.focus();

    expect(onSelectChart).toHaveBeenCalledWith("funnel", "focus");
    expect(screen.getAllByRole("button", { name: "切换图表类型" })).toHaveLength(4);
    expect(screen.getAllByRole("button", { name: "查看原始数据" })).toHaveLength(4);

    await user.click(screen.getAllByRole("button", { name: "删除该图表" })[0]);

    expect(onDeleteChart).toHaveBeenCalledWith("chart-funnel");
  });

  it("does not select a chart when the delete action receives focus", async () => {
    const user = userEvent.setup();
    const onSelectChart = vi.fn();
    const onDeleteChart = vi.fn();

    render(
      <CanvasBoard
        blocks={createInitialBlocks()}
        rows={mockLiveRows}
        healthSummary={buildDataHealthSummary(mockLiveRows)}
        cleaningSelected={false}
        sourceName="示例数据"
        mappedColumns={["时间", "GMV", "PCU"]}
        onCleaningChoice={vi.fn()}
        onSelectChart={onSelectChart}
        onDeleteChart={onDeleteChart}
      />,
    );

    const deleteButton = screen.getAllByRole("button", { name: "删除该图表" })[0];

    deleteButton.focus();
    expect(onSelectChart).not.toHaveBeenCalled();

    await user.click(deleteButton);

    expect(onDeleteChart).toHaveBeenCalledWith("chart-funnel");
    expect(onSelectChart).not.toHaveBeenCalled();
  });
});
