# Web BDA Canvas Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-fidelity React/Vite front-end demo for the Douyin e-commerce AI data analysis canvas agent defined in `docs/superpowers/specs/2026-06-14-web-bda-canvas-agent-design.md`.

**Architecture:** Use a client-only React app with typed mock data, deterministic mock insights, and a block-based canvas state model. Keep data, business copy, chart options, and UI components in separate modules so the first demo can be extended later to real APIs without rewriting the interface.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, ECharts via `echarts-for-react`, lucide-react icons, CSS custom properties, Playwright/screenshot verification after implementation.

---

## File Structure

Create this app structure under `D:\Web-BDA-codex`:

- `package.json`: scripts and dependencies for Vite, React, tests, and charting.
- `index.html`: Vite HTML entry.
- `vite.config.ts`: Vite + React + Vitest config.
- `tsconfig.json`, `tsconfig.node.json`: TypeScript configs.
- `src/main.tsx`: React entry point.
- `src/App.tsx`: top-level app composition and state wiring.
- `src/App.test.tsx`: smoke and key-flow tests.
- `src/styles/tokens.css`: color, radius, shadow, spacing, and theme tokens.
- `src/styles/global.css`: reset, layout base, typography, reduced-motion handling.
- `src/types/domain.ts`: dataset, block, chart, and UI state types.
- `src/data/mockLiveData.ts`: live-commerce mock dataset.
- `src/data/mockInsights.ts`: mock alert, health check, AI follow-up, and report content.
- `src/lib/dataHealth.ts`: pure functions for data profile and cleaning choice summaries.
- `src/lib/canvasBlocks.ts`: pure functions for creating, deleting, and appending canvas blocks.
- `src/components/AppShell.tsx`: header and main shell.
- `src/components/CanvasBoard.tsx`: canvas layout and block rendering.
- `src/components/blocks/DataHealthCard.tsx`: interactive cleaning choice card.
- `src/components/blocks/AlertCard.tsx`: anomaly alert card.
- `src/components/blocks/ChartCard.tsx`: reusable chart card with actions.
- `src/components/blocks/InsightBlock.tsx`: text insight/follow-up block.
- `src/components/AIContextBubble.tsx`: contextual AI follow-up input.
- `src/components/SlashCommand.tsx`: visible slash command menu.
- `src/components/ReportPreview.tsx`: report preview modal/panel and mock export status.
- `src/charts/chartOptions.ts`: ECharts option builders for funnel, cohort heatmap, dual-axis trend, and Pareto charts.
- `src/test/setup.ts`: Testing Library setup.

## Execution Notes

- The current machine does not expose `node`, `npm`, `pnpm`, or `yarn` on PATH. Task 1 installs and verifies a normal Node.js LTS toolchain before scaffolding.
- The current folder is not a git repository. Initialize git in Task 1 if the user wants commits; otherwise run the listed `git` steps only after `git init`.
- Codex Browser automation previously rejected agent-driven localhost navigation due to network policy. Use local browser/manual view, Playwright where available, and screenshot artifacts honestly.

## Task 1: Toolchain and Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Verify current toolchain**

Run:

```powershell
Get-Command node,npm,pnpm,yarn,winget -ErrorAction SilentlyContinue | Select-Object Name,Source,Version | Format-Table -AutoSize
```

Expected now: only `winget.exe` is present. If `node.exe` and `npm.cmd` are already present, skip Step 2.

- [ ] **Step 2: Install Node.js LTS if missing**

Run:

```powershell
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
```

Expected: Node.js LTS installed. Open a fresh PowerShell session if PATH does not update in the current process.

- [ ] **Step 3: Verify Node and npm**

Run:

```powershell
node --version
npm --version
```

Expected: both commands print versions and exit 0.

- [ ] **Step 4: Initialize git if this folder is still not a repository**

Run:

```powershell
git status --short
```

If it prints `fatal: not a git repository`, run:

```powershell
git init
```

Expected: `git status --short` no longer fails.

- [ ] **Step 5: Create `package.json`**

Create:

```json
{
  "name": "web-bda-canvas-agent",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "tsc -b --noEmit"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "echarts": "^5.5.1",
    "echarts-for-react": "^3.0.2",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "jsdom": "^25.0.1",
    "typescript": "^5.6.3",
    "vite": "^5.4.11",
    "vitest": "^2.1.5"
  }
}
```

- [ ] **Step 6: Install dependencies**

Run:

```powershell
npm install
```

Expected: `package-lock.json` and `node_modules` are created.

- [ ] **Step 7: Create Vite and TypeScript config**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Douyin BDA Canvas Agent</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true,
  },
});
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 8: Create smoke app and test setup**

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main>
      <h1>11.11女装大促复盘_v1</h1>
      <p>Douyin BDA Canvas Agent</p>
    </main>
  );
}
```

Create `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Create `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the project workspace title", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "11.11女装大促复盘_v1" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 9: Create initial empty style files**

Create `src/styles/tokens.css`:

```css
:root {
  color-scheme: light dark;
}
```

Create `src/styles/global.css`:

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
}
```

- [ ] **Step 10: Verify scaffold**

Run:

```powershell
npm test
npm run build
```

Expected: test passes and Vite build exits 0.

- [ ] **Step 11: Commit scaffold if git is initialized**

Run:

```powershell
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json src
git commit -m "chore: scaffold web bda canvas app"
```

Expected: commit succeeds. If git was intentionally not initialized, skip this step and note it.

## Task 2: Domain Types, Mock Dataset, and Pure Data Functions

**Files:**
- Create: `src/types/domain.ts`
- Create: `src/data/mockLiveData.ts`
- Create: `src/data/mockInsights.ts`
- Create: `src/lib/dataHealth.ts`
- Test: `src/lib/dataHealth.test.ts`

- [ ] **Step 1: Write failing data health tests**

Create `src/lib/dataHealth.test.ts`:

```ts
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- src/lib/dataHealth.test.ts
```

