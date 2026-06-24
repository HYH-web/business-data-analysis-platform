import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { mockLiveRows } from "../data/mockLiveData";
import { buildDataHealthSummary } from "../lib/dataHealth";
import { createInitialBlocks } from "../lib/canvasBlocks";
import CanvasBoard from "./CanvasBoard";

describe("CanvasBoard", () => {
  it("shows the core workspace blocks and lets the user choose cleaning方案A", async () => {
    const user = userEvent.setup();
    const onCleaningChoice = vi.fn();

    render(
      <CanvasBoard
        blocks={createInitialBlocks()}
        healthSummary={buildDataHealthSummary(mockLiveRows)}
        cleaningSelected={false}
        onCleaningChoice={onCleaningChoice}
        onSelectChart={vi.fn()}
        onDeleteChart={vi.fn()}
      />,
    );

    expect(screen.getByText("数据体检")).toBeInTheDocument();
    expect(screen.getByText("异常报警")).toBeInTheDocument();
    expect(screen.getByText(/3\s*个客单价空值/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "选择方案 A" }));

    expect(onCleaningChoice).toHaveBeenCalledWith("mean-fill");
  });
});
