import {
  Invoice,
  InvoiceItem,
  InvoiceSummary,
  InvoiceGenerationSettings,
} from "@/types";

// Sample invoices data
export const sampleInvoices: Invoice[] = [
  {
    id: "inv-1",
    staffId: "staff-1",
    staffName: "John Doe",
    invoiceNumber: "INV-2024-001",
    period: {
      startDate: "2024-01-01",
      endDate: "2024-01-07",
    },
    items: [
      {
        id: "item-1",
        description: "Development work - Week 1",
        hours: 40,
        rate: 50,
        amount: 2000,
      },
    ],
    subtotal: 2000,
    total: 2000,
    status: "paid",
    createdAt: "2024-01-08T00:00:00Z",
    paidAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "inv-2",
    staffId: "staff-2",
    staffName: "Jane Smith",
    invoiceNumber: "INV-2024-002",
    period: {
      startDate: "2024-01-01",
      endDate: "2024-01-07",
    },
    items: [
      {
        id: "item-2",
        description: "Content and marketing work - Week 1",
        hours: 35,
        rate: 40,
        amount: 1400,
      },
    ],
    subtotal: 1400,
    total: 1400,
    status: "unpaid",
    createdAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "inv-3",
    staffId: "staff-1",
    staffName: "John Doe",
    invoiceNumber: "INV-2024-003",
    period: {
      startDate: "2024-01-08",
      endDate: "2024-01-14",
    },
    items: [
      {
        id: "item-3",
        description: "Development work - Week 2",
        hours: 38,
        rate: 50,
        amount: 1900,
      },
    ],
    subtotal: 1900,
    total: 1900,
    status: "unpaid",
    createdAt: "2024-01-15T00:00:00Z",
  },
];

// Invoice generation settings
export const defaultInvoiceSettings: InvoiceGenerationSettings = {
  frequency: "weekly",
  autoGenerate: true,
  includeTax: false,
  taxRate: 0,
};

// Utility functions for invoice management
export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `INV-${year}-${randomNum}`;
};

export const calculateInvoiceTotal = (
  items: InvoiceItem[],
  taxRate: number = 0
): number => {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * taxRate;
  return subtotal + tax;
};

export const generateInvoice = (
  staffId: string,
  staffName: string,
  period: { startDate: string; endDate: string },
  totalHours: number,
  hourlyRate: number,
  settings: InvoiceGenerationSettings = defaultInvoiceSettings
): Invoice => {
  const invoiceNumber = generateInvoiceNumber();
  const subtotal = totalHours * hourlyRate;
  const tax = settings.includeTax ? subtotal * settings.taxRate : 0;
  const total = subtotal + tax;

  const items: InvoiceItem[] = [
    {
      id: `item-${Date.now()}`,
      description: `Work hours - ${period.startDate} to ${period.endDate}`,
      hours: totalHours,
      rate: hourlyRate,
      amount: subtotal,
    },
  ];

  return {
    id: `inv-${Date.now()}`,
    staffId,
    staffName,
    invoiceNumber,
    period,
    items,
    subtotal,
    tax: settings.includeTax ? tax : undefined,
    total,
    status: "unpaid",
    createdAt: new Date().toISOString(),
  };
};

export const calculateInvoiceSummary = (
  invoices: Invoice[]
): InvoiceSummary => {
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
  const unpaidInvoices = totalInvoices - paidInvoices;

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  const unpaidAmount = totalAmount - paidAmount;

  return {
    totalInvoices,
    paidInvoices,
    unpaidInvoices,
    totalAmount,
    paidAmount,
    unpaidAmount,
  };
};

export const getInvoicesByStaff = (
  invoices: Invoice[],
  staffId: string
): Invoice[] => {
  return invoices.filter((invoice) => invoice.staffId === staffId);
};

export const getInvoicesByStatus = (
  invoices: Invoice[],
  status: "paid" | "unpaid"
): Invoice[] => {
  return invoices.filter((invoice) => invoice.status === status);
};

export const getInvoicesByPeriod = (
  invoices: Invoice[],
  startDate: string,
  endDate: string
): Invoice[] => {
  return invoices.filter((invoice) => {
    const invStart = new Date(invoice.period.startDate);
    const invEnd = new Date(invoice.period.endDate);
    const filterStart = new Date(startDate);
    const filterEnd = new Date(endDate);

    return invStart >= filterStart && invEnd <= filterEnd;
  });
};

export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const getInvoiceStatusColor = (status: "paid" | "unpaid"): string => {
  return status === "paid"
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
};

export const getInvoiceStatusIcon = (status: "paid" | "unpaid"): string => {
  return status === "paid" ? "✓" : "⏳";
};



