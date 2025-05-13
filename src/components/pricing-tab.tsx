import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { cn } from "@/lib/utils";
import { CircleCheckIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PricingTab() {
  return (
    <Tabs defaultValue="monthly" className="">
      <TabsList className="mx-auto mb-4 grid w-[400px] grid-cols-2">
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="annually">Annually</TabsTrigger>
      </TabsList>
      <TabsContent value="monthly">
        <ProPlanCard value="monthly" />
      </TabsContent>
      <TabsContent value="annually">
        <ProPlanCard value="annually" />
      </TabsContent>
    </Tabs>
  );
}

// Takes: A value for the Plan type (monthly or annually).
function ProPlanCard({ value }: { value: "monthly" | "annually" }) {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-4">
        <CardTitle className="mb-4 text-3xl font-bold">Professional</CardTitle>
        {value === "monthly" && (
          <>
            <p className="my-4 flex items-end justify-center gap-4">
              <span className="text-4xl font-bold">$100</span>
              <span className="text-sm">/ month</span>
            </p>
          </>
        )}
        {value === "annually" && (
          <>
            <div className="my-4 flex flex-col items-center">
              <div className="flex items-end gap-4">
                <p className="text-4xl font-bold">$999.99</p>
                <p className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-2xl font-bold line-through">
                    $1199.99
                  </span>
                  <span className="text-sm">/ year</span>
                </p>
              </div>
            </div>
          </>
        )}
        <div className="flex justify-center">
          <LoginLink
            postLoginRedirectURL={`/pricing?plan=${value}`}
            className={cn(buttonVariants(), "mt-4")}
          >
            Subscribe
          </LoginLink>
        </div>

        <CardDescription className="text-wrap">
          <span>
            Get started today with all you need to optimize your client&apos;s
            financial planning and insurance needs
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="text-muted-foreground grid gap-3 text-sm font-medium">
          <li className="flex items-center">
            <CircleCheckIcon className="stroke-secondary-foreground mr-2 size-5 fill-green-600" />{" "}
            Unlimited Clients
          </li>
          <li className="flex items-center">
            <CircleCheckIcon className="stroke-secondary-foreground mr-2 size-5 fill-green-600" />{" "}
            AI Insurance Advisor
          </li>
          <li className="flex items-center">
            <CircleCheckIcon className="stroke-secondary-foreground mr-2 size-5 fill-green-600" />{" "}
            Realtime Dashboard Analytics
          </li>
          <li className="flex items-center">
            <CircleCheckIcon className="stroke-secondary-foreground mr-2 size-5 fill-green-600" />{" "}
            Premium Support
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
