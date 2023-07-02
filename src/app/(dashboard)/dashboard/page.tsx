import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import MealsDashboard from "@/components/MealsDashboard";

export const metadata: Metadata = {
  title: "Macro Saver | Dashboard",
  description: "Track your macros through every meal",
};

const page = async () => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();

  const meals: object | null = await db.meal.findMany({
    where: { userId: user.user.id },
  });

  return <div className="max-w-7xl mx-auto mt-16">
    <MealsDashboard/>
  </div>;
};

export default page;
