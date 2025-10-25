import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata = {
  title: "BizInsight360 - Olu Ekele / EKE Systems",
  description: "Admin Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
