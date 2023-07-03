import LargeHeading from "@/components/ui/LargeHeading";
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
  // @ts-expect-error Server Componen
  const meal: Meal = await db.meal.findFirst({
    where: { id: slug },
    include: { foodItems: true },
  });
  console.log(meal);

  return <div className='relative h-screen flex flex-col items-center overflow x-hidden'>
    <div className="container pt-16 max-w-7xl mx-auto w-full h-full sm:pt-48">
    <LargeHeading>{meal.name}</LargeHeading>
    
    </div>
  </div>;
};

export default page;
