import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("renders the workspace shell header and actions", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "11.11女装大促复盘_v1" })).toBeInTheDocument();
    expect(screen.getByText("已自动保存于 14:30")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "一键清洗" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "沉淀报告" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "导出" })).toBeInTheDocument();
  });

  it("appends an AI follow-up block from the contextual bubble", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "选择方案 A" }));
    await userEvent.click(screen.getByRole("region", { name: "转化漏斗 转化漏斗" }));
    await userEvent.click(screen.getByRole("button", { name: "发送追问" }));
    expect(screen.getByText("AI BP 追问结论")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "发送追问" })).not.toBeInTheDocument();
  });

  it("keeps the AI bubble when deleting an unselected chart", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "选择方案 A" }));
    await userEvent.click(screen.getByRole("region", { name: "转化漏斗 转化漏斗" }));
    await userEvent.click(screen.getAllByRole("button", { name: "删除该图表" })[1]);

    expect(screen.getByRole("button", { name: "发送追问" })).toBeInTheDocument();
  });
});
