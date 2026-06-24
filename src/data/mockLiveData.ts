import type { LiveMetricRow } from "../types/domain";

const slots = [
  "20:00",
  "20:05",
  "20:10",
  "20:15",
  "20:20",
  "20:25",
  "20:30",
  "20:35",
  "20:40",
  "20:45",
  "20:50",
  "20:55",
  "21:00",
  "21:05",
  "21:10",
  "21:15",
  "21:20",
  "21:25",
  "21:30",
  "21:35",
  "21:40",
  "21:45",
  "21:50",
  "21:55",
  "22:00",
  "22:05",
  "22:10",
  "22:15",
  "22:20",
  "22:25",
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
