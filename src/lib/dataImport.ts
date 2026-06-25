import type { LiveMetricRow } from "../types/domain";

export interface ImportedDataset {
  rows: LiveMetricRow[];
  sourceName: string;
  rowCount: number;
  columnCount: number;
  columnNames: string[];
  mappedColumns: string[];
  warnings: string[];
}

type RawCell = string | number | boolean | null | undefined;
type RawRecord = Record<string, RawCell>;
type LiveMetricField = keyof LiveMetricRow;
type ColumnMap = Partial<Record<LiveMetricField, string>>;

const supportedExtensions = new Set(["csv", "xls", "xlsx"]);

const columnAliases: Record<LiveMetricField, string[]> = {
  timeSlot: ["timeSlot", "time_slot", "time", "slot", "date", "datetime", "时间", "时段", "日期"],
  pcu: ["pcu", "online", "online_users", "在线人数", "峰值在线", "观看人数", "直播在线人数"],
  gmv: ["gmv", "sales", "revenue", "amount", "pay_amount", "成交额", "销售额", "支付金额", "成交金额"],
  exposure: ["exposure", "impression", "impressions", "曝光", "曝光量", "展现量"],
  enterRoom: ["enterRoom", "enter_room", "room_enter", "visits", "进房", "进房人数", "进入直播间"],
  productClick: ["productClick", "product_click", "click", "clicks", "商品点击", "点击", "点击人数"],
  orderSubmit: ["orderSubmit", "order_submit", "submit", "orders", "下单", "提交订单", "下单人数", "订单提交"],
  payment: ["payment", "paid", "paid_orders", "pay_count", "支付", "支付订单", "成交订单", "支付人数"],
  refundRate: ["refundRate", "refund_rate", "refund", "退款率", "售后率", "退货率"],
  aov: ["aov", "avg_order_value", "客单价", "件单价", "平均订单金额"],
  productName: ["productName", "product_name", "product", "sku", "item", "商品", "商品名称", "款式"],
  userSegment: ["userSegment", "user_segment", "segment", "audience", "人群", "用户分层", "用户类型"],
  repurchaseCohort: ["repurchaseCohort", "repurchase_cohort", "cohort", "复购周期", "复购", "周期"],
};

const fieldLabels: Record<LiveMetricField, string> = {
  timeSlot: "时间",
  pcu: "PCU",
  gmv: "GMV",
  exposure: "曝光",
  enterRoom: "进房",
  productClick: "商品点击",
  orderSubmit: "提交订单",
  payment: "支付",
  refundRate: "退款率",
  aov: "客单价",
  productName: "商品",
  userSegment: "人群",
  repurchaseCohort: "复购周期",
};

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_\-./\\()[\]{}:：|]+/g, "");
}

function getExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function hasReadableValue(value: RawCell) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function getText(record: RawRecord, columnName?: string, fallback = "") {
  if (!columnName) {
    return fallback;
  }

  const value = record[columnName];
  return hasReadableValue(value) ? String(value).trim() : fallback;
}

function parseNumber(value: RawCell, options: { percent?: boolean } = {}) {
  if (!hasReadableValue(value)) {
    return null;
  }

  if (typeof value === "number") {
    return options.percent && value > 1 ? value / 100 : value;
  }

  const raw = String(value).trim();
  const hasPercentSign = raw.includes("%");
  const normalized = raw
    .replace(/[,%￥¥$元人次单件\s]/g, "")
    .replace(/[，]/g, "")
    .replace(/[％]/g, "");
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  if (options.percent || hasPercentSign) {
    return parsed > 1 ? parsed / 100 : parsed;
  }

  return parsed;
}

function toCount(value: number | null, fallback: number) {
  const safeValue = value ?? fallback;
  return Math.max(0, Math.round(Number.isFinite(safeValue) ? safeValue : fallback));
}

function buildColumnMap(columnNames: string[]) {
  const normalizedColumns = columnNames.map((columnName) => ({
    original: columnName,
    normalized: normalizeHeader(columnName),
  }));

  return (Object.keys(columnAliases) as LiveMetricField[]).reduce<ColumnMap>((map, field) => {
    const aliases = columnAliases[field].map(normalizeHeader);
    const exact = normalizedColumns.find((column) => aliases.includes(column.normalized));
    const fuzzy =
      exact ??
      normalizedColumns.find((column) =>
        aliases.some((alias) => alias.length >= 2 && column.normalized.includes(alias)),
      );

    if (fuzzy) {
      map[field] = fuzzy.original;
    }

    return map;
  }, {});
}

function collectColumnNames(records: RawRecord[]) {
  const names = new Set<string>();
  records.forEach((record) => {
    Object.keys(record).forEach((key) => {
      if (key.trim()) {
        names.add(key);
      }
    });
  });
  return Array.from(names);
}

function parseCsvRows(text: string) {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  const source = text.replace(/^\uFEFF/, "");
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const nextChar = source[index + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(current.trim());
      if (row.some((cell) => cell !== "")) {
        rows.push(row);
      }
      current = "";
      row = [];
      continue;
    }

    current += char;
  }

  row.push(current.trim());
  if (row.some((cell) => cell !== "")) {
    rows.push(row);
  }

  return rows;
}

