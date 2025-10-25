"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Customer } from "@/types";

export default function Customers() {
  const { data: customers } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: () => api.get("/customers").then((res) => res.data),
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Loyalty Score</TableHead>
            <TableHead>Purchase Frequency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers?.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.loyaltyScore}</TableCell>
              <TableCell>{c.purchaseFrequency}/year</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart
            data={
              customers?.map((c) => ({
                name: c.name,
                frequency: c.purchaseFrequency,
              })) || []
            }
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="frequency" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
