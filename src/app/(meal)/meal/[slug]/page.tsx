import MacroTable from "@/components/MacroTable";
import LargeHeading from "@/components/ui/LargeHeading";
import Paragraph from "@/components/ui/Paragraph";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Meal } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = async ({ params: { slug } }) => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();
  // @ts-expect-error Server Component
  const meal: Meal = await db.meal.findFirst({
    where: { id: slug },
    include: { foodItems: true },
  });
  // @ts-expect-error Server Component
  const food = meal.foodItems;

  const foodLen = food.length
  const foodInEach = food.map((item: { name: any }, i: number) => {
    if (i+1 === foodLen) {
      return ` ${item.name}`
    }
    return ` ${item.name},`;
  });
  return meal ? (
    <div className="flex flex-row pl-24 pr-24">
      <div className=" max-w-7xl mx-auto w-full h-full sm:pt-48">
        <LargeHeading size="lg" className="three-d">
          {meal.name}
        </LargeHeading>
        <br />
        <LargeHeading size="sm">- {meal.flag}</LargeHeading>
        <br />
        <Paragraph className="max-w-xl lg: text-left">
          Contains:
        </Paragraph>
        <LargeHeading size='sm'>{foodInEach}</LargeHeading>
      </div>
      <div className="container pt-16 max-w-7xl mx-auto w-full h-full sm:pt-48 p-20">
        <LargeHeading size="default" className="three-d mb-4">Macros</LargeHeading>
        <MacroTable meal={meal}/>
      </div>
    </div>
  ) : (
    notFound()
  );
};

export default page;
