"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function Reports() {
  const downloadReport = async () => {
    try {
      const res = await api.get("/reports", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "report.pdf";
      link.click();
      toast.success("Report downloaded");
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-64"
    >
      <Button onClick={downloadReport} className="bg-primary">
        Generate & Download PDF Report
      </Button>
    </motion.div>
  );
}
