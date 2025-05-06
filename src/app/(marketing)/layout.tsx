import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  // Get auth status for current user.
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  return (
    <>
      <header className="bg-navbar z-40 w-full">
        <div className="container flex flex-col items-center justify-between py-6 lg:flex-row">
          <Link href="/">
            <div className="text-navbar-foreground mb-4 lg:mb-0">
              <Logo />
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "text-navbar-foreground"
              )}
            >
              Home
            </Link>
            <Link
              href="/#team"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "text-navbar-foreground"
              )}
            >
              Our Team
            </Link>
            <Link
              href="/#pricing"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "text-navbar-foreground"
              )}
            >
              Pricing
            </Link>
            <Link
              href="/contact-us"
              className={cn(
                buttonVariants({ size: "sm" }),
                "text-navbar-foreground"
              )}
            >
              Get Demo
            </Link>
            {isUserAuthenticated ? (
              <Link
                href="/dashboard/clients"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "ml-4 bg-slate-500 hover:bg-slate-600"
                )}
              >
                Dashboard
              </Link>
            ) : (
              <LoginLink
                postLoginRedirectURL="/dashboard/clients"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "ml-4 bg-slate-500 hover:bg-slate-600"
                )}
              >
                Login
              </LoginLink>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className={"border-t"}>
        <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose md:text-left">
              &copy; {new Date().getFullYear()} - Dynamic Needs Analysis
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