Expected: FAIL because `mockLiveData` and `dataHealth` modules do not exist.

- [ ] **Step 3: Create domain types**

Create `src/types/domain.ts`:

```ts
export type CleaningChoice = "mean-fill" | "drop-rows";

export type ChartKind = "funnel" | "cohort" | "trend" | "pareto";

export type BlockType = "health" | "alert" | "chart" | "insight";

export interface LiveMetricRow {
  timeSlot: string;
  pcu: number;
  gmv: number;
  exposure: number;
  enterRoom: number;
  productClick: number;
  orderSubmit: number;
  payment: number;
  refundRate: number;
  aov: number | null;
  productName: string;
  userSegment: string;
  repurchaseCohort: string;
}

export interface DataHealthSummary {
  rowCount: number;
  columnCount: number;
  missingAovCount: number;
  anomalyWindow: string;
  recommendedChoice: CleaningChoice;
  detectedMetrics: string[];
}

export interface CleaningResult {
  choice: CleaningChoice;
  label: string;
  copy: string;
}

export interface CanvasBlock {
  id: string;
  type: BlockType;
  title: string;
  chartKind?: ChartKind;
  body?: string;
}
```

- [ ] **Step 4: Create mock dataset**

Create `src/data/mockLiveData.ts`:

```ts
import type { LiveMetricRow } from "../types/domain";

const slots = [
  "20:00", "20:05", "20:10", "20:15", "20:20", "20:25",
  "20:30", "20:35", "20:40", "20:45", "20:50", "20:55",
  "21:00", "21:05", "21:10", "21:15", "21:20", "21:25",
  "21:30", "21:35", "21:40", "21:45", "21:50", "21:55",
  "22:00", "22:05", "22:10", "22:15", "22:20", "22:25",
];

export const mockLiveRows: LiveMetricRow[] = slots.map((timeSlot, index) => {
  const inAnomaly = index >= 12 && index <= 18;
  const pcu = 8200 + index * 145 + (inAnomaly ? -1800 : 0);
  const exposure = 54000 + index * 900;
  const enterRoom = Math.round(exposure * (inAnomaly ? 0.18 : 0.26));
  const productClick = Math.round(enterRoom * (inAnomaly ? 0.21 : 0.33));
  const orderSubmit = Math.round(productClick * (inAnomaly ? 0.24 : 0.42));
  const payment = Math.round(orderSubmit * (inAnomaly ? 0.58 : 0.76));
  return {
    timeSlot,
    pcu,
    gmv: payment * (index % 3 === 0 ? 268 : 239),
    exposure,
    enterRoom,
    productClick,
    orderSubmit,
    payment,
    refundRate: inAnomaly ? 0.182 + index * 0.001 : 0.062 + index * 0.0006,
    aov: [4, 13, 21].includes(index) ? null : index % 3 === 0 ? 268 : 239,
    productName: ["羽绒服套装", "高腰牛仔裤", "针织连衣裙", "通勤西装"][index % 4],
    userSegment: ["新客", "高复购老客", "价格敏感人群", "直播间高互动用户"][index % 4],
    repurchaseCohort: ["首购", "7日复购", "14日复购", "30日复购"][index % 4],
  };
});
```

- [ ] **Step 5: Create mock insight copy**

Create `src/data/mockInsights.ts`:

```ts
export const alertCopy =
  "警报：昨晚 21:00-21:30，直播间转化漏斗出现断崖式下跌，退换货率同步抬升 20%。初步归因可能是讲解羽绒服套装时尺码表未对齐，建议优先排查。";

export const followUpCopy =
  "我把 21:00-21:30 的高退货用户拆了一下，核心集中在新客、低尺码确认行为、以及羽绒服套装讲解后的即时下单人群。建议补一张尺码说明卡，并让主播在讲解末尾重复确认。";

export const reportSections = [
  "核心结论：21:00 后转化链路断点拉低整场 GMV 效率。",
  "清洗决策：客单价空值按均值填补，保全大盘口径。",
  "异常归因：尺码表表达不清叠加新客即时下单，推高退换货率。",
  "行动建议：补充尺码说明卡，复盘主播讲解脚本，重点盯防高退货单品。",
];
```

- [ ] **Step 6: Implement data health functions**

Create `src/lib/dataHealth.ts`:

```ts
import type { CleaningChoice, CleaningResult, DataHealthSummary, LiveMetricRow } from "../types/domain";

export function buildDataHealthSummary(rows: LiveMetricRow[]): DataHealthSummary {
  return {
    rowCount: rows.length,
    columnCount: 13,
    missingAovCount: rows.filter((row) => row.aov === null).length,
    anomalyWindow: "21:00-21:30",
    recommendedChoice: "mean-fill",
    detectedMetrics: ["GMV", "PCU", "转化率", "退款率", "客单价", "商品", "时段"],
  };
}

export function applyCleaningChoice(choice: CleaningChoice): CleaningResult {
  if (choice === "mean-fill") {
    return {
      choice,
      label: "方案 A",
      copy: "按均值填补客单价空值，能保全大盘口径，我推荐先用这个口径推进复盘。",
    };
  }

  return {
    choice,
    label: "方案 B",
    copy: "剔除 3 行空值记录，适合专门看极端异常，但会轻微影响大盘完整性。",
  };
}
```

- [ ] **Step 7: Run tests**

Run:

```powershell
npm test -- src/lib/dataHealth.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit**

Run:

```powershell
git add src/types/domain.ts src/data/mockLiveData.ts src/data/mockInsights.ts src/lib/dataHealth.ts src/lib/dataHealth.test.ts
git commit -m "feat: add mock live data and health checks"
```

## Task 3: Canvas Block State Model

**Files:**
- Create: `src/lib/canvasBlocks.ts`
- Test: `src/lib/canvasBlocks.test.ts`

- [ ] **Step 1: Write failing canvas block tests**

Create `src/lib/canvasBlocks.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { appendFollowUpBlock, createInitialBlocks, markChartDeleted } from "./canvasBlocks";

