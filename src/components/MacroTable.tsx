// eslint-disable-next-line
//@ts-nocheck

"use client";

import { Food, FoodToMeal, Meal } from "@prisma/client";
import { ThemeProvider, createTheme } from "@mui/material";
import { Table } from "@nextui-org/react";
import {
  GridColumnHeaderParams,
  type GridColDef,
  DataGrid,
  GridEventListener,
} from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import { FC, FormEvent, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import Paragraph from "./ui/Paragraph";
import { toast } from "./ui/Toast";
import { Trash2 } from "lucide-react";

const columnsDraft: GridColDef[] = [
  { field: "col1", headerName: "Macro", width: 300 },
  { field: "col2", headerName: "Measurement", width: 250 },
];

const columns = columnsDraft.map((col) => {
  return {
    ...col,
    renderHeader(params: GridColumnHeaderParams<any, any, any>) {
      return (
        <strong className="font-semibold">{params.colDef.headerName}</strong>
      );
    },
  };
});

interface MacroTableProps {
  meal: Meal;
}

const MacroTable: FC<MacroTableProps> = ({ meal }) => {
  const { theme: applicationTheme } = useTheme();
  // @ts-ignore
  const food = meal.foodItems;
  const theme = createTheme({
    palette: {
      mode: applicationTheme === "light" ? "light" : "dark",
    },
  });
  let adjCalo = 0;
  let adjFat = 0;
  let adjCalc = 0;
  let adjChol = 0;
  let adjFi = 0;
  let adjIr = 0;
  let adjPot = 0;
  let adjPro = 0;
  let adjSod = 0;
  let adjSug = 0;
  let adjCarb = 0;
  let adjServ = 0;

  food.forEach((item: Food) => {
    adjCalo += item.calories;
    adjFat += item.total_fat;
    adjCalc += item.calcium;
    adjChol += item.cholesterol;
    adjFi += item.fiber;
    adjIr += item.iron;
    adjPot += item.potassium;
    adjPro += item.protein;
    adjSod += item.sodium;
    adjSug += item.sugar;
    adjCarb += item.total_carbohydrates;
    adjServ += item.quantity;
  });

  const macroObject = {
    Fat: `${adjFat.toFixed(2)} g`,
    Calcium: `${adjCalc.toFixed(2)} mg`,
    Cholesterol: `${adjChol.toFixed(2)} mg`,
    Fiber: `${adjFi.toFixed(2)} g`,
    Iron: `${adjIr.toFixed(2)} mg`,
    Potassium: `${adjPot.toFixed(2)} mg`,
    Protein: `${adjPro.toFixed(2)} g`,
    Sodium: `${adjSod.toFixed(2)} mg`,
    Sugar: `${adjSug.toFixed(2)} g`,
    Carbohydrates: `${adjCarb.toFixed(2)} g`,
  };

  const rows = Object.keys(macroObject).map(function (key) {
    return {
      id: key,
      col1: key,
      // @ts-ignore
      col2: macroObject[key],
    };
  });
  

  return (
    <ThemeProvider theme={theme}>
      
      <DataGrid
        style={{
          backgroundColor:
            applicationTheme === "light" ? "whitesmoke" : "rgb(54 83 20)",
          fontSize: "1rem",
        }}
        pageSizeOptions={[12]}
        autoHeight
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 12,
            },
          },
        }}
        columns={columns}
        rows={rows}
      />
    </ThemeProvider>
  );
};

export default MacroTable;
