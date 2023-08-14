"use client";
import { Autocomplete, Chip, Stack, TextField } from "@mui/material";
import { Food, Meal } from "@prisma/client";
import { useTheme } from "next-themes";
import { FC, FormEvent, useState } from "react";
import Paragraph from "./ui/Paragraph";
import { Input } from "./ui/Input";
import { toast } from "./ui/Toast";
import router from "next/router";

interface EditFormProps {
  meal: Meal;
  food: Food[];
  userId: string;
}

const EditForm: FC<EditFormProps> = ({ food, meal, userId }) => {
  const foodObj = meal.foodItems.reduce(function (obj, item) {
    obj[item.name] = item;
    return obj;
  }, {});
  const [mealState, setMealState] = useState<object>({
    id: meal.id,
    name: meal.name,
    userId: userId,
    flag: meal.flag,
    AteAt: meal.AteAt,
    foodItems: foodObj,
    createdAt: meal.createdAt,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    const foodNames = Object.keys(mealState.foodItems)
    if (foodNames.includes(fieldName)) {
        let filteredItem = food.find((e) => e.name == fieldName);
        filteredItem["newQuan"] = parseFloat(fieldValue);
        setMealState((prevState) => ({
            ...prevState,
            foodItems: { ...prevState.foodItems, [fieldName]: filteredItem },
        }))
    } else {
        setMealState((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue,
          }));
    }
    console.log(mealState)
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/meal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealState),
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
    const removeFromMeal = (option: string) => {
        setMealState((prevState) => {
            const newData = {
              ...prevState,
              foodItems: { ...prevState.foodItems },
            };
            delete newData.foodItems[option];
            return newData;
          });
    };
    const addToMeal = (option: string) => {
        setMealState((prevState) => {
            const newData = {
                ...prevState,
                foodItems: {...prevState.foodItems },
            };
            food.map((item) => {
                if (item.name == option) {
                    newData.foodItems[option] = item;
                }

            })
            return newData
        })
    }
    return (
      <>
        <Stack spacing={3} sx={{ width: 700 }}>
          <Autocomplete
            disablePortal
            multiple
            value={Object.keys(mealState.foodItems)}
            id="tags-standard"
            options={options}
            onChange={(event, value, reason, option) => {
              if (reason === "selectOption") {
                addToMeal(option.option)
              } else if (reason === "removeOption") {
                removeFromMeal(option.option);
              }
            }}
            filterSelectedOptions
            renderOption={(props, option) => {
                return (
                  <li {...props} key={option}>
                    {option}
                  </li>
                );
              }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  variant="outlined"
                  label={option}
                  key={option}
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
          {Object.keys(mealState.foodItems).map((name) => (
            <div className="flex gap-4">
              <Paragraph>{name}:</Paragraph>
              <Input
              key={name}
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

  return <div>{foodAutoComplete()}</div>;
};

export default EditForm;
