"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useAuthQueries";

const navItems = [
  { label: "Overview", href: "/dashboard", roles: ["ADMIN", "USER"] },
  {
    label: "Inventory",
    href: "/dashboard/inventory",
    roles: ["ADMIN", "USER"],
  },
  { label: "Sales", href: "/dashboard/sales", roles: ["ADMIN", "USER"] },
  {
    label: "Customers",
    href: "/dashboard/customers",
    roles: ["ADMIN", "USER"],
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    roles: ["ADMIN", "USER"],
  },
  { label: "Reports", href: "/dashboard/reports", roles: ["ADMIN", "USER"] },
  { label: "Settings", href: "/dashboard/settings", roles: ["ADMIN"] },
  { label: "Register", href: "/dashboard/register", roles: ["ADMIN"] },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { userRole } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  const handleClose = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-4 z-50"
        aria-label="Open menu"
      >
        Menu
      </Button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg md:relative md:translate-x-0 z-50 overflow-y-auto"
      >
        {/* <motion.aside className="fixed top-0 left-0  w-64 bg-white shadow-lg md:relative md:translate-x-0 z-50 overflow-y-auto h-screen"> */}
        <div className="p-4 flex flex-col h-full">
          <div className="w-full flex justify-end">
            <Button
              onClick={() => setIsOpen(false)}
              className="md:hidden mb-4 w-6 h-8 rounded-full border bg-accent hover:bg-transparent text-black cursor-pointer"
              aria-label="Close menu"
            >
              X
            </Button>
          </div>

          <ul className="space-y-4 flex-1">
            {navItems
              .filter((item) => item.roles.includes(userRole || ""))
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => handleClose()}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-2xl transition-shadow hover:shadow-md ${
                        pathname === item.href
                          ? "bg-primary text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </motion.div>
                  </Link>
                </li>
              ))}
          </ul>

          <Button
            onClick={() => logout()}
            className="mt-auto bg-black cursor-pointer text-white"
            aria-label="Logout"
            disabled={isPending}
          >
            {isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </motion.aside>
      {/* </motion.aside> */}

      {/* Overlay when sidebar open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
