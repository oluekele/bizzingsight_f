"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, Sale } from "@/types";
import { toast } from "react-hot-toast";

const schema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});

type FormData = z.infer<typeof schema>;

interface SalesFormProps {
  products: Product[];
  onSubmit: (data: FormData & { total: number }) => void;
}

export function SalesForm({ products, onSubmit }: SalesFormProps) {
  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleSubmit = (data: FormData) => {
    const product = products.find((p) => p.id === data.productId);
    if (!product) return;
    const total = data.quantity * product.price;
    onSubmit({ ...data, total });
    toast.success("Sale recorded");
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-accent">
          Record Sale
        </Button>
      </form>
    </Form>
  );
}
