import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import Providers from "@/providers/providers";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dynamic Needs Analysis",
  description:
    "DNA is an insurance advisor platform that streamlines workflows with AI-driven insights, compliance automation, and client management tools, empowering advisors to deliver fast, personalized service.",
  openGraph: {
    images: "https://www.dynamicneedsanalysis.com/og.png",
    url: "https://www.dynamicneedsanalysis.com/og.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased")}>
        <div className="bg-background flex min-h-dvh flex-col">
          <Providers>
            <NextSSRPlugin
              /**
               * The `extractRouterConfig` will extract **only** the route configs
               * from the router to prevent additional information from being
               * leaked to the client. The data passed to the client is the same
               * as if you were to fetch `/api/uploadthing` directly.
               */
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
            {children}
            <Toaster position="top-center" richColors />
          </Providers>
        </div>
      </body>
      <Script src="/apollo.js" />
    </html>
  );
}
