import { getServerSession } from "next-auth";
import { FC } from "react";
import Link from "next/link";
import ThemeToggle from "@/ui/ThemeToggle";
import { buttonVariants } from "@/ui/Button";
import { Lilita_One } from "next/font/google";
import { cn } from "@/lib/utils";
import SignInButton from "./SignInButton";
import SignOutButton from "./SignOutButton";
import { authOptions } from "@/lib/auth";

interface NavbarProps {}

const bebas = Lilita_One({ subsets: ["latin"], weight: "400" });

const Navbar = async ({}) => {
  const session = await getServerSession(authOptions);

  return (
    <div className="fixed backdrop-blur-sm bg-white/75 dark:bg-slate-900/75 z-50 top-0 left-0 right-0 h-20 border-b border-lime-300 dark:border-lime-700 shadow-sm flex items-center justify-between">
      <div className="container max-w-7xl mx-auto w-full flex justify-between items-center p-5">
        <Link
          href="/"
          className={`text-[18px] ${bebas.className} ${buttonVariants({
            variant: "link",
          })}`}
        >
          MacroSaver
        </Link>
        <div className="md:hidden">
          <ThemeToggle />
        </div>
        <div className="hidden md:flex gap-4">
          <ThemeToggle />
          {session ? (
            <>
              <Link
                className={buttonVariants({ variant: "ghost" })}
                href="/dashboard"
              >
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