describe("canvasBlocks", () => {
  it("starts with health, alert, and four chart blocks", () => {
    const blocks = createInitialBlocks();
    expect(blocks.map((block) => block.type)).toContain("health");
    expect(blocks.filter((block) => block.type === "chart")).toHaveLength(4);
  });

  it("marks a chart as deleted without removing unrelated blocks", () => {
    const blocks = createInitialBlocks();
    const chart = blocks.find((block) => block.chartKind === "funnel");
    const updated = markChartDeleted(blocks, chart!.id);
    expect(updated.find((block) => block.id === chart!.id)?.body).toContain("已删除");
    expect(updated).toHaveLength(blocks.length);
  });

  it("appends a follow-up insight block after AI response", () => {
    const blocks = createInitialBlocks();
    const updated = appendFollowUpBlock(blocks, "analysis-1");
    expect(updated.at(-1)?.id).toBe("analysis-1");
    expect(updated.at(-1)?.type).toBe("insight");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- src/lib/canvasBlocks.test.ts
```

Expected: FAIL because `canvasBlocks.ts` does not exist.

- [ ] **Step 3: Implement block helpers**

Create `src/lib/canvasBlocks.ts`:

```ts
import type { CanvasBlock } from "../types/domain";
import { alertCopy, followUpCopy } from "../data/mockInsights";

export function createInitialBlocks(): CanvasBlock[] {
  return [
    { id: "health-card", type: "health", title: "数据体检" },
    { id: "alert-card", type: "alert", title: "异常报警", body: alertCopy },
    { id: "chart-funnel", type: "chart", title: "转化漏斗", chartKind: "funnel" },
    { id: "chart-trend", type: "chart", title: "PCU / GMV 双轴趋势", chartKind: "trend" },
    { id: "chart-cohort", type: "chart", title: "同期群复购热力图", chartKind: "cohort" },
    { id: "chart-pareto", type: "chart", title: "商品 GMV 帕累托", chartKind: "pareto" },
  ];
}

export function markChartDeleted(blocks: CanvasBlock[], id: string): CanvasBlock[] {
  return blocks.map((block) =>
    block.id === id
      ? { ...block, body: "该图表已删除，可通过撤销恢复。", chartKind: undefined }
      : block,
  );
}

export function appendFollowUpBlock(blocks: CanvasBlock[], id: string): CanvasBlock[] {
  return [
    ...blocks,
    {
      id,
      type: "insight",
      title: "AI BP 追问结论",
      body: followUpCopy,
    },
  ];
}
```

- [ ] **Step 4: Run tests**

Run:

```powershell
npm test -- src/lib/canvasBlocks.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```powershell
git add src/lib/canvasBlocks.ts src/lib/canvasBlocks.test.ts
git commit -m "feat: model canvas blocks"
```

## Task 4: Theme Tokens and App Shell

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`
- Create: `src/components/AppShell.tsx`
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Update app shell test**

Modify `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the project workspace shell", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "11.11女装大促复盘_v1" })).toBeInTheDocument();
    expect(screen.getByText("已自动保存于 14:30")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "一键清洗" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "沉淀报告" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "导出" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- src/App.test.tsx
```

Expected: FAIL because shell buttons are not implemented.

- [ ] **Step 3: Implement theme tokens**

Modify `src/styles/tokens.css`:

```css
:root {
  color-scheme: light;
  --byte-blue: #0b5cff;
  --canvas-gray: #f5f7fb;
  --ink: #111827;
  --muted: #667085;
  --panel: #ffffff;
  --line: #d9e2f2;
  --alert-orange: #f97316;
  --alert-red: #ef4444;
  --growth-green: #16a34a;
  --dark-canvas: #0f172a;
  --dark-panel: #172033;
  --radius-card: 8px;
  --shadow-hover: 0 14px 40px rgba(15, 23, 42, 0.14);
  --shadow-float: 0 20px 60px rgba(15, 23, 42, 0.22);
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --canvas-gray: #0f172a;
    --ink: #f8fafc;
    --muted: #9ca3af;
    --panel: #172033;
    --line: #274060;
    --shadow-hover: 0 18px 44px rgba(0, 0, 0, 0.32);
    --shadow-float: 0 24px 72px rgba(0, 0, 0, 0.42);
  }
}
```

Modify `src/styles/global.css`:

```css
* {
  box-sizing: border-box;
}

html {
  min-width: 320px;
  background: var(--canvas-gray);
}

body {
  margin: 0;
  color: var(--ink);
  font-family: Inter, "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  background: var(--canvas-gray);
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--byte-blue) 60%, white);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Create shell component**

Create `src/components/AppShell.tsx`:

```tsx
import { Download, FileText, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  onClean: () => void;
  onReport: () => void;
}

export function AppShell({ children, onClean, onReport }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar" aria-label="项目操作栏">
        <div>
          <p className="eyebrow">Douyin E-commerce BDA</p>
          <h1>11.11女装大促复盘_v1</h1>
        </div>
        <p className="save-state">已自动保存于 14:30</p>
        <nav className="topbar-actions" aria-label="全局操作">
          <button type="button" onClick={onClean}>
            <Sparkles size={16} aria-hidden="true" />
            一键清洗
          </button>
          <button type="button" onClick={onReport}>
            <FileText size={16} aria-hidden="true" />
            沉淀报告
          </button>
          <button type="button">
            <Download size={16} aria-hidden="true" />
            导出
          </button>
        </nav>
      </header>
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Wire shell in App**

Modify `src/App.tsx`:

```tsx
import { AppShell } from "./components/AppShell";

export default function App() {
  return (
    <AppShell onClean={() => undefined} onReport={() => undefined}>
      <main className="canvas-stage" aria-label="AI 数据分析画布" />
    </AppShell>
  );
}
```

- [ ] **Step 6: Add shell CSS**

Append to `src/styles/global.css`:

```css
.app-shell {
  min-height: 100vh;
  padding: 16px;
}

.topbar {
  position: sticky;
  top: 12px;
  z-index: 10;
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto auto;
  gap: 18px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--panel) 92%, transparent);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(16px);
}

.eyebrow {
  margin: 0 0 4px;
  color: var(--byte-blue);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
}

.topbar h1 {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
}

.save-state {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.topbar-actions {
  display: flex;
  gap: 8px;
}

.topbar-actions button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--ink);
  background: var(--panel);
}

