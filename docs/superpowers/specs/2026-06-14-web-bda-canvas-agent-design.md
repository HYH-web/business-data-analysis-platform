# Web BDA Canvas Agent Design

## Goal

Build a high-fidelity front-end demo for a ByteDance-style Douyin E-commerce and live operations AI data analysis agent. The first version must make the canvas workflow feel real: operators paste or load data, align cleaning choices, see alerts, ask follow-up questions beside charts, and generate a report preview from the accumulated canvas blocks.

## Product Positioning

The product is an internal AI business data analysis BP for Douyin e-commerce and live operations teams. It should feel like a sharp internal colleague embedded in a workspace, not a generic analytics dashboard or marketing landing page.

The first release is a front-end demo. Data, AI insights, anomaly attribution, and export results are mocked, but the interaction model, information architecture, and state flow should be structured as if real services will be connected later.

## Confirmed MVP Scope

In scope:

- React + TypeScript + Vite single-page app.
- Canvas-first workspace as the default first screen.
- Simulated Douyin e-commerce live-operation dataset.
- Paste-data entry path that shows a parsing state and produces a data health card.
- Interactive data health card with two cleaning options.
- Anomaly alert card pinned near the top of the canvas.
- Chart cards for funnel, cohort heatmap, dual-axis trend, and Pareto analysis.
- Chart-card controls for chart switching, source-data preview, and deletion.
- Floating AI BP bubble that appears as a contextual follow-up interface.
- Follow-up result blocks appended near the selected chart.
- Report preview generated from canvas blocks.
- Export buttons and export status UI for Feishu, Word/PPTX, PDF, and table outputs.
- Light and dark mode styling that follows the system preference.

Out of scope for the first release:

- Real large-model API integration.
- Real Feishu online document or multi-dimensional table creation.
- Real Word, PPTX, PDF, or Excel file generation.
- Real user authentication, permission, or multi-user collaboration.
- Persistent backend storage.
- Production-grade data privacy controls.

## User Persona and Voice

The interface speaks as a senior AI business data analysis BP supporting Douyin e-commerce and live operations colleagues.

Voice rules:

- Short, high-signal sentences.
- Use business operations vocabulary naturally: granularity, alignment, funnel, conversion chain, ROI, closed loop, replay, leverage point, and GMV.
- Prefer action-oriented recommendations over long explanations.
- Keep the final business objective visible: improve conversion and pull GMV.

Example tone:

> 同学，我扫了一眼数据，客单价有 3 个空值。方案 A：按均值填补，我推荐，能保全大盘口径；方案 B：直接剔除，适合看极端异常。咱们对齐一下？

## Information Architecture

### Header

The header floats at the top with a minimal internal-tool feel.

Required elements:

- Editable project name, defaulting to `11.11女装大促复盘_v1`.
- Autosave status, such as `已自动保存于 14:30`.
- Global action buttons:
  - `一键清洗`
  - `沉淀报告`
  - `导出`

The header must not become a large navigation bar. It is a control surface for the active canvas.

### Main Workspace

The main workspace occupies more than 90 percent of the viewport. It uses a free-canvas mental model but can be implemented as a responsive canvas-like board for the first release.

Canvas blocks:

- Text insight block.
- Data health card.
- Anomaly alert card.
- Chart card.
- Follow-up analysis block.
- Report preview block or modal.

Blocks should be visually independent and movable-looking. Full drag-and-drop rearrangement can be simulated in the first release with stable card placement and hover affordances.

### Slash Command

The canvas supports a visible slash-command interaction. In the first release, typing or clicking a slash command entry can open a command menu with:

- `/接入数据`
- `/生成漏斗图`
- `/生成同期群热力图`
- `/生成双轴趋势图`
- `/生成帕累托图`
- `/呼叫大模型追问`

Commands can trigger mocked state changes.

### Contextual AI Bubble

The app does not use a traditional right-side chat panel. Selecting a chart opens a floating AI bubble near that chart. The bubble accepts a follow-up question and appends a new analysis block below the selected chart.

Default example prompt:

`把退货率高的时间段，用户画像拉出来看下`

## Core Workflow

### Step 1: Data Entry

The user can use a simulated dataset immediately. The UI also supports a paste interaction surface: when the user presses Ctrl+V or clicks a paste/import affordance, the canvas shows a local parsing state.

Parsing state copy:

`数据解析中，正在识别表头和字段口径...`

### Step 2: Data Health Card

After parsing, the canvas creates a data health card instead of silently cleaning the data.

The card lists:

- Row and column count.
- Detected key metrics, such as GMV, PCU, conversion rate, refund rate, average order value, product ID, and time slot.
- Data issues, including missing values, anomalous peaks, and inconsistent field names.
- Two cleaning choices:
  - Option A: mean-fill missing average order value, recommended.
  - Option B: remove affected rows, suitable for extreme-anomaly inspection.

The user must choose a cleaning option before the full alert and chart set becomes active.

### Step 3: Anomaly Alerting

After the cleaning choice, the app pins an anomaly alert card near the top of the canvas.

Default alert:

`警报：昨晚 21:00-21:30，直播间转化漏斗出现断崖式下跌，退换货率同步抬升 20%。初步归因可能是讲解 XX 商品时尺码表未对齐，建议优先排查。`

