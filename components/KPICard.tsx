import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: string | number;
  children?: React.ReactNode;
}

export function KPICard({ title, value, children }: KPICardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 rounded-2xl shadow hover:shadow-lg transition-shadow bg-white">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-primary">{value}</p>
        {children}
      </Card>
    </motion.div>
  );
}