.topbar-actions button:first-child {
  color: white;
  border-color: var(--byte-blue);
  background: var(--byte-blue);
}

.canvas-stage {
  min-height: calc(100vh - 96px);
  margin-top: 14px;
  border-radius: 14px;
}

@media (max-width: 760px) {
  .topbar {
    grid-template-columns: 1fr;
  }

  .topbar-actions {
    flex-wrap: wrap;
  }
}
```

- [ ] **Step 7: Run tests and build**

Run:

```powershell
npm test -- src/App.test.tsx
npm run build
```

Expected: PASS and build exits 0.

- [ ] **Step 8: Commit**

Run:

```powershell
git add src/App.tsx src/App.test.tsx src/components/AppShell.tsx src/styles
git commit -m "feat: add app shell and theme tokens"
```

## Task 5: Canvas Board and Block Rendering

**Files:**
- Create: `src/components/CanvasBoard.tsx`
- Create: `src/components/blocks/DataHealthCard.tsx`
- Create: `src/components/blocks/AlertCard.tsx`
- Create: `src/components/blocks/InsightBlock.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/CanvasBoard.test.tsx`

- [ ] **Step 1: Write failing canvas board test**

Create `src/components/CanvasBoard.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CanvasBoard } from "./CanvasBoard";
import { createInitialBlocks } from "../lib/canvasBlocks";
import { buildDataHealthSummary } from "../lib/dataHealth";
import { mockLiveRows } from "../data/mockLiveData";

describe("CanvasBoard", () => {
  it("renders health and alert blocks and allows selecting a cleaning option", async () => {
    const onCleaningChoice = vi.fn();
    render(
      <CanvasBoard
        blocks={createInitialBlocks()}
        healthSummary={buildDataHealthSummary(mockLiveRows)}
        cleaningSelected={false}
        onCleaningChoice={onCleaningChoice}
        onSelectChart={() => undefined}
        onDeleteChart={() => undefined}
      />,
    );

    expect(screen.getByText("数据体检")).toBeInTheDocument();
    expect(screen.getByText("异常报警")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "选择方案 A" }));
    expect(onCleaningChoice).toHaveBeenCalledWith("mean-fill");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- src/components/CanvasBoard.test.tsx
```

Expected: FAIL because components do not exist.

- [ ] **Step 3: Create data health card**

Create `src/components/blocks/DataHealthCard.tsx`:

```tsx
import type { CleaningChoice, DataHealthSummary } from "../../types/domain";

interface DataHealthCardProps {
  summary: DataHealthSummary;
  cleaningSelected: boolean;
  onCleaningChoice: (choice: CleaningChoice) => void;
}

export function DataHealthCard({ summary, cleaningSelected, onCleaningChoice }: DataHealthCardProps) {
  return (
    <section className="block-card health-card">
      <p className="block-kicker">Data health</p>
      <h2>数据体检</h2>
      <p>
        同学，我扫了一眼数据，共 {summary.rowCount} 行、{summary.columnCount} 列，
        客单价有 {summary.missingAovCount} 个空值。先把口径对齐，再往下打透。
      </p>
      <div className="metric-pills">
        {summary.detectedMetrics.map((metric) => (
          <span key={metric}>{metric}</span>
        ))}
      </div>
      <div className="choice-grid">
        <button type="button" onClick={() => onCleaningChoice("mean-fill")} disabled={cleaningSelected}>
          <strong>选择方案 A</strong>
          <span>按均值填补，我推荐，保全大盘口径。</span>
        </button>
        <button type="button" onClick={() => onCleaningChoice("drop-rows")} disabled={cleaningSelected}>
          <strong>选择方案 B</strong>
          <span>剔除 3 行，适合看极端异常。</span>
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create alert and insight blocks**

Create `src/components/blocks/AlertCard.tsx`:

```tsx
interface AlertCardProps {
  copy: string;
}

export function AlertCard({ copy }: AlertCardProps) {
  return (
    <section className="block-card alert-card">
      <p className="block-kicker">Anomaly alert</p>
      <h2>异常报警</h2>
      <p>{copy}</p>
    </section>
  );
}
```

Create `src/components/blocks/InsightBlock.tsx`:

```tsx
interface InsightBlockProps {
  title: string;
  body: string;
}

export function InsightBlock({ title, body }: InsightBlockProps) {
  return (
    <section className="block-card insight-block">
      <p className="block-kicker">AI BP</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  );
}
```

- [ ] **Step 5: Create canvas board**

Create `src/components/CanvasBoard.tsx`:

```tsx
import type { CanvasBlock, ChartKind, CleaningChoice, DataHealthSummary } from "../types/domain";
import { AlertCard } from "./blocks/AlertCard";
import { DataHealthCard } from "./blocks/DataHealthCard";
import { InsightBlock } from "./blocks/InsightBlock";

interface CanvasBoardProps {
  blocks: CanvasBlock[];
  healthSummary: DataHealthSummary;
  cleaningSelected: boolean;
  onCleaningChoice: (choice: CleaningChoice) => void;
  onSelectChart: (chart: ChartKind) => void;
  onDeleteChart: (id: string) => void;
}

export function CanvasBoard({
  blocks,
  healthSummary,
  cleaningSelected,
  onCleaningChoice,
}: CanvasBoardProps) {
  return (
    <main className="canvas-board" aria-label="AI 数据分析画布">
      <div className="business-pulse" aria-hidden="true" />
      <div className="block-grid">
        {blocks.map((block) => {
          if (block.type === "health") {
            return (
              <DataHealthCard
                key={block.id}
                summary={healthSummary}
                cleaningSelected={cleaningSelected}
                onCleaningChoice={onCleaningChoice}
              />
            );
          }

          if (block.type === "alert") {
            return <AlertCard key={block.id} copy={block.body ?? ""} />;
          }

          if (block.type === "insight") {
            return <InsightBlock key={block.id} title={block.title} body={block.body ?? ""} />;
          }

          return null;
        })}
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Wire canvas in App**

Modify `src/App.tsx`:

```tsx
import { useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { CanvasBoard } from "./components/CanvasBoard";
import { mockLiveRows } from "./data/mockLiveData";
import { createInitialBlocks } from "./lib/canvasBlocks";
import { buildDataHealthSummary } from "./lib/dataHealth";
import type { ChartKind, CleaningChoice } from "./types/domain";

export default function App() {
  const [cleaningChoice, setCleaningChoice] = useState<CleaningChoice | null>(null);
  const blocks = useMemo(() => createInitialBlocks(), []);
  const healthSummary = useMemo(() => buildDataHealthSummary(mockLiveRows), []);

  return (
    <AppShell onClean={() => setCleaningChoice("mean-fill")} onReport={() => undefined}>
      <CanvasBoard
        blocks={blocks}
        healthSummary={healthSummary}
        cleaningSelected={cleaningChoice !== null}
        onCleaningChoice={setCleaningChoice}
        onSelectChart={(_: ChartKind) => undefined}
        onDeleteChart={() => undefined}
      />
    </AppShell>
  );
}
```

- [ ] **Step 7: Add canvas CSS**

Append to `src/styles/global.css`:

```css
.canvas-board {
  position: relative;
  min-height: calc(100vh - 112px);
  margin-top: 14px;
  padding: 20px;
  overflow: hidden;
  border-radius: 14px;
  background:
    radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--line) 72%, transparent) 1px, transparent 0) 0 0 / 24px 24px,
    linear-gradient(180deg, color-mix(in srgb, var(--canvas-gray) 94%, white), var(--canvas-gray));
}

.business-pulse {
  position: absolute;
  inset: 22px;
  pointer-events: none;
  border-radius: 14px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--byte-blue) 24%, transparent), transparent);
  opacity: 0.45;
  transform: translateX(-60%);
  animation: pulse-scan 7s ease-in-out infinite;
}

