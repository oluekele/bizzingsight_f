"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Watermark } from "@/components/Watermark";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useAuthQueries";
import { useEffect } from "react";

export default function Settings() {
  const form = useForm({ defaultValues: { name: "", email: "" } });

  const { data: user, isLoading } = useUser();
  console.log("kkkk: ", user);
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  const onSubmit = () => toast.success("Profile updated");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold">User Profile</h2>
      {isLoading ? (
        <p>Loading user...</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={user?.name} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={user?.email} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-black">
              Update
            </Button>
          </form>
        </Form>
      )}
      <div className="text-center">
        <h3>Brand Watermark</h3>
        <Watermark />
      </div>
    </motion.div>
  );
}
