import LargeHeading from "@/components/ui/LargeHeading";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
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
  const meal: object | null = await db.meal.findFirst({
    where: { id: slug },
    include: { foodItems: true },
  });
  console.log(meal);

  return <LargeHeading></LargeHeading>;
};

export default page;
