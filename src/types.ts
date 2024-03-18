interface Voucher {
  id?: string;
  code: string;
  pin: string;
  balance: number;
  originalBalance: number;

  merchant: string;
  description?: string;
  image?: string;
  expiry?: Date;
}