// import { Providers } from "@/comp/providers";
// import "./globals.css";
// import { Inter } from "next/font/google";
// import { ToastContainer } from "react-toastify";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
// import { usePathname } from "next/navigation";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "BizInsight360 - Olu Ekele / EKE Systems",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const isLoginPage = pathname === "/";

//   const style = {
//     "--sidebar-width": "20rem",
//     "--sidebar-width-icon": "4rem",
//   } as React.CSSProperties;

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <ToastContainer />
//         <Providers>
//           {isLoginPage ? (
//             children
//           ) : (
//             <SidebarProvider style={style}>
//               <div className="flex h-screen w-full">
//                 <AppSidebar />
//                 <div className="flex flex-col flex-1">
//                   <header className="flex items-center justify-between border-b border-border px-6 py-4">
//                     <SidebarTrigger data-testid="button-sidebar-toggle" />
//                     <div className="text-sm text-muted-foreground">
//                       Welcome to BizInsight360
//                     </div>
//                   </header>
//                   <main className="flex-1 overflow-auto p-6 lg:p-8">
//                     <div className="mx-auto max-w-7xl">{children}</div>
//                   </main>
//                   <footer className="border-t border-border px-6 py-4 text-center text-sm text-muted-foreground">
//                     <p>BizInsight360 by Olu Ekele / EKE Systems</p>
//                   </footer>
//                 </div>
//               </div>
//             </SidebarProvider>
//           )}
//         </Providers>
//       </body>
//     </html>
//   );
// }

import { Providers } from "@/components/providers";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
