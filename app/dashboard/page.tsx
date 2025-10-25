"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
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

  const {
    data: kpis,
    isLoading: kpisLoading,
    isError: kpisError,
  } = useQuery<Kpi[]>({
    queryKey: ["kpis"],
    queryFn: async () => {
      const { data } = await api.get("/kpis");
      return data;
    },
    enabled: isAuthenticated,
  });

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data;
    },
    enabled: isAuthenticated,
  });

  const {
    data: customers,
    isLoading: customersLoading,
    isError: customersError,
  } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data } = await api.get("/customers");
      return data;
    },
    enabled: isAuthenticated,
  });

  const {
    data: sales,
    isLoading: salesLoading,
    isError: salesError,
  } = useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data } = await api.get("/sales");
      return data;
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center text-lg text-gray-700">
        Please log in to view the dashboard.
      </div>
    );
  }

  if (kpisError || productsError || customersError || salesError) {
    toast.error("Failed to load one or more datasets");
  }

  const totalRevenue =
    sales?.reduce((acc, sale) => acc + Number(sale.total), 0) ?? 0;

  const totalStock = products?.reduce((acc, p) => acc + p.stock, 0) ?? 0;

  const avgLoyalty =
    customers && customers.length
      ? customers.reduce((acc, c) => acc + c.loyaltyScore, 0) / customers.length
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 bg-gray-50 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Dashboard Overview
      </h1>
      <p className="text-gray-600 mb-8">Welcome, {userRole}</p>

      {kpisLoading || productsLoading || customersLoading || salesLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-6 h-6 text-primary" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-gray-500 text-sm">Total Revenue</h3>
                <p className="text-2xl font-bold mt-2">
                  ${totalRevenue.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-gray-500 text-sm">
                  Total Products in Stock
                </h3>
                <p className="text-2xl font-bold mt-2">{totalStock}</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-gray-500 text-sm">Average Loyalty Score</h3>
                <p className="text-2xl font-bold mt-2">
                  {avgLoyalty.toFixed(1)}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-gray-500 text-sm">Total KPIs Tracked</h3>
                <p className="text-2xl font-bold mt-2">{kpis?.length || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* KPI Trend Chart */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">KPI Performance</h2>
              {kpis && kpis.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={kpis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-sm">No KPI data available</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
}
