import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("renders the workspace shell header and actions", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "业务数据智能分析平台" })).toBeInTheDocument();
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

  it("opens report preview and shows mock export actions", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "沉淀报告" }));
    expect(screen.getByRole("dialog", { name: "复盘报告预览" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "导出 PDF" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "生成飞书文档" })).toBeInTheDocument();
  });

  it("resets mock export status when the report preview reopens", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "沉淀报告" }));
    expect(screen.getByRole("button", { name: "关闭" })).toHaveFocus();

    await userEvent.click(screen.getByRole("button", { name: "导出 PDF" }));
    expect(screen.getByText(/导出 PDF 已模拟成功/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "关闭" }));
    await userEvent.click(screen.getByRole("button", { name: "沉淀报告" }));

    expect(screen.queryByText(/导出 PDF 已模拟成功/)).not.toBeInTheDocument();
    expect(screen.getByText(/当前为 Mock Export/)).toBeInTheDocument();
  });

  it("switches the dashboard to uploaded CSV rows", async () => {
    const csv = [
      "时间,曝光,进房,商品点击,提交订单,支付,GMV,退款率,客单价,商品,人群,复购周期",
      "20:00,1000,260,86,36,27,12800,0.05,128,连衣裙,新客,首购",
      "20:05,1200,300,99,42,32,16320,0.04,128,上衣,老客,7日",
    ].join("\n");
    const file = new File([csv], "live-data.csv", { type: "text/csv" });

    render(<App />);
    await userEvent.upload(screen.getByLabelText("导入数据文件"), file);

    expect(await screen.findByText("已导入 2 行")).toBeInTheDocument();
    expect(screen.getByText("当前文件：live-data.csv")).toBeInTheDocument();
    expect(screen.getByText("识别字段：时间 / GMV / 曝光 / 进房 / 商品点击 / 提交订单 / 支付 / 退款率")).toBeInTheDocument();
  });

  it("shows a clear message when the uploaded file is unsupported", async () => {
    render(<App />);
    const input = screen.getByLabelText("导入数据文件");
    Object.defineProperty(input, "accept", { value: "", configurable: true });
    await userEvent.upload(input, new File(["not a spreadsheet"], "bad.txt", { type: "text/plain" }));

    expect(await screen.findByText("请上传 CSV 或 Excel 文件")).toBeInTheDocument();
  });
});
