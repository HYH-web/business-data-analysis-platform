# 业务数据智能分析平台

一个面向业务数据分析场景的 Web 原型系统，支持数据体检、清洗方案选择、图表分析、AI 追问结论和报告预览导出模拟。

## 功能亮点

- 数据体检：展示样本行数、字段数量、空值和异常窗口。
- 智能清洗：提供方案 A / B 的清洗决策入口。
- 图表画布：包含转化漏斗、双轴趋势、同期群热力图、帕累托分析。
- AI 追问：围绕选中图表生成追问结论块。
- 报告沉淀：提供报告预览和 PDF / 飞书文档模拟导出。

## 本地运行

请先安装 Node.js，然后执行：

```bash
npm install
npm run dev
```

打开终端显示的本地地址，通常是：

```text
http://127.0.0.1:5173/
```

## 构建

```bash
npm run build
```

构建产物会生成在 `dist/` 目录。

## 测试

```bash
npm test
npm run lint
```

## 部署到 Vercel

Vercel 会自动识别这是一个 Vite 项目。推荐配置：

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

绑定 GitHub 仓库后，每次推送代码到主分支，Vercel 会自动重新部署。

## 展示材料

- 海报：`output/poster/business-data-intelligence-poster.png`
- 验证说明：`docs/verification/web-bda-verification.md`
