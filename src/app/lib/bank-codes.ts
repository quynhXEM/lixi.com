/** Mapping tên ngân hàng sang BIN (Bank Identification Number) cho VietQR API */

const BANK_BIN_MAP: Record<string, string> = {
  "Agribank": "970405",
  "Vietcombank": "970436",
  "BIDV": "970418",
  "VietinBank": "970415",
  "Techcombank": "970407",
  "MB Bank": "970422",
  "ACB": "970416",
  "VPBank": "970432",
  "TPBank": "970423",
  "HDBank": "970437",
  "Sacombank": "970403",
  "VIB": "970441",
  "SHB": "970443",
  "LPBank": "970449",
  "OCB": "970448",
  "MSB": "970426",
  "SeABank": "970440",
  "VietCapitalBank": "970454",
  "BaoVietBank": "970438",
  "SCB": "970429",
  "VietBank": "970427",
  "ABBANK": "970425",
  "BacABank": "970409",
  "VietABank": "970427",
  "NamABank": "970428",
  "PGBank": "970430",
  "KienLongBank": "970452",
  "PVcomBank": "970412",
  "Vietnam Maritime Bank": "970426",
  "Saigon Bank": "970424",
  "Bắc Á Bank": "970409",
  "Đông Á Bank": "970406",
  "GPBank": "970408",
  "Oceanbank": "970414",
  "NCB": "970419",
  "Shinhan Bank": "970424",
  "HSBC Vietnam": "970442",
  "Standard Chartered": "970410",
  "Hong Leong Bank": "970421",
  "UOB Vietnam": "970458",
  "Public Bank Vietnam": "970439",
};

/**
 * Lấy BIN (Bank Identification Number) từ tên ngân hàng cho VietQR API.
 * Nếu không tìm thấy, trả về null.
 */
export function getBankCode(bankName: string): string | null {
  const normalized = bankName.trim();
  // Tìm exact match
  if (BANK_BIN_MAP[normalized]) {
    return BANK_BIN_MAP[normalized];
  }
  // Tìm case-insensitive
  const found = Object.keys(BANK_BIN_MAP).find(
    (key) => key.toLowerCase() === normalized.toLowerCase()
  );
  if (found) {
    return BANK_BIN_MAP[found];
  }
  return null;
}

/**
 * Tạo URL QR code VietQR sử dụng BIN (Bank Identification Number)
 * Format: https://api.vietqr.io/image/{BIN}-{ACCOUNT}-compact2.png?amount={AMOUNT}&addInfo={TRANSACTION_ID}&accountName={NAME}
 */
export function getVietQRUrl(
  bin: string,
  account: string,
  amount: number,
  transactionId: string,
  accountName?: string
): string {
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo: transactionId,
  });
  if (accountName) {
    params.append("accountName", accountName);
  }
  return `https://api.vietqr.io/image/${bin}-${account}-compact2.png?${params.toString()}`;
}
