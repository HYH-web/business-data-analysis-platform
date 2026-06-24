import { render, screen } from "@testing-library/react";
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
});
