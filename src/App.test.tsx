import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the project workspace title", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "11.11女装大促复盘_v1" })).toBeInTheDocument();
  });
});