@keyframes pulse-scan {
  0%, 100% { transform: translateX(-65%); opacity: 0.18; }
  50% { transform: translateX(65%); opacity: 0.5; }
}

.block-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.block-card {
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  background: var(--panel);
  transition: box-shadow 160ms ease, transform 160ms ease;
}

.block-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-1px);
}

.block-kicker {
  margin: 0 0 8px;
  color: var(--byte-blue);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.block-card h2 {
  margin: 0 0 10px;
  font-size: 18px;
}

.block-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
}

.alert-card {
  border-color: color-mix(in srgb, var(--alert-orange) 55%, var(--line));
  background: color-mix(in srgb, var(--alert-orange) 10%, var(--panel));
}

.metric-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0;
}

.metric-pills span {
  padding: 5px 8px;
  border-radius: 999px;
  color: var(--byte-blue);
  background: color-mix(in srgb, var(--byte-blue) 10%, transparent);
  font-size: 12px;
  font-weight: 700;
}

.choice-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.choice-grid button {
  min-height: 86px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  text-align: left;
  color: var(--ink);
  background: color-mix(in srgb, var(--panel) 88%, var(--byte-blue));
}

.choice-grid button span {
  display: block;
  margin-top: 6px;
  color: var(--muted);
  line-height: 1.45;
}

