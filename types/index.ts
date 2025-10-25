export interface KPI {
  totalSales: number;
  profitMargin: number;
  customerCount: number;
  topProducts: { name: string; sales: number }[];
}

export interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
}

export interface Sale {
  id: number;
  productId: number;
  quantity: number;
  total: number;
  date: string;
}

export interface Customer {
  id: number;
  name: string;
  loyaltyScore: number;
  purchaseFrequency: number;
}

export interface AnalyticsData {
  salesOverTime: { date: string; sales: number }[];
  categories: Record<string, number>;
}
