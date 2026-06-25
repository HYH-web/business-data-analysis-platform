import { describe, expect, it } from "vitest";
import * as xlsx from "xlsx";
import { importAnalysisFile } from "./dataImport";

describe("dataImport", () => {
  it("parses CSV uploads into normalized live rows", async () => {
    const csv = [
      "时间,曝光,进房,商品点击,提交订单,支付,GMV,退款率,客单价,商品,人群,复购周期",
      "20:00,1000,260,86,36,27,12800,0.05,128,连衣裙,新客,首购",
      "20:05,1200,300,99,42,32,16320,0.04,128,上衣,老客,7日",
    ].join("\n");

    const file = new File([csv], "live-data.csv", { type: "text/csv" });
    const result = await importAnalysisFile(file);

    expect(result.sourceName).toBe("live-data.csv");
    expect(result.rowCount).toBe(2);
    expect(result.columnCount).toBeGreaterThanOrEqual(12);
    expect(result.rows[0]).toMatchObject({
      timeSlot: "20:00",
      exposure: 1000,
      enterRoom: 260,
      productClick: 86,
      orderSubmit: 36,
      payment: 27,
      gmv: 12800,
      refundRate: 0.05,
      aov: 128,
      productName: "连衣裙",
      userSegment: "新客",
      repurchaseCohort: "首购",
    });
  });

  it("fills in missing funnel fields from the closest available metrics", async () => {
    const csv = [
      "time,gmv,payment,aov,product,user_segment,repurchase_cohort",
      "20:00,12800,100,128,连衣裙,新客,首购",
    ].join("\n");

    const file = new File([csv], "partial.csv", { type: "text/csv" });
    const result = await importAnalysisFile(file);

    expect(result.rows[0].timeSlot).toBe("20:00");
    expect(result.rows[0].gmv).toBe(12800);
    expect(result.rows[0].payment).toBe(100);
    expect(result.rows[0].aov).toBe(128);
    expect(result.rows[0].refundRate).toBeGreaterThanOrEqual(0);
    expect(result.rows[0].productName).toBe("连衣裙");
  });

  it("parses XLSX uploads from the first worksheet", async () => {
    const workbook = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet([
      {
        时间: "21:00",
        GMV: 22800,
        支付: 120,
        客单价: 190,
        商品: "风衣",
        人群: "老客",
        复购周期: "30日",
      },
    ]);
    xlsx.utils.book_append_sheet(workbook, sheet, "live");
    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new File([buffer], "live-data.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const result = await importAnalysisFile(file);

    expect(result.sourceName).toBe("live-data.xlsx");
    expect(result.rows[0]).toMatchObject({
      timeSlot: "21:00",
      gmv: 22800,
      payment: 120,
      productName: "风衣",
      userSegment: "老客",
      repurchaseCohort: "30日",
    });
  });
});