function rowsToRecords(rows: string[][]): RawRecord[] {
  const [headerRow, ...dataRows] = rows;
  if (!headerRow) {
    return [];
  }

  return dataRows
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row) =>
      headerRow.reduce<RawRecord>((record, header, index) => {
        record[header.trim()] = row[index] ?? "";
        return record;
      }, {}),
    );
}

function normalizeRecord(record: RawRecord, columnMap: ColumnMap, index: number): LiveMetricRow {
  const rawGmv = parseNumber(record[columnMap.gmv ?? ""]);
  const rawPayment = parseNumber(record[columnMap.payment ?? ""]);
  const rawAov = parseNumber(record[columnMap.aov ?? ""]);
  const inferredAov = rawAov ?? (rawGmv && rawPayment ? rawGmv / rawPayment : null);
  const payment = toCount(rawPayment ?? (rawGmv && inferredAov ? rawGmv / inferredAov : null), index + 1);
  const gmv = rawGmv ?? payment * (inferredAov ?? 100);
  const aov = rawAov ?? (payment > 0 ? Number((gmv / payment).toFixed(2)) : null);
  const orderSubmit = toCount(parseNumber(record[columnMap.orderSubmit ?? ""]), Math.max(payment, payment / 0.72));
  const productClick = toCount(
    parseNumber(record[columnMap.productClick ?? ""]),
    Math.max(orderSubmit, orderSubmit / 0.42),
  );
  const enterRoom = toCount(parseNumber(record[columnMap.enterRoom ?? ""]), Math.max(productClick, productClick / 0.33));
  const exposure = toCount(parseNumber(record[columnMap.exposure ?? ""]), Math.max(enterRoom, enterRoom / 0.26));
  const pcu = toCount(parseNumber(record[columnMap.pcu ?? ""]), Math.max(enterRoom, exposure * 0.15));
  const refundRate = parseNumber(record[columnMap.refundRate ?? ""], { percent: true }) ?? 0;

  return {
    timeSlot: getText(record, columnMap.timeSlot, `Row ${index + 1}`),
    pcu,
    gmv: Number(gmv.toFixed(2)),
    exposure,
    enterRoom,
    productClick,
    orderSubmit,
    payment,
    refundRate: Number(Math.max(0, refundRate).toFixed(4)),
    aov,
    productName: getText(record, columnMap.productName, `商品 ${index + 1}`),
    userSegment: getText(record, columnMap.userSegment, "默认人群"),
    repurchaseCohort: getText(record, columnMap.repurchaseCohort, "首购"),
  };
}

export function normalizeImportedRecords(records: RawRecord[]) {
  const columnNames = collectColumnNames(records);
  const columnMap = buildColumnMap(columnNames);
  const rows = records.map((record, index) => normalizeRecord(record, columnMap, index));
  const mappedFields = (Object.keys(columnMap) as LiveMetricField[]).map((field) => fieldLabels[field]);
  const warnings = (Object.keys(columnAliases) as LiveMetricField[])
    .filter((field) => !columnMap[field])
    .map((field) => `未识别${fieldLabels[field]}字段，已用近似规则补齐。`);

  return {
    rows,
    columnNames,
    columnCount: columnNames.length,
    mappedColumns: mappedFields,
    warnings,
  };
}

export function parseCsvText(text: string) {
  return rowsToRecords(parseCsvRows(text));
}

async function parseWorkbook(file: File) {
  const xlsx = await import("xlsx");
  const workbook = xlsx.read(await readFileAsArrayBuffer(file), { type: "array" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return [];
  }

  return xlsx.utils.sheet_to_json<RawRecord>(workbook.Sheets[sheetName], {
    defval: null,
    raw: false,
  });
}

function readFileAsText(file: File) {
  const modernFile = file as File & { text?: () => Promise<string> };
  if (typeof modernFile.text === "function") {
    return modernFile.text();
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result ?? "")));
    reader.addEventListener("error", () => reject(reader.error ?? new Error("无法读取文件内容")));
    reader.readAsText(file);
  });
}

function readFileAsArrayBuffer(file: File) {
  const modernFile = file as File & { arrayBuffer?: () => Promise<ArrayBuffer> };
  if (typeof modernFile.arrayBuffer === "function") {
    return modernFile.arrayBuffer();
  }

  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as ArrayBuffer));
    reader.addEventListener("error", () => reject(reader.error ?? new Error("无法读取文件内容")));
    reader.readAsArrayBuffer(file);
  });
}

export async function importAnalysisFile(file: File): Promise<ImportedDataset> {
  const extension = getExtension(file.name);
  if (!supportedExtensions.has(extension)) {
    throw new Error("请上传 CSV 或 Excel 文件");
  }

  const records = extension === "csv" ? parseCsvText(await readFileAsText(file)) : await parseWorkbook(file);
  if (records.length === 0) {
    throw new Error("文件没有可分析的数据行");
  }

  const normalized = normalizeImportedRecords(records);
  return {
    ...normalized,
    sourceName: file.name,
    rowCount: normalized.rows.length,
  };
}
