"use client";

import { ArrowRight } from "lucide-react";
import { moneyFormatter } from "@/lib/utils";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Client } from "@/app/dashboard/(subscribed)/clients/lib/schema";

// Takes: A Client object.
export function ClientCard({ client }: { client: Client }) {
  return (
    <Link href={`/dashboard/client/${client.id}/reporting`}>
      <Card className="group relative rounded-3xl transition-colors hover:bg-gray-200 dark:hover:bg-zinc-900">
        <CardHeader className="pt-8">
          <CardTitle className="text-2xl font-bold">
            {client.name}, {client.age}
          </CardTitle>
          <CardDescription>{client.province}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {moneyFormatter.format(parseFloat(client.annualIncome))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-end">
            <div>
              <ArrowRight />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
