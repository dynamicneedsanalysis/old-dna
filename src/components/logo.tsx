"use client";

import Image from "next/image";
import { EB_Garamond } from "next/font/google";
import { cn } from "@/lib/utils";

const ebGaramond = EB_Garamond({ subsets: ["latin"] });

export function Logo() {
  return (
    <div className="flex items-center gap-4">
      <Image
        src="/logo.svg"
        alt="Dynamic Needs Analysis"
        width={40}
        height={40}
      />
      <span
        className={cn(
          "text-4xl font-bold lg:inline-block",
          ebGaramond.className
        )}
      >
        DNA
      </span>
    </div>
  );
}
