import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { formatDistance } from "date-fns";
import LargeHeading from "@/ui/LargeHeading";
import Paragraph from "@/ui/Paragraph";
import { Input } from "@mui/material";

import { FC } from "react";
import DashboardTable from "./DashboardTable";

interface MealsDashboardProps {}

const MealsDashboard = async () => {
  const user = await getServerSession(authOptions);
  if (!user) notFound();

  const meals = await db.meal.findMany({
    where: {userId: user.user.id,},
    include: {foodItems: true},
  })

  return <div className="container flex flex-col gap-6 items-center">
    <LargeHeading>Welcome back, {user.user.name}</LargeHeading>

    <DashboardTable meals={meals}/>
  </div>;
};

export default MealsDashboard;
