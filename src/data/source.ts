/**
 * Базовый набор помесячных данных портала (демо-данные MVP).
 * Все производные показатели считаются из этих значений, поэтому
 * цифры на дашбордах всегда согласованы между собой.
 * Суммы — в тенге.
 */
export type RawMonth = {
  ym: string
  newStudents: number
  renewals: number
  refunds: number
  avgCheck: number
  leads: number
  marketing: number
  payroll: number
  platform: number
  content: number
  admin: number
}

export const RAW: RawMonth[] = [
  { ym: '2024-10', newStudents: 391, renewals: 64, refunds: 10, avgCheck: 164500, leads: 4425, marketing: 12979000, payroll: 18140000, platform: 4630000, content: 5800000, admin: 3770000 },
  { ym: '2024-11', newStudents: 402, renewals: 66, refunds: 11, avgCheck: 170000, leads: 4783, marketing: 13078000, payroll: 19840000, platform: 4780000, content: 5650000, admin: 4030000 },
  { ym: '2024-12', newStudents: 320, renewals: 59, refunds: 7, avgCheck: 169500, leads: 4200, marketing: 11191000, payroll: 15520000, platform: 3550000, content: 4380000, admin: 3070000 },
  { ym: '2025-01', newStudents: 410, renewals: 77, refunds: 13, avgCheck: 167000, leads: 4815, marketing: 15073000, payroll: 19400000, platform: 5000000, content: 6240000, admin: 4050000 },
  { ym: '2025-02', newStudents: 406, renewals: 80, refunds: 14, avgCheck: 176000, leads: 4987, marketing: 13568000, payroll: 19430000, platform: 5240000, content: 5990000, admin: 4110000 },
  { ym: '2025-03', newStudents: 384, renewals: 68, refunds: 11, avgCheck: 174000, leads: 4461, marketing: 13801000, payroll: 18000000, platform: 4620000, content: 5500000, admin: 4180000 },
  { ym: '2025-04', newStudents: 354, renewals: 71, refunds: 9, avgCheck: 175000, leads: 4265, marketing: 12294000, payroll: 16670000, platform: 4000000, content: 5310000, admin: 3890000 },
  { ym: '2025-05', newStudents: 321, renewals: 62, refunds: 8, avgCheck: 178500, leads: 3765, marketing: 10885000, payroll: 15730000, platform: 4090000, content: 4940000, admin: 3740000 },
  { ym: '2025-06', newStudents: 283, renewals: 59, refunds: 7, avgCheck: 179000, leads: 3628, marketing: 9994000, payroll: 13980000, platform: 3530000, content: 4260000, admin: 3230000 },
  { ym: '2025-07', newStudents: 286, renewals: 59, refunds: 10, avgCheck: 182000, leads: 3392, marketing: 10439000, payroll: 14520000, platform: 3600000, content: 4880000, admin: 3290000 },
  { ym: '2025-08', newStudents: 335, renewals: 67, refunds: 7, avgCheck: 180000, leads: 4081, marketing: 11553000, payroll: 16880000, platform: 4140000, content: 5480000, admin: 3840000 },
  { ym: '2025-09', newStudents: 500, renewals: 114, refunds: 12, avgCheck: 184500, leads: 6296, marketing: 18792000, payroll: 26000000, platform: 6480000, content: 7990000, admin: 5310000 },
  { ym: '2025-10', newStudents: 471, renewals: 99, refunds: 16, avgCheck: 181500, leads: 5459, marketing: 16991000, payroll: 23340000, platform: 6080000, content: 7040000, admin: 5260000 },
  { ym: '2025-11', newStudents: 479, renewals: 107, refunds: 11, avgCheck: 181500, leads: 5513, marketing: 17904000, payroll: 24970000, platform: 5720000, content: 8130000, admin: 5300000 },
  { ym: '2025-12', newStudents: 427, renewals: 90, refunds: 11, avgCheck: 184500, leads: 5080, marketing: 16616000, payroll: 23200000, platform: 5350000, content: 7180000, admin: 5090000 },
  { ym: '2026-01', newStudents: 491, renewals: 105, refunds: 14, avgCheck: 183500, leads: 5620, marketing: 17496000, payroll: 24410000, platform: 6440000, content: 8390000, admin: 5750000 },
  { ym: '2026-02', newStudents: 519, renewals: 126, refunds: 14, avgCheck: 185000, leads: 6018, marketing: 20211000, payroll: 28280000, platform: 6880000, content: 8660000, admin: 6170000 },
  { ym: '2026-03', newStudents: 468, renewals: 115, refunds: 11, avgCheck: 183500, leads: 5483, marketing: 17929000, payroll: 24360000, platform: 6010000, content: 8140000, admin: 5480000 },
  { ym: '2026-04', newStudents: 435, renewals: 115, refunds: 13, avgCheck: 191500, leads: 5306, marketing: 16931000, payroll: 24520000, platform: 6250000, content: 7960000, admin: 5170000 },
  { ym: '2026-05', newStudents: 400, renewals: 96, refunds: 9, avgCheck: 190000, leads: 5016, marketing: 14771000, payroll: 21630000, platform: 5420000, content: 6420000, admin: 4750000 },
  { ym: '2026-06', newStudents: 347, renewals: 94, refunds: 8, avgCheck: 187000, leads: 4478, marketing: 13858000, payroll: 19020000, platform: 4420000, content: 5390000, admin: 4180000 },
  { ym: '2026-07', newStudents: 345, renewals: 85, refunds: 7, avgCheck: 194500, leads: 4278, marketing: 12879000, payroll: 19530000, platform: 4620000, content: 5550000, admin: 4230000 },
  { ym: '2026-08', newStudents: 424, renewals: 110, refunds: 9, avgCheck: 189000, leads: 4811, marketing: 17605000, payroll: 23390000, platform: 5370000, content: 6840000, admin: 5050000 },
  { ym: '2026-09', newStudents: 595, renewals: 159, refunds: 19, avgCheck: 197000, leads: 7147, marketing: 22997000, payroll: 34850000, platform: 8460000, content: 10260000, admin: 7290000 },
];
