# Real Data Upload Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the dashboard accept CSV/XLSX uploads, normalize them into the existing analysis model, and switch all charts, health checks, and summaries from demo rows to real uploaded rows.

**Architecture:** Keep the current dashboard shell and visuals, but move the data source behind one upload pipeline. A new parser module will read CSV/XLSX files, map common business column aliases into the current `LiveMetricRow` shape, and return normalized rows plus source metadata. `App.tsx` will own the active dataset state and pass the selected rows into the health summary and chart components; when no file is uploaded, it will keep using the existing mock dataset.

**Tech Stack:** React 18, TypeScript, Vite, `xlsx`, ECharts, Vitest, Testing Library.

---

### Task 1: Add the upload parser and row normalization layer

**Files:**
- Modify: `package.json`, `package-lock.json`
- Modify: `src/types/domain.ts`
- Create: `src/lib/dataImport.ts`
- Create: `src/lib/dataImport.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
it("parses CSV uploads into normalized live rows", async () => {
  const file = new File([csvText], "live-data.csv", { type: "text/csv" });
  const result = await importAnalysisFile(file);
  expect(result.rows).toHaveLength(2);
  expect(result.rows[0].timeSlot).toBe("20:00");
  expect(result.rows[0].gmv).toBe(12800);
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test src/lib/dataImport.test.ts -v`

Expected: fail because `src/lib/dataImport.ts` does not exist yet.

- [ ] **Step 3: Implement the parser**

Add `xlsx` support, a lightweight CSV parser, alias matching for common columns such as `时间`, `GMV`, `曝光`, `进房`, `点击`, `下单`, `支付`, `退款率`, `客单价`, and a normalization function that always returns `LiveMetricRow[]`.

- [ ] **Step 4: Run the parser tests again**

Run: `npm test src/lib/dataImport.test.ts -v`

Expected: pass.

- [ ] **Step 5: Commit the parser layer**

```bash
git add package.json package-lock.json src/types/domain.ts src/lib/dataImport.ts src/lib/dataImport.test.ts
git commit -m "feat: add upload data parser"
```

### Task 2: Wire uploaded rows into the dashboard

**Files:**
- Modify: `src/App.tsx`, `src/components/AppShell.tsx`, `src/components/CanvasBoard.tsx`, `src/components/blocks/ChartCard.tsx`, `src/lib/dataHealth.ts`, `src/lib/canvasBlocks.ts`
- Create: `src/components/DataImportBar.tsx`
- Modify: `src/components/CanvasBoard.test.tsx`, `src/App.test.tsx`

- [ ] **Step 1: Write the failing integration tests**

```ts
it("switches the dashboard to uploaded rows after file import", async () => {
  render(<App />);
  await userEvent.upload(screen.getByLabelText("导入数据文件"), file);
  expect(await screen.findByText("已导入 2 行")).toBeInTheDocument();
  expect(screen.getByText("数据源：live-data.csv")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npm test src/App.test.tsx src/components/CanvasBoard.test.tsx -v`

Expected: fail because the upload controls and dataset state are not wired yet.

- [ ] **Step 3: Implement the upload flow**

Add a visible upload bar with a file input, a reset-to-demo action, and upload status text. Store the active dataset in `App.tsx`, recalculate the health summary from the active rows, and pass those rows into every chart card.

- [ ] **Step 4: Run the integration tests again**

Run: `npm test src/App.test.tsx src/components/CanvasBoard.test.tsx -v`

Expected: pass.

- [ ] **Step 5: Commit the dashboard wiring**

```bash
git add src/App.tsx src/components/AppShell.tsx src/components/CanvasBoard.tsx src/components/blocks/ChartCard.tsx src/lib/dataHealth.ts src/lib/canvasBlocks.ts src/components/DataImportBar.tsx src/App.test.tsx src/components/CanvasBoard.test.tsx
git commit -m "feat: wire uploaded data into dashboard"
```

### Task 3: Polish upload UX and verify the production build

**Files:**
- Modify: `src/styles/global.css`, `src/components/DataImportBar.tsx`, `src/components/blocks/DataHealthCard.tsx`, `src/components/ReportPreview.tsx`
- Create: if needed, one small helper under `src/lib/` for file-state labels

- [ ] **Step 1: Write the failing UI polish test**

```ts
it("shows an error message when the uploaded file is unsupported", async () => {
  render(<App />);
  await userEvent.upload(screen.getByLabelText("导入数据文件"), new File(["x"], "bad.txt"));
  expect(screen.getByText("请上传 CSV 或 Excel 文件")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test src/App.test.tsx -v`

Expected: fail until unsupported-file feedback exists.

- [ ] **Step 3: Add the final UX polish**

Style the upload band to match the current dashboard, keep the demo fallback obvious, and make the empty/error states readable on mobile.

- [ ] **Step 4: Verify the full project**

Run:
`npm test`
`npm run build`
`npm run lint`

Expected: all pass.

- [ ] **Step 5: Commit the finished feature**

```bash
git add src/styles/global.css src/components/DataImportBar.tsx src/components/blocks/DataHealthCard.tsx src/components/ReportPreview.tsx
git commit -m "feat: polish uploaded data experience"
```
