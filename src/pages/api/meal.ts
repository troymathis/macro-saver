import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { z } from "zod";
import { Food } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    // creating a new meal
    return await createMeal(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function createMeal(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  const foodBody = body.foodItems;

  try {
    const user = await getServerSession(req, res, authOptions).then(
      (res) => res?.user
    );

    const result = await db.meal.create({
      data: {
        userId: body.user,
        name: body.name,
        flag: body.flag,
        AteAt: new Date(body.AteAt),
        createdAt: new Date(),
        foodItems: {
          connectOrCreate: foods.map((food) => {
            return {
              where: {
                name_quantity: {
                  name: food.name,
                  quantity: foodBody[item],
                },
              },
              create: {
                name: item,
                quantity: parseFloat(foodBody[item]),
                type: food.type,
                calories: food.calories * parseFloat(foodBody[item]),
                calcium: food.calcium * parseFloat(foodBody[item]),
                cholesterol: food.cholesterol * parseFloat(foodBody[item]),
                fiber: food.fiber * parseFloat(foodBody[item]),
                iron: food.iron * parseFloat(foodBody[item]),
                potassium: food.potassium * parseFloat(foodBody[item]),
                protein: food.protein * parseFloat(foodBody[item]),
                total_carbohydrates:
                  food.total_carbohydrates * parseFloat(foodBody[item]),
                sodium: food.sodium * parseFloat(foodBody[item]),
                sugar: food.sugar * parseFloat(foodBody[item]),
                total_fat: food.total_fat * parseFloat(foodBody[item]),
              },
            };
          }),
        },
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues, result: null });
    }
    return res.status(500).json({
      error: "Internal Server Error teehee",
      result: null,
    });
  }
}
