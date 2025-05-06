"use client";

import { useEffect, useState } from "react";
import { Loader2Icon, PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintPDFButton() {
  const [isLoading, setIsLoading] = useState(false);

  // On mount, set a loading state for 3 seconds.
  useEffect(() => {
    setIsLoading(true);
    // Simulate a delay
    const id = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(id);
  }, []);
  return (
    <Button
      disabled={isLoading}
      className="mb-5 print:hidden"
      onClick={() => window.print()}
      aria-label="Print PDF"
    >
      <div className="flex items-center gap-2">
        {isLoading ? (
          <>
            <Loader2Icon className="animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <PrinterIcon className="h-4 w-4" />
            <span>Print PDF</span>
          </>
        )}
      </div>
    </Button>
  );
}
