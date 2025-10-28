"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface Kpi {
  id: string;
  name: string;
  value: number;
  date: string;
}

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
}

interface Customer {
  id: number;
  name: string;
  loyaltyScore: number;
  purchaseFrequency: number;
}

interface Sale {
  id: number;
  productId: number;
  quantity: number;
  total: number;
  date: string;
}

export default function DashboardOverview() {
  const { isAuthenticated, userRole } = useAuth();

  // Fetch KPIs
  const { data: kpis, isLoading: kpisLoading } = useQuery<Kpi[]>({
    queryKey: ["kpis"],
    queryFn: async () => {
      const { data } = await api.get("/kpis");
      return data;
    },
    enabled: !!isAuthenticated,
  });

  // Fetch Products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data;
    },
    enabled: !!isAuthenticated,
  });

  // Fetch Customers
  const { data: customers, isLoading: customersLoading } = useQuery<Customer[]>(
    {
      queryKey: ["customers"],
      queryFn: async () => {
        const { data } = await api.get("/customers");
        return data;
      },
      enabled: !!isAuthenticated,
    }
  );

  // Fetch Sales
  const { data: sales, isLoading: salesLoading } = useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data } = await api.get("/sales");
      // Ensure numeric values
      return data.map((sale: any) => ({
        id: sale.id,
        productId: sale.productId,
        quantity: parseInt(sale.quantity, 10) || 0,
        total: parseFloat(sale.total) || 0,
        date: sale.date,
      }));
    },
    enabled: !!isAuthenticated,
  });

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-600">Please log in to view the dashboard</p>
      </div>
    );
  }

  // Show loading spinner while fetching data
  if (kpisLoading || productsLoading || customersLoading || salesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Calculate metrics
  const totalRevenue = sales?.reduce((sum, sale) => sum + sale.total, 0) ?? 0;
  const totalStock =
    products?.reduce((sum, product) => sum + product.stock, 0) ?? 0;
  const avgLoyalty =
    customers && customers.length > 0
      ? customers.reduce((sum, customer) => sum + customer.loyaltyScore, 0) /
        customers.length
      : 0;
  const totalSales = sales?.length ?? 0;

  // Format numbers
  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalRevenue);

  // Debug log (remove in production)
  console.log("Dashboard metrics:", {
    totalRevenue,
    formattedRevenue,
    totalStock,
    avgLoyalty,
    totalSales,
    salesCount: sales?.length,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 bg-gray-50 min-h-screen"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-2 sm:mt-0">Welcome, {userRole}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">
              Total Revenue
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formattedRevenue}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">
              Total Stock
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalStock.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">
              Avg Loyalty
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {avgLoyalty.toFixed(1)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-gray-500 mb-1">
              Total Sales
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalSales}</div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Chart */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            KPI Performance
          </h2>
          {kpis && kpis.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={kpis}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-center">No KPI data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
