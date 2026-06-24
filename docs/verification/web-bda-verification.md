# Web BDA Canvas Demo Verification

Date: 2026-06-24

## Commands

- `npm test`: PASS, 5 test files, 16 tests.
- `npm run build`: PASS. Vite reports one expected large chunk warning from the ECharts bundle.
- `npm run lint`: PASS.

## Browser QA

Target: `http://127.0.0.1:5173/`

- Desktop 1440 x 920: PASS. Header is visible, 4 chart cards render, and all chart canvases have nonblank drawing surfaces.
- AI follow-up flow: PASS. Choose `方案 A`, click the `转化漏斗` card, confirm `发送追问` appears, send the follow-up, confirm `AI BP 追问结论` appears and `发送追问` count becomes 0.
- Report preview: PASS. The report dialog opens, `导出 PDF` and `生成飞书文档` are visible, and the mock PDF export status appears.
- Mobile 390 x 844: PASS. The workspace and report preview fit without horizontal overflow.
- Overflow: PASS. Desktop and mobile checks both reported `canScrollX: false`.

## Screenshot Evidence

- `docs/verification/screenshots/desktop-1440-final.png`
- `docs/verification/screenshots/desktop-after-followup-final.png`
- `docs/verification/screenshots/desktop-report-final.png`
- `docs/verification/screenshots/mobile-390-report-final.png`

## Known Limits

- Demo data is mocked.
- AI follow-up generation is mocked.
- Export actions are mocked and do not create real PDF, Office, or Feishu files.
- There is no backend integration or authentication layer in this prototype.
