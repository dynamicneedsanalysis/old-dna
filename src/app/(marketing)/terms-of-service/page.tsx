"use client";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";
import { mdxComponents } from "@/app/(marketing)/mdx";
import DocumentContent from "@/app/(marketing)/terms-of-service/content.mdx";
import DocumentUpdates from "@/app/(marketing)/terms-of-service/updates.mdx";

export default function Page() {
  return (
    <main className="mx-auto my-10 max-w-5xl flex-col p-8 sm:px-12 md:px-16">
      <Heading variant="h1" className="mb-8 text-center text-5xl font-bold">
        Terms of Service
      </Heading>
      <Card className="relative w-full p-6">
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
