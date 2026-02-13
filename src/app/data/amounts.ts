/** Danh sách phần thưởng lì xì: số đẹp kiểu 1.688, 6.868 (nhiều số nhỏ, ít số lớn) */

export const LIXI_AMOUNTS = [
  1688, 2688, 3688, 5168, 6868, 8688,
  10888, 16888, 18888, 26868, 26868, 36868,
  68688, 88888
];

export function getRandomAmount(): number {
  return LIXI_AMOUNTS[Math.floor(Math.random() * LIXI_AMOUNTS.length)];
}

/** Tạo 20 mốc thưởng chia đều từ min đến max (mốc 1 = min, mốc 20 = max). */
export function getTiers(min: number, max: number): number[] {
  if (min >= max) return [min];
  const tiers: number[] = [];
  for (let i = 0; i < 20; i++) {
    const t = min + ((max - min) * i) / 19;
    tiers.push(Math.round(t));
  }
  return tiers;
}

/**
 * Chọn mốc theo tỉ lệ: 60% mốc 1–14, 35% mốc 15–18, 5% mốc 19–20.
 * Trả về index 0–19 (mốc 1 = index 0).
 */
function pickTierIndex(): number {
  const r = Math.random();
  if (r < 0.6) return Math.floor(Math.random() * 14); // 0..13
  if (r < 0.95) return 14 + Math.floor(Math.random() * 4); // 14..17
  return 18 + Math.floor(Math.random() * 2); // 18..19
}

/** Thay 4 số cuối của mệnh giá bằng 6868 hoặc 2026. */
function applyLuckySuffix(amount: number): number {
  const suffix = Math.random() < 0.5 ? 6868 : 2026;
  if (amount < 10000) return suffix;
  const prefix = Math.floor(amount / 10000);
  return prefix * 10000 + suffix;
}

/**
 * Bốc một mệnh giá trong khoảng [min, max]:
 * 20 mốc chia đều, xác suất 60/35/5, rồi thay 4 số cuối bằng 6868 hoặc 2026.
 */
export function getRandomAmountInRange(min: number, max: number): number {
  const tiers = getTiers(min, max);
  const idx = pickTierIndex();
  const amount = tiers[idx];
  return applyLuckySuffix(amount);
}

export function formatAmount(n: number): string {
  return n.toLocaleString("vi-VN");
}
