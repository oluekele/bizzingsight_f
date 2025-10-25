"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SalesForm } from "@/components/SalesForm";
import { Product, Sale } from "@/types";

export default function Sales() {
  const queryClient = useQueryClient();

  const { data: products } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => api.get("/products").then((res) => res.data),
  });

  const { data: sales } = useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: () => api.get("/sales").then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<Sale>) => api.post("/sales", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["kpis"] }); // Simulate update to analytics
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-black">New Sale</Button>
        </DialogTrigger>
        <DialogContent>
          <SalesForm products={products || []} onSubmit={mutation.mutate} />
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales?.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.productId}</TableCell>
              <TableCell>{s.quantity}</TableCell>
              <TableCell>${s.total}</TableCell>
              <TableCell>{s.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Invoice preview: Add a button to view selected sale as PDF preview */}
    </motion.div>
  );
}
