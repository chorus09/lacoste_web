"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

import { OrderColumn } from "./columns";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied to the clipboard.");
  };

  return (
    <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => onCopy(data.id)}>
      <span className="sr-only">Copy id</span>
      <Copy className="h-4 w-4" />
    </Button>
  );
};
