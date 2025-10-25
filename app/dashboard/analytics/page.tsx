"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { AdvancedChart } from "@/components/Charts/AdvancedChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { AnalyticsData } from "@/types";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("all");

  const { data } = useQuery<AnalyticsData>({
    queryKey: ["analytics", timeRange],
    queryFn: () =>
      api.get(`/analytics?timeRange=${timeRange}`).then((res) => res.data),
  });

  const barData = {
    labels: data?.salesOverTime.map((s) => s.date) || [],
    datasets: [
      {
        label: "Sales",
        data: data?.salesOverTime.map((s) => s.sales) || [],
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const pieData = {
    labels: Object.keys(data?.categories || {}),
    datasets: [
      {
        data: Object.values(data?.categories || {}),
        backgroundColor: ["#3B82F6", "#10B981"],
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <Select onValueChange={setTimeRange} defaultValue={timeRange}>
        <SelectTrigger>
          <SelectValue placeholder="Time Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="month">Last Month</SelectItem>
          <SelectItem value="year">Last Year</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-96">
          <AdvancedChart
            type="bar"
            data={barData}
            options={{ responsive: true }}
          />
        </div>
        <div className="h-96">
          <AdvancedChart
            type="pie"
            data={pieData}
            options={{ responsive: true }}
          />
        </div>
      </div>
    </motion.div>
  );
}
