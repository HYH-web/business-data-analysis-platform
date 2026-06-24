import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("echarts-for-react", async () => {
  const React = await import("react");

  return {
    default: ({ style }: { style?: import("react").CSSProperties }) =>
      React.createElement("div", { "data-testid": "echarts", style }),
  };
});
