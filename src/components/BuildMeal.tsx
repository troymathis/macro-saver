"use client";

import { FC, useState, FormEvent } from "react";
import { toast } from "./ui/Toast";
import { Input } from "./ui/Input";
import Paragraph from "./ui/Paragraph";
import { Food } from "@prisma/client";
import { Autocomplete, Chip, Stack, TextField } from "@mui/material";
import { useTheme, ThemeProvider } from "next-themes";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";

interface BuildMealProps {
  food: Food[];
  userId: string;
}

const BuildMeal: FC<BuildMealProps> = ({ food, userId }) => {

  const [meal, setMeal] = useState<object>({
    name: "",
    userId: userId,
    flag: "",
    AteAt: "",
    foodItems: {},
    createdAt: "",
  });

  const [foodNames, setFoodNames] = useState([]);
  const [foodObjects, setfoodObjects] = useState([]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    if (foodNames.includes(fieldName)) {
      let filteredItem = food.find((e) => e.name == fieldName);
      filteredItem["newQuan"] = fieldValue;
      setMeal((prevState) => ({
        ...prevState,
        foodItems: { ...prevState.foodItems, [fieldName]: filteredItem },
      }));
    } else {
      setMeal((prevState) => ({
        ...prevState,
        [fieldName]: fieldValue,
      }));
    }
  };

  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meal),
      });
      if (response.status !== 200) {
        toast({
          title: "Error",
          message: "Something went wrong...",
          type: "error",
        })
      }
       else {
        toast({
          title: "Success",
          message: "Meal successfully created!",
          type: "success",
      })
      router.push("/dashboard")
    }} catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Error",
          message: err.message,
          type: "error",
        });

        return;
      }
      toast({
        title: "Error",
        message: "Something went wrong.",
        type: "error",
      });
    }
  };

  const options: [] = [];
  food.map((item) => {
    options.push(item.name);
  });

  const foodAutoComplete = () => {
    const removeFromMeal = (option) => {
      const diffArr = foodNames.filter((o) => !option.includes(o));
      setMeal((prevState) => {
        const newData = {
          ...prevState,
          foodItems: { ...prevState.foodItems },
        };
        delete newData.foodItems[diffArr[0]];
        return newData;
      });
      setFoodNames(option);
    };
    return (
      <>
        <Stack spacing={3} sx={{ width: 700 }}>
          <Autocomplete
            disablePortal
            multiple
            id="tags-standard"
            options={options}
            onChange={(event, value, reason, option) => {
              if (reason === "selectOption") {
                setFoodNames(value);
              } else if (reason === "removeOption") {
                removeFromMeal(value);
              }
            }}
            filterSelectedOptions
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  variant="outlined"
                  label={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Ingredients"
                name="foodItems"
                placeholder="What's in it?"
              />
            )}
          />
        </Stack>

        <div className="flex flex-col gap-4 mt-4">
          {foodNames.map((name) => (
            <div className="flex gap-4">
              <Paragraph>{name}:</Paragraph>
              <Input
                className="w-20"
                type="number"
                min="1"
                name={name}
                onChange={handleInput}
              />
              <Paragraph>grams</Paragraph>
            </div>
          ))}
        </div>
        </>
    );
  };

  return (
    <div className="container">
      <div className="flex flex-col gap-6 items-center">
        <form
          className="mt-6 sm:flex sm:items-center flex flex-col gap-12"
          onSubmit={handleSubmit}
          action="#"
          method="POST"
        >
          <div className="flex flex-row gap-2 items-center">
            <Paragraph>Name:</Paragraph>
            <Input type="text" name="name" onChange={handleInput} />
          </div>
          <div className="flex flex-row gap-8 border border-lime-300 p-4 bg-lime-200 dark:bg-lime-900 rounded-md shadow-md">
            <div className="flex flex-col items-center">
              <Paragraph>Snack</Paragraph>
              <Input
                type="radio"
                className="appearance-none checked:bg-lime-500 rounded-full w-10 checked:transition-all"
                name="flag"
                value="Snack"
                onChange={handleInput}
                id="Snack"
              />
            </div>
            <div className="flex flex-col items-center">
              <Paragraph>Breakfast</Paragraph>
              <Input
                type="radio"
                name="flag"
                className="appearance-none checked:bg-lime-500 rounded-full w-10 checked:transition-all"
                value="Breakfast"
                onChange={handleInput}
                id="Breakfast"
              />
            </div>
            <div className="flex flex-col items-center">
              <Paragraph>Lunch</Paragraph>
              <Input
                type="radio"
                name="flag"
                className="appearance-none checked:bg-lime-500 rounded-full w-10 checked:transition-all"
                value="Lunch"
                onChange={handleInput}
                id="Lunch"
              />
            </div>
            <div className="flex flex-col items-center">
              <Paragraph>Dinner</Paragraph>
              <Input
                type="radio"
                name="flag"
                className="appearance-none checked:bg-lime-500 rounded-full w-10 checked:transition-all"
                value="Dinner"
                onChange={handleInput}
                id="Dinner"
              />
            </div>
          </div>
          <div>
            <Paragraph>Ate at:</Paragraph>
            <Input type="datetime-local" name="AteAt" onChange={handleInput} />
          </div>
          {foodAutoComplete()}
          <Button type="submit">Create Meal</Button>
        </form>
      </div>
    </div>
  );
};

export default BuildMeal;
