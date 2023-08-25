import MacroTable from "@/components/MacroTable";
import Button, { buttonVariants } from "@/components/ui/Button";
import LargeHeading from "@/components/ui/LargeHeading";
import Paragraph from "@/components/ui/Paragraph";
import { toast } from "@/components/ui/Toast";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Meal } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { FC, FormEvent } from "react";

export const metadata: Metadata = {
  title: "Macro Saver | View Meal",
  description: "Track your macros through every meal",
};

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = async ({ params: { slug } }) => {
  const user = await getServerSession(authOptions);
  const editString = `/meal/${slug}/edit`;
  if (!user) return notFound();
  // @ts-expect-error Server Component
  const meal: Meal = await db.meal.findFirst({
    where: { id: slug },
    include: { foodItems: true },
  });
  // @ts-expect-error Server Component
  const food = meal.foodItems;

  let serving = 0;
  let calories = 0;
  const foodLen = food.length;
  const foodInEach = food.map(
    (item: { name: any; quantity: number; calories: number }, i: number) => {
      serving += item.quantity;
      calories += item.calories;
      if (i + 1 === foodLen) {
        return ` ${item.name}`;
      }
      return ` ${item.name},`;
    }
  );
  return meal ? (
    <div className="flex flex-row pl-24 pr-24 mt-16">
      <div className=" max-w-7xl mx-auto w-full h-full">
        <LargeHeading size="lg" className="three-d">
          {meal.name}
        </LargeHeading>
        <br />
        <LargeHeading size="sm">- {meal.flag}</LargeHeading>
        <br />
        <Paragraph className="max-w-xl lg:text-left">Contains:</Paragraph>
        <LargeHeading size="sm">{foodInEach}</LargeHeading>
        <br />
        <LargeHeading size="sm" className="three-d max-w-xl lg:text-left">
          Serving:
        </LargeHeading>
        <br />
        <LargeHeading size="sm">{serving} grams</LargeHeading>
        <br />
        <LargeHeading size="sm" className="three-d max-w-xl lg:text-left">
          Calories:
        </LargeHeading>
        <br />
        <LargeHeading size="sm">{calories.toFixed(2)}</LargeHeading>
        <br />
        <div className="mt-10 flex flex-col gap-4 max-w-fit">
          <Link
            className={buttonVariants({ variant: "default" })}
            href={editString}
            prefetch={false}
          >
            Edit Meal
          </Link>

          <Link
            className={buttonVariants({ variant: "default" })}
            href="/dashboard"
          >
            Back to Dashboard
          </Link>
          
          
        </div>
      </div>
      <div className="container max-w-7xl mx-auto w-full h-full">
        <LargeHeading size="default" className="three-d mb-4">
          Macros
        </LargeHeading>
        <MacroTable meal={meal} />
        
      </div>
      
    </div>
  ) : (
    notFound()
  );
};

export default page;
