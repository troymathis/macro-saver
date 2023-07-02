import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Macro Saver | Dashboard",
  description: "Track your macros through every meal",
};

const page = async () => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();

  const meals = await db.meal.findMany({
    where: { userId: user.user.id },
  });

  return <div>page</div>;
};

export default page;
