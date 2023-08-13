"use client"
import { Food, Meal } from "@prisma/client";
import { FC, useState } from "react";


interface EditFormProps {
  meal: Meal;
  userId: string
}

const EditForm: FC<EditFormProps> = ({ meal, userId }) => {
  const food = meal.foodItems;
  const [mealState, setMealState] = useState<object>({
    name: meal.name,
    userId: userId,
    flag: meal.flag,
    AteAt: meal.AteAt,
    foodItems: food,
    createdAt: meal.createdAt,
  });
  
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setMealState((prevState) => ({
        ...prevState,
        [fieldName]: fieldValue,
    }));
  }

  

  return <div>EditForm</div>;
};

export default EditForm;
