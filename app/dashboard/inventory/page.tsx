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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProductForm } from "@/components/ProductForm";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"; // Add this import
import { Product } from "@/types";
import { toast } from "react-hot-toast";
import Papa from "papaparse";

export default function Inventory() {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => api.get("/products").then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Product>) => api.post("/products", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      api.put(`/products/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const handleBulkImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        api.post("/products/bulk", results.data).then(() => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          toast.success("Bulk import successful");
        });
      },
    });
  };

  if (isLoading) return <Skeleton className="h-64 rounded-2xl" />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary">Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <ProductForm onSubmit={createMutation.mutate} />
          </DialogContent>
        </Dialog>
        <Input
          type="file"
          accept=".csv"
          onChange={handleBulkImport}
          className="w-auto"
          aria-label="Bulk Import CSV"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>${p.price}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mr-2">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <ProductForm
                      defaultValues={p}
                      onSubmit={(data) =>
                        updateMutation.mutate({ id: p.id, data })
                      }
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(p.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