@media (max-width: 820px) {
  .block-grid,
  .choice-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 8: Run tests and build**

Run:

```powershell
npm test -- src/components/CanvasBoard.test.tsx src/App.test.tsx
npm run build
```

Expected: PASS and build exits 0.

- [ ] **Step 9: Commit**

Run:

```powershell
git add src/App.tsx src/components src/styles/global.css
git commit -m "feat: render canvas health and alert blocks"
```

## Task 6: Chart Cards and ECharts Options

**Files:**
- Create: `src/charts/chartOptions.ts`
- Create: `src/components/blocks/ChartCard.tsx`
- Modify: `src/components/CanvasBoard.tsx`
- Test: `src/charts/chartOptions.test.ts`

- [ ] **Step 1: Write failing chart option tests**

Create `src/charts/chartOptions.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- src/charts/chartOptions.test.ts
```

Expected: FAIL because chart option module does not exist.

- [ ] **Step 3: Implement chart option builders**

Create `src/charts/chartOptions.ts`:

```ts
import type { EChartsOption } from "echarts";
import type { ChartKind, LiveMetricRow } from "../types/domain";

export function buildChartOption(kind: ChartKind, rows: LiveMetricRow[]): EChartsOption {
  if (kind === "funnel") return buildFunnelOption(rows);
  if (kind === "trend") return buildTrendOption(rows);
  if (kind === "cohort") return buildCohortOption();
  return buildParetoOption(rows);
}

function buildFunnelOption(rows: LiveMetricRow[]): EChartsOption {
  const latest = rows[18];
  return {
    tooltip: { trigger: "item", valueFormatter: (value) => Number(value).toFixed(2) },
    series: [
      {
        type: "funnel",
        data: [
          { name: "曝光", value: latest.exposure },
          { name: "进房", value: latest.enterRoom },
          { name: "商品点击", value: latest.productClick },
          { name: "提交订单", value: latest.orderSubmit },
          { name: "支付", value: latest.payment },
        ],
      },
    ],
  };
}

function buildTrendOption(rows: LiveMetricRow[]): EChartsOption {
  return {
    tooltip: { trigger: "axis" },
    legend: { data: ["PCU", "GMV"] },
    xAxis: { type: "category", data: rows.map((row) => row.timeSlot) },
    yAxis: [{ type: "value", name: "PCU" }, { type: "value", name: "GMV" }],
    series: [
      { name: "PCU", type: "line", smooth: true, data: rows.map((row) => row.pcu) },
      { name: "GMV", type: "bar", yAxisIndex: 1, data: rows.map((row) => row.gmv) },
    ],
  };
}

function buildCohortOption(): EChartsOption {
  const x = ["首购", "7日", "14日", "30日"];
  const y = ["新客", "老客", "高互动", "价格敏感"];
  const values = [
    [0, 0, 86], [1, 0, 64], [2, 0, 48], [3, 0, 31],
    [0, 1, 92], [1, 1, 71], [2, 1, 55], [3, 1, 39],
    [0, 2, 88], [1, 2, 67], [2, 2, 51], [3, 2, 35],
    [0, 3, 76], [1, 3, 52], [2, 3, 34], [3, 3, 19],
  ];
  return {
    tooltip: { position: "top" },
    xAxis: { type: "category", data: x },
    yAxis: { type: "category", data: y },
    visualMap: { min: 0, max: 100, calculable: true, orient: "horizontal", left: "center", bottom: 0 },
    series: [{ type: "heatmap", data: values }],
  };
}

function buildParetoOption(rows: LiveMetricRow[]): EChartsOption {
  const totals = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.productName] = (acc[row.productName] ?? 0) + row.gmv;
    return acc;
  }, {});
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const sum = sorted.reduce((total, [, value]) => total + value, 0);
  let cumulative = 0;
  return {
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: sorted.map(([name]) => name) },
    yAxis: [{ type: "value", name: "GMV" }, { type: "value", name: "累计占比" }],
    series: [
      { name: "GMV", type: "bar", data: sorted.map(([, value]) => value) },
      {
        name: "累计占比",
        type: "line",
        yAxisIndex: 1,
        data: sorted.map(([, value]) => {
          cumulative += value;
          return Number(((cumulative / sum) * 100).toFixed(2));
        }),
      },
    ],
  };
}
```

- [ ] **Step 4: Create chart card component**

Create `src/components/blocks/ChartCard.tsx`:

```tsx
import ReactECharts from "echarts-for-react";
import { BarChart3, Table2, Trash2 } from "lucide-react";
import { buildChartOption } from "../../charts/chartOptions";
import { mockLiveRows } from "../../data/mockLiveData";
import type { ChartKind } from "../../types/domain";

interface ChartCardProps {
  id: string;
  title: string;
  kind: ChartKind;
  onSelect: (kind: ChartKind) => void;
  onDelete: (id: string) => void;
}

export function ChartCard({ id, title, kind, onSelect, onDelete }: ChartCardProps) {
  return (
    <section className="block-card chart-card" onFocus={() => onSelect(kind)} onMouseEnter={() => onSelect(kind)}>
      <div className="chart-card-header">
        <div>
          <p className="block-kicker">Interactive chart</p>
          <h2>{title}</h2>
        </div>
        <div className="chart-actions" aria-label={`${title} 操作`}>
          <button type="button" aria-label="切换图表类型">
            <BarChart3 size={16} aria-hidden="true" />
          </button>
          <button type="button" aria-label="查看原始数据">
            <Table2 size={16} aria-hidden="true" />
          </button>
          <button type="button" aria-label="删除该图表" onClick={() => onDelete(id)}>
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <ReactECharts option={buildChartOption(kind, mockLiveRows)} style={{ height: 260 }} />
      <p className="chart-conclusion">核心口径已对齐，鼠标悬浮可查看精确数值。</p>
    </section>
  );
}
```

- [ ] **Step 5: Render chart blocks in CanvasBoard**

Modify `src/components/CanvasBoard.tsx` to import and render `ChartCard`:

```tsx
import { ChartCard } from "./blocks/ChartCard";
```

Replace the final `return null;` in the block map with:

```tsx
          if (block.type === "chart" && block.chartKind) {
            return (
              <ChartCard
                key={block.id}
                id={block.id}
                title={block.title}
                kind={block.chartKind}
                onSelect={onSelectChart}
                onDelete={onDeleteChart}
              />
            );
          }

          return (
            <InsightBlock
              key={block.id}
              title={block.title}
              body={block.body ?? "该图表已删除，可通过撤销恢复。"}
            />
          );
```

- [ ] **Step 6: Add chart CSS**

Append to `src/styles/global.css`:

```css
.chart-card {
  min-height: 360px;
}

.chart-card-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.chart-actions {
  display: flex;
  gap: 6px;
}

.chart-actions button {
  display: inline-grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--muted);
  background: transparent;
}

.chart-conclusion {
  font-size: 13px;
}
```

- [ ] **Step 7: Run tests and build**

Run:

```powershell
npm test -- src/charts/chartOptions.test.ts src/components/CanvasBoard.test.tsx
npm run build
```

Expected: PASS and build exits 0.

- [ ] **Step 8: Commit**

Run:

```powershell
git add src/charts src/components src/styles/global.css
git commit -m "feat: add interactive chart cards"
```

## Task 7: AI Bubble, Follow-Up Blocks, and Slash Commands

**Files:**
- Create: `src/components/AIContextBubble.tsx`
- Create: `src/components/SlashCommand.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/CanvasBoard.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Extend app test for follow-up flow**

Modify `src/App.test.tsx` to include:

```tsx
import userEvent from "@testing-library/user-event";
```

Add test:

```tsx
  it("appends an AI follow-up block from the contextual bubble", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "选择方案 A" }));
    await userEvent.click(screen.getByRole("button", { name: "发送追问" }));
    expect(screen.getByText("AI BP 追问结论")).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- src/App.test.tsx
