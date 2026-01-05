"use client";

import { Button } from "@repo/ui/components/button";
import { Printer } from "lucide-react";

export function InvoiceActions() {
  return (
    <div className="flex gap-4 print:hidden">
      <Button onClick={() => window.print()} variant="outline">
        <Printer className="mr-2 h-4 w-4" />
        Cetak Invoice
      </Button>
    </div>
  );
}
