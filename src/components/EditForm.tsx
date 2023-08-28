// eslint-disable-next-line
//@ts-nocheck

"use client";

import { Autocomplete, Chip, Stack, TextField } from "@mui/material";
import { Food, Meal } from "@prisma/client";
import React, { FC, FormEvent, useEffect, useState } from "react";
import Paragraph from "./ui/Paragraph";
import { Input } from "./ui/Input";
import { toast } from "./ui/Toast";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";
import { Trash2 } from "lucide-react";
import LargeHeading from "./ui/LargeHeading";
import { cn } from "@/lib/utils";

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

  const [deleteClicked, setDeleteClicked] = useState<boolean>(false);
  const [flagged, setFlagged] = useState<any | null>(undefined);

  useEffect(() => {
    setFlagged(meal.flag);
  },[meal.flag]);

  const flags = ["Snack", "Breakfast", "Lunch", "Dinner"];

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    const foodNames = Object.keys(mealState.foodItems);
    if (foodNames.includes(fieldName)) {
      let filteredItem = food.find((e) => e.name == fieldName);
      filteredItem["quantity"] = parseFloat(fieldValue);
      setMealState((prevState) => ({
        ...prevState,
        foodItems: { ...prevState.foodItems, [fieldName]: filteredItem },
      }));
    } else {
      setMealState((prevState) => ({
        ...prevState,
        [fieldName]: fieldValue,
      }));
    }
    console.log(mealState);
  };

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!mealState.name || !mealState.flag) {
      toast({
        title: "Error",
        message: "Please fill out the required fields",
        type: "error",
      });
      return
    }
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
        });
      } else {
        toast({
          title: "Success",
          message: "Meal successfully updated!",
          type: "success",
        });
        router.push(`/meal/${meal.id}`);
      }
    } catch (err) {
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

  const handleDelete = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/delete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meal),
      });
      if (response.status !== 200) {
        toast({
          title: "Error",
          message: "Something went wrong...",
          type: "error",
        });
      } else {
        toast({
          title: "Success",
          message: "Meal successfully deleted!",
          type: "success",
        });
        router.push(`/dashboard`);
      }
    } catch (err) {
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
          foodItems: { ...prevState.foodItems },
        };
        food.map((item) => {
          if (item.name == option) {
            newData.foodItems[option] = item;
          }
        });
        return newData;
      });
    };
    return (
      <React.Fragment key="atcmplt">
        <Stack
          spacing={3}
          sx={{ width: 300 }}
          className=" dark:bg-lime-900 rounded-md"
        >
          <Autocomplete
            disablePortal
            multiple
            value={Object.keys(mealState.foodItems)}
            id="tags-standard"
            options={options}
            onChange={(event, value, reason, option) => {
              if (reason === "selectOption") {
                addToMeal(option.option);
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
                  className="bg-lime-500 mr-3"
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
                name="foodItems"
                placeholder="What's in it?"
              />
            )}
          />
        </Stack>

        <div className="flex flex-col gap-4 mt-4">
          {Object.keys(mealState.foodItems).map((name, i) => (
            <div className="flex gap-4" key={i}>
              <Paragraph>{name}:</Paragraph>
              <Input
                key={name}
                className="w-20"
                type="number"
                min="1"
                value={mealState.foodItems[name].quantity}
                name={name}
                onChange={handleInput}
              />
              <Paragraph>grams</Paragraph>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  };

  const flagRadio = () => {
    return flags.map((flag, i) => (
      <div className="flex flex-col items-center" key={i}>
        <Paragraph>{flag}</Paragraph>
        <Input
          type="radio"
          className="appearance-none checked:bg-lime-500 rounded-full w-10 checked:transition-all"
          name="flag"
          value={flag}
          onChange={handleInput}
          defaultChecked={flag == flagged}
        />
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="flex flex-col gap-6 items-center">
        <form
          className="mt-6 items-center flex flex-col gap-12"
          onSubmit={handleSubmit}
          action="#"
          method="PUT"
        >
          <div className="flex flex-row gap-2 items-center">
            <Paragraph>Name:</Paragraph>
            <Input
              type="text"
              name="name"
              onChange={handleInput}
              value={mealState.name}
            />
          </div>
          <div className="flex flex-row gap-8 border border-lime-300 p-4 bg-lime-200 dark:bg-lime-900 rounded-md shadow-md">
            {flagRadio()}
          </div>
          <div>
            <Paragraph>Ate at:</Paragraph>
            <Input
              type="datetime-local"
              name="AteAt"
              onChange={handleInput}
              defaultValue={
                new Date(meal.AteAt.toString().split("GMT")[0] + " UTC")
                  .toISOString()
                  .split(".")[0]
              }
            />
          </div>
          {foodAutoComplete()}
          <div className="flex flex-row gap-4">
            <Button type="submit">Update Meal</Button>
          </div>
        </form>
        <button className="rounded-md bg-red-500 hover:bg-red-400 p-2 max-w-fit" onClick={() => setDeleteClicked(true)}>
          <Trash2 />
        </button>
        {deleteClicked ? (
          <div
            className={cn(
              "flex flex-col gap-4 absolute bg-gradient-to-b from-white to-transparent w-full items-center h-5/6 rounded-md pt-12",
              "dark:from-slate-900"
            )}
          >
            <LargeHeading size="sm">
              Are you sure you&apos;d like to delete this meal?
            </LargeHeading>
            <br />
            <Button onClick={(e: any) => handleDelete(e)}>Yes</Button>
            <Button onClick={() => setDeleteClicked(false)}>Go back</Button>
          </div>
        ): null}
      </div>
    </div>
  );
};

export default EditForm;
