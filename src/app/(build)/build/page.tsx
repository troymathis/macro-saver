import BuildMeal from "@/components/BuildMeal";
import LargeHeading from "@/components/ui/LargeHeading";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

const page = async ({}) => {
    
  const user = await getServerSession(authOptions);
  let userId: string = ""

  if (!user) {return notFound()} else {userId = user.user.id}

  
  const food = await db.food.findMany({
    where: { quantity: 1 },
  });

  return (
    <div className="flex flex-col items-center">
      <LargeHeading className="p-1">Hey! What'd you eat today?</LargeHeading>
    <div>
      <BuildMeal food={food} userId={userId}/>
    </div>
    </div>
  );
};

export default page;