The alert should feel operational and urgent, not decorative.

### Step 4: Chart Generation

The first release includes these chart widgets:

- Funnel chart for conversion chain analysis.
- Cohort heatmap for retention and repurchase analysis.
- Dual-axis composite trend chart for PCU and GMV relationship.
- Pareto chart for product GMV contribution.

All charts must be interactive enough for a demo:

- Hover tooltip with values formatted to two decimals where applicable.
- Chart title and short business conclusion.
- Top-right actions:
  - Switch chart type.
  - View source table.
  - Delete chart.

### Step 5: Conversational Follow-up

Selecting a chart opens the floating AI BP bubble. Submitting a follow-up creates a new block near the chart.

Default follow-up result:

`我把 21:00-21:30 的高退货用户拆了一下，核心集中在新客、低尺码确认行为、以及 XX 单品讲解后的即时下单人群。建议补一张尺码说明卡，并让主播在讲解末尾重复确认。`

### Step 6: Report Preview

Clicking `沉淀报告` creates a structured report preview from the canvas blocks.

Report sections:

- Executive summary.
- Data health and cleaning decision.
- Key anomaly and attribution.
- Core charts and business conclusions.
- Action recommendations.
- Export status panel.

Export buttons appear for:

- Feishu document.
- Feishu multi-dimensional table.
- Word/PPTX.
- PDF.

In the first release, export actions show polished mock success states, not real files.

## Visual Direction

### Design Language

The interface follows a Semi Design / Arco Design-inspired internal-tool language: restrained, clean, high-density, and low-noise. It should not look like a landing page.

The user requested a slightly stronger technology feel. The design should emphasize the dark-mode data workspace and subtle business-pulse motion, while keeping component edges, spacing, and states disciplined.

### Color Tokens

- ByteBlue: `#0B5CFF`
- CanvasGray: `#F5F7FB`
- Ink: `#111827`
- AlertOrange: `#F97316`
- AlertRed: `#EF4444`
- GrowthGreen: `#16A34A`
- DarkCanvas: `#0F172A`
- DarkPanel: `#172033`

### Signature Element

Use a subtle data-grid background on the canvas and a lightweight business-pulse line when alerts or trend highlights are active. The pulse should imply operational signal movement, not decorative neon.

### Components

Cards should use border radius of 8px or less unless a specific overlay needs a slightly softer bubble. Buttons should use icons where appropriate. Chart cards can have a light hover shadow, but page sections must not become nested decorative cards.

### Motion

Motion should be restrained:

- Parsing state progress shimmer.
- Alert pulse on first appearance.
- AI bubble slide/fade near selected chart.
- Chart-card hover controls.

The app must respect reduced-motion preference.

## Data Model for the Demo

Use a local mock dataset shaped around a single live-commerce replay.

Suggested fields:

- `timeSlot`
- `pcu`
- `gmv`
- `exposure`
- `enterRoom`
- `productClick`
- `orderSubmit`
- `payment`
- `refundRate`
- `aov`
- `productName`
- `userSegment`
- `repurchaseCohort`

The data should include:

- A conversion drop around `21:00-21:30`.
- A refund-rate increase around the same interval.
- Three missing values in `aov`.
- Product-level GMV concentration for the Pareto chart.
- Cohort-like retention values for the heatmap.

## Error and Empty States

Required states:

- Empty canvas with paste/import prompt.
- Parsing data state.
- Data health waiting-for-choice state.
- Chart deleted state with undo affordance.
- AI bubble empty input state.
- Report preview generated state.
- Mock export success state.

Errors should be direct and actionable, for example:

`这段数据没识别到表头。换一种复制方式，或先选择模拟数据继续看流程。`

## Accessibility and Responsiveness

The demo should support desktop as the primary experience. It must also remain usable on tablet and mobile widths by stacking canvas blocks vertically.

Requirements:

- Keyboard focus visible on commands and buttons.
- Buttons have clear accessible labels.
- Text must not overflow cards on common desktop and mobile viewports.
- Light and dark mode contrast must stay readable.
- Reduced-motion preference is respected.

## Architecture Direction

The implementation should keep units small and focused:

- App shell and header.
- Canvas board.
- Block model and block renderer.
- Data ingestion and health-check state.
- Mock data and insight generation.
- Chart widgets.
- AI bubble and follow-up flow.
- Report preview and export status.
- Theme tokens and shared UI primitives.

The first implementation should avoid a backend. All state can live in front-end state for the demo.

## Validation Plan

Implementation should verify:

- The app starts from a local dev server.
- Light and dark modes render correctly.
- Desktop and mobile layouts do not overlap.
- Paste/import flow reaches the data health card.
- Cleaning option activates alert and chart blocks.
- Chart controls are visible and clickable.
- AI bubble can append a follow-up block.
- Report preview opens and shows the expected sections.
- Mock export buttons show success states.

Because Codex Browser automation currently rejects agent-driven navigation to the localhost preview under its network policy, browser verification may need to use manual in-app viewing, screenshot artifacts, or other available local verification tools. Any unverified browser behavior must be reported honestly.
