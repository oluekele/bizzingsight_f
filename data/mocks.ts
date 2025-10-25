import { AnalyticsData, Customer, KPI, Product, Sale } from "@/types";

export const mockKpis: KPI = {
  totalSales: 150000,
  profitMargin: 32.5,
  customerCount: 1200,
  topProducts: [
    { name: "Product A", sales: 50000 },
    { name: "Product B", sales: 30000 },
    { name: "Product C", sales: 20000 },
  ],
};

export const mockProducts: Product[] = [
  { id: 1, name: "Product A", stock: 100, price: 50 },
  { id: 2, name: "Product B", stock: 200, price: 30 },
  { id: 3, name: "Product C", stock: 150, price: 40 },
];

export const mockSales: Sale[] = [
  { id: 1, productId: 1, quantity: 5, total: 250, date: "2025-10-01" },
  { id: 2, productId: 2, quantity: 10, total: 300, date: "2025-10-02" },
];

export const mockCustomers: Customer[] = [
  { id: 1, name: "Customer X", loyaltyScore: 85, purchaseFrequency: 12 },
  { id: 2, name: "Customer Y", loyaltyScore: 70, purchaseFrequency: 8 },
];

export const mockAnalytics: AnalyticsData = {
  salesOverTime: [
    { date: "2025-09", sales: 100000 },
    { date: "2025-10", sales: 50000 },
  ],
  categories: { Electronics: 60, Clothing: 40 },
};

export const mockReport = "Mock PDF content"; // For blob simulation
