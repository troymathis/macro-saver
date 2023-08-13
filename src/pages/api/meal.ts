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
        userId: body.userId,
        name: body.name,
        flag: body.flag,
        AteAt: new Date(body.AteAt),
        createdAt: new Date(),
        foodItems: {
          connectOrCreate: Object.entries(foodBody).map(([key, value]) => {
            const multiplier = parseFloat(value.newQuan).toFixed(2);
            return {
              where: {
                name_quantity: {
                  name: value.name,
                  quantity: parseFloat(value.newQuan),
                },
              },
              create: {
                name: value.name,
                calcium: parseFloat(parseFloat(value.calcium * multiplier).toFixed(2)),
                calories: parseFloat(parseFloat(value.calories * multiplier).toFixed(2)),
                cholesterol: parseFloat(parseFloat(value.cholesterol * multiplier).toFixed(2)),
                fiber: parseFloat(parseFloat(value.fiber * multiplier).toFixed(2)),
                iron: parseFloat(parseFloat(value.iron * multiplier).toFixed(2)),
                potassium: parseFloat(parseFloat(value.potassium * multiplier).toFixed(2)),
                protein: parseFloat(parseFloat(value.protein * multiplier).toFixed(2)),
                quantity: parseFloat(parseFloat(multiplier).toFixed(2)),
                sodium: parseFloat(parseFloat(value.sodium * multiplier).toFixed(2)),
                sugar: parseFloat(parseFloat(value.sugar * multiplier).toFixed(2)),
                total_carbohydrates: parseFloat(parseFloat(value.total_carbohydrates * multiplier).toFixed(2)),
                total_fat: parseFloat(parseFloat(value.total_fat * multiplier).toFixed(2)),
                type: value.type,
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
