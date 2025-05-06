"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva(null, {
  variants: {
    variant: {
      h1: "mb-4 text-3xl font-bold",
      h2: "mb-7 border-b-2 border-primary pb-4 text-xl font-bold text-primary",
    },
  },
  defaultVariants: {
    variant: "h1",
  },
});

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

export function Heading({ variant, className, ...props }: HeadingProps) {
  const HeadingComponent = variant ?? "h1";
  return (
    <HeadingComponent
      {...props}
      className={cn(headingVariants({ variant, className }))}
    />
  );
}
