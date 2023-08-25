import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method == "PUT") {
      // creating a new meal
      return await deleteMeal(req, res);
    } else {
      return res
        .status(405)
        .json({ message: "Method not allowed", success: false });
    }
  }

async function deleteMeal(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body;
    try {
      const result = await db.meal.delete({
        where: {
          id: body.id,
        },
      });
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues, result: null });
      }
      return res.status(500).json({
        error: "Internal Server Error",
        result: null,
      });
    }
  }