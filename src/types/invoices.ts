export type InvoiceStatus = "unpaid" | "paid";

export interface InvoiceItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  staffId: string;
  staffName: string;
  invoiceNumber: string;
  description?: string;
  period: {
    startDate: string;
    endDate: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  total: number;
  status: InvoiceStatus;
  createdAt: string;
  paidAt?: string;
  notes?: string;
}

export interface InvoiceSummary {
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}

export interface InvoiceGenerationSettings {
  frequency: "weekly" | "monthly";
  autoGenerate: boolean;
  includeTax: boolean;
  taxRate: number;
}



