import { FC } from "react";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import EditForm from "@/components/EditForm";

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = async ({ params: { slug } }) => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();
  const userId = user.user.id
  // @ts-expect-error Server Component
  const meal: Meal = await db.meal.findFirst({
    where: { id: slug },
    include: { foodItems: true },
  });

  const food = await db.food.findMany({
    where: { quantity: 1 },
  });

  return (
    <div>
      <EditForm meal={meal} userId={userId} food={food}/>
    </div>
  );
};

export default page;
