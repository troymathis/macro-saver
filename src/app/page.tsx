import SignInButton from "@/components/SignInButton";
import SignOutButton from "@/components/SignOutButton";
import { buttonVariants } from "@/components/ui/Button";
import LargeHeading from "@/components/ui/LargeHeading";
import Paragraph from "@/components/ui/Paragraph";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MacroSaver | Home",
  description: "Track your macros through every meal",
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative h-screen flex items-center justify-center overflow-x-hidden">
      <div className="container pt-32 max-w-7xl mx-auto w-full h-full">
        <div className="h-full gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start">
          <LargeHeading
            size="lg"
            className="three-d text-lime-800 dark:text-lime-100"
          >
            Track every macro <br />
            per meal.
          </LargeHeading>

          <Paragraph className="max-w-xl lg: text-left p-4">
            This tool brings out the best in your meals by selecting each food
            category and the amount, returning a list of critical macros for
            every meal.
          </Paragraph>
          <div className={cn('lg:hidden md:hidden')}>
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
          <div className="relative w-full max-w-lg lg:max-w-3xl lg:left-1/2 aspect-square lg:absolute">
            <Image
              priority
              className="img-shadow"
              quality={100}
              style={{ objectFit: "contain" }}
              fill
              src="/food.png"
              alt="food"
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
