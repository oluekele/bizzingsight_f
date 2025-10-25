"use client";

import { useSearchParams } from "next/navigation";
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
import { useResendToken, useResetPassword } from "@/hooks/useAuthQueries";

const schema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const form = useForm<FormData>({ resolver: zodResolver(schema) });
  const { mutateAsync: resetPassword, isPending: isResetting } =
    useResetPassword();
  const { mutateAsync: resendToken, isPending: isResending } = useResendToken();

  const onSubmit = async (data: FormData) => {
    await resetPassword({ token: data.token, newPassword: data.newPassword });
  };

  return (
    <div className="p-8 rounded-2xl shadow-lg max-w-md w-full bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Reset Password
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reset Token</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter reset token"
                    disabled={isResetting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    placeholder="********"
                    disabled={isResetting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary"
            disabled={isResetting}
          >
            {isResetting ? "Resetting..." : "Reset Password"}
          </Button>

          {email && (
            <Button
              type="button"
              variant="link"
              onClick={() => resendToken(email)}
              className="w-full text-primary"
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Resend Token"}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
