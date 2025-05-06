"use client";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";
import { mdxComponents } from "@/app/(marketing)/mdx";
import DocumentContent from "@/app/(marketing)/privacy-notice/content.mdx";
import DocumentUpdates from "@/app/(marketing)/privacy-notice/updates.mdx";

export default function Page() {
  return (
    <main className="mx-auto my-10 max-w-5xl flex-col p-8 sm:px-12 md:px-16">
      <Heading variant="h1" className="mb-8 text-center text-5xl font-bold">
        Privacy Notice
      </Heading>
      <Card className="relative w-full p-6">
        <p className="absolute right-8 m-0 ml-auto pt-2 pr-2 text-gray-600 italic">
          Version 1.0.1
        </p>
        <p className="absolute right-8 m-0 ml-auto pt-8 pr-2 text-gray-600 italic">
          2025-03-28
        </p>
        <CardContent className="p-0">
          <DocumentUpdates components={mdxComponents} />
        </CardContent>
        <CardContent className="p-2">
          <DocumentContent components={mdxComponents} />
        </CardContent>
      </Card>
    </main>
  );
}