```

Expected: FAIL because AI bubble does not exist.

- [ ] **Step 3: Create AI bubble**

Create `src/components/AIContextBubble.tsx`:

```tsx
import { Send } from "lucide-react";

interface AIContextBubbleProps {
  visible: boolean;
  onSubmit: () => void;
}

export function AIContextBubble({ visible, onSubmit }: AIContextBubbleProps) {
  if (!visible) return null;

  return (
    <aside className="ai-bubble" aria-label="AI BP 追问">
      <strong>AI BP 追问</strong>
      <p>把退货率高的时间段，用户画像拉出来看下</p>
      <button type="button" onClick={onSubmit}>
        <Send size={15} aria-hidden="true" />
        发送追问
      </button>
    </aside>
  );
}
```

- [ ] **Step 4: Create slash command menu**

Create `src/components/SlashCommand.tsx`:

```tsx
const commands = ["/接入数据", "/生成漏斗图", "/生成同期群热力图", "/生成双轴趋势图", "/生成帕累托图", "/呼叫大模型追问"];

interface SlashCommandProps {
  onCommand: (command: string) => void;
}

export function SlashCommand({ onCommand }: SlashCommandProps) {
  return (
    <section className="slash-command" aria-label="快捷指令">
      <span>/</span>
      <div>
        {commands.map((command) => (
          <button key={command} type="button" onClick={() => onCommand(command)}>
            {command}
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Render slash command in CanvasBoard**

Modify `src/components/CanvasBoard.tsx`:

```tsx
import { SlashCommand } from "./SlashCommand";
```

Add this inside `CanvasBoard` before `.block-grid`:

```tsx
      <SlashCommand onCommand={() => undefined} />
```

- [ ] **Step 6: Wire AI state in App**

Modify `src/App.tsx`:

```tsx
import { useMemo, useState } from "react";
import { AIContextBubble } from "./components/AIContextBubble";
import { AppShell } from "./components/AppShell";
import { CanvasBoard } from "./components/CanvasBoard";
import { mockLiveRows } from "./data/mockLiveData";
import { appendFollowUpBlock, createInitialBlocks, markChartDeleted } from "./lib/canvasBlocks";
import { buildDataHealthSummary } from "./lib/dataHealth";
import type { ChartKind, CleaningChoice } from "./types/domain";

export default function App() {
  const [cleaningChoice, setCleaningChoice] = useState<CleaningChoice | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartKind | null>("trend");
  const [blocks, setBlocks] = useState(() => createInitialBlocks());
  const healthSummary = useMemo(() => buildDataHealthSummary(mockLiveRows), []);

  return (
    <AppShell onClean={() => setCleaningChoice("mean-fill")} onReport={() => undefined}>
      <CanvasBoard
        blocks={blocks}
        healthSummary={healthSummary}
        cleaningSelected={cleaningChoice !== null}
        onCleaningChoice={setCleaningChoice}
        onSelectChart={setSelectedChart}
        onDeleteChart={(id) => setBlocks((current) => markChartDeleted(current, id))}
      />
      <AIContextBubble
        visible={selectedChart !== null && cleaningChoice !== null}
        onSubmit={() => setBlocks((current) => appendFollowUpBlock(current, `analysis-${current.length + 1}`))}
      />
    </AppShell>
  );
}
```

- [ ] **Step 7: Add AI and slash CSS**

Append to `src/styles/global.css`:

```css
.ai-bubble {
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 20;
  width: min(340px, calc(100vw - 32px));
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--byte-blue) 45%, var(--line));
  border-radius: 12px;
  color: white;
  background: #111827;
  box-shadow: var(--shadow-float);
}

.ai-bubble p {
  color: #d1d5db;
  line-height: 1.55;
}

.ai-bubble button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 6px;
  color: white;
  background: var(--byte-blue);
}

.slash-command {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  width: fit-content;
  max-width: 100%;
  margin-bottom: 16px;
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--panel) 92%, transparent);
}

.slash-command > span {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 6px;
  color: white;
  background: var(--byte-blue);
  font-weight: 800;
}

.slash-command div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.slash-command button {
  min-height: 30px;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--ink);
  background: transparent;
}
```

- [ ] **Step 8: Run tests and build**

Run:

```powershell
npm test -- src/App.test.tsx
npm run build
```

Expected: PASS and build exits 0.

- [ ] **Step 9: Commit**

Run:

```powershell
git add src/App.tsx src/components src/styles/global.css
git commit -m "feat: add contextual ai follow up"
```

## Task 8: Report Preview and Mock Export Status

**Files:**
- Create: `src/components/ReportPreview.tsx`
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Extend app test for report preview**

Add to `src/App.test.tsx`:

```tsx
  it("opens report preview and shows mock export actions", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "沉淀报告" }));
    expect(screen.getByText("复盘报告预览")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "导出 PDF" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "生成飞书文档" })).toBeInTheDocument();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npm test -- src/App.test.tsx
```

Expected: FAIL because report preview does not exist.

- [ ] **Step 3: Create report preview**

Create `src/components/ReportPreview.tsx`:

```tsx
import { FileText, Presentation, Table2 } from "lucide-react";
import { reportSections } from "../data/mockInsights";

interface ReportPreviewProps {
  open: boolean;
  onClose: () => void;
}

export function ReportPreview({ open, onClose }: ReportPreviewProps) {
  if (!open) return null;

  return (
    <section className="report-panel" aria-label="复盘报告预览">
      <div className="report-header">
        <div>
          <p className="block-kicker">Replay report</p>
          <h2>复盘报告预览</h2>
        </div>
        <button type="button" onClick={onClose}>关闭</button>
      </div>
      <ol>
        {reportSections.map((section) => (
          <li key={section}>{section}</li>
        ))}
      </ol>
      <div className="export-grid">
        <button type="button"><FileText size={16} aria-hidden="true" />生成飞书文档</button>
        <button type="button"><Table2 size={16} aria-hidden="true" />同步飞书多维表格</button>
        <button type="button"><Presentation size={16} aria-hidden="true" />导出 Word/PPTX</button>
        <button type="button"><FileText size={16} aria-hidden="true" />导出 PDF</button>
      </div>
      <p className="mock-note">当前为高保真 Demo：导出链路展示成功状态，不生成真实文件。</p>
    </section>
  );
}
```

- [ ] **Step 4: Wire report preview in App**

Modify `src/App.tsx`:

```tsx
import { ReportPreview } from "./components/ReportPreview";
```

Add state:

```tsx
const [reportOpen, setReportOpen] = useState(false);
```

Change `AppShell` prop:

```tsx
<AppShell onClean={() => setCleaningChoice("mean-fill")} onReport={() => setReportOpen(true)}>
```

Render before closing `AppShell`:

```tsx
      <ReportPreview open={reportOpen} onClose={() => setReportOpen(false)} />
```

- [ ] **Step 5: Add report CSS**

Append to `src/styles/global.css`:

```css
.report-panel {
  position: fixed;
  top: 92px;
  right: 24px;
  z-index: 30;
  width: min(520px, calc(100vw - 32px));
  max-height: calc(100vh - 120px);
  overflow: auto;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  background: var(--panel);
  box-shadow: var(--shadow-float);
}

.report-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.report-header h2 {
  margin: 0;
}

.report-panel ol {
  margin: 18px 0;
  padding-left: 20px;
  color: var(--muted);
  line-height: 1.7;
}

.export-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.export-grid button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--ink);
  background: color-mix(in srgb, var(--panel) 92%, var(--growth-green));
}

.mock-note {
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 13px;
}

@media (max-width: 640px) {
  .report-panel {
    inset: auto 16px 16px;
    width: auto;
  }

  .export-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Run tests and build**

Run:

```powershell
npm test -- src/App.test.tsx
npm run build
```

Expected: PASS and build exits 0.

- [ ] **Step 7: Commit**

Run:

```powershell
git add src/App.tsx src/components/ReportPreview.tsx src/styles/global.css src/App.test.tsx
git commit -m "feat: add report preview and mock exports"
```

## Task 9: Frontend Polish, Responsiveness, and Verification

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/App.test.tsx` if accessibility names need adjustment
- Create: `docs/verification/web-bda-verification.md`

- [ ] **Step 1: Use frontend-design skill before polish edits**

Invoke `frontend-design` and verify the implemented UI still matches the approved direction:

- Semi/Arco-style internal tool.
- Slightly stronger technology feel.
- No marketing landing page.
- No one-note palette.
- No nested decorative cards.
- Cards 8px radius or less except the AI bubble.

- [ ] **Step 2: Run automated verification**

Run:

```powershell
npm test
npm run build
```

Expected: all tests pass and build exits 0.

- [ ] **Step 3: Start local dev server**

Run:

```powershell
npm run dev
```

Expected: Vite serves the app on a localhost URL, usually `http://127.0.0.1:5173/`.

- [ ] **Step 4: Verify core user flows manually or with Playwright/screenshot**

Check these flows:

- Page shows project title, autosave, and global actions.
- Data health card shows 3 missing `aov` values.
- Selecting `方案 A` enables AI bubble.
- Four chart cards render without blank chart containers.
- Chart actions are visible.
- Sending the AI follow-up appends `AI BP 追问结论`.
- Clicking `沉淀报告` opens report preview.
- Export buttons display Feishu, table, Word/PPTX, and PDF mock actions.
- Desktop layout at 1280px has no overlap.
- Mobile layout around 390px stacks blocks without text overflow.

- [ ] **Step 5: Record verification evidence**

Create `docs/verification/web-bda-verification.md`:

```markdown
# Web BDA Verification

## Commands

- `npm test`: PASS in Task 9 Step 6.
- `npm run build`: PASS in Task 9 Step 6.

## Browser Checks

- Desktop 1280px: PASS. The header, canvas cards, chart cards, AI bubble, and report panel do not overlap.
- Mobile 390px: PASS. The topbar actions wrap and canvas blocks stack vertically without text overflow.
- Data health choice: PASS. Selecting `方案 A` disables the cleaning choice buttons and enables the downstream flow.
- AI follow-up: PASS. Clicking `发送追问` appends the `AI BP 追问结论` block.
- Report preview: PASS. Clicking `沉淀报告` opens the report preview and shows mock Feishu, table, Word/PPTX, and PDF actions.

## Known Limits

- This is a front-end demo with mock data, mock AI insights, and mock export states.
- Codex Browser automation may reject localhost under current network policy; any manual verification is noted here.
```

If any check fails during execution, write `FAIL` for that line and include the observed error or visual issue in the same sentence before continuing with fixes.

- [ ] **Step 6: Final verification before completion**

Invoke `superpowers:verification-before-completion`, then run:

```powershell
npm test
npm run build
```

Expected: both commands exit 0.

- [ ] **Step 7: Commit**

Run:

```powershell
git add src docs/verification/web-bda-verification.md
git commit -m "test: verify web bda canvas demo"
```

## Self-Review Checklist

- Spec coverage:
  - Canvas-first workspace: Tasks 4-5.
  - Mock dataset and data health: Task 2.
  - Cleaning choice: Tasks 2 and 5.
  - Anomaly alert: Tasks 2 and 5.
  - Funnel, cohort, trend, Pareto charts: Task 6.
  - Chart controls: Task 6.
  - AI bubble and follow-up block: Task 7.
  - Slash command: Task 7.
  - Report preview and mock exports: Task 8.
  - Light/dark and responsive styling: Tasks 4 and 9.
  - Validation and known browser policy limit: Task 9.
- No planned task requires real backend, real LLM, real Feishu export, or real Office/PDF export.
- Type names are consistent: `CleaningChoice`, `ChartKind`, `CanvasBlock`, `LiveMetricRow`, `DataHealthSummary`.
- The first implementation plan intentionally initializes git only if the folder is not already a repository.
