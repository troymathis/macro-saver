"use client";

import { Food, Meal } from "@prisma/client";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  GridColumnHeaderParams,
  type GridColDef,
  DataGrid,
  GridEventListener,
} from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import { FC, FormEvent } from "react";
import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import { redirect } from "next/navigation";

const columnsDraft: GridColDef[] = [
  {
    field: "col1",
    headerName: "Meal",
    width: 400,
    renderHeader(params) {
      return (
        <strong className="font-semibold">{params.colDef.headerName} 🍱</strong>
      );
    },
    renderCell(params) {
        return (
            <Link className={buttonVariants({ variant: "ghost" })} href={`/meal/${params.id}`} >{params.value}</Link>
        )
    },
  },
  {
    field: "col2",
    headerName: "Flag",
    width: 200,
    renderHeader(params) {
      return (
        <strong className="font-semibold">{params.colDef.headerName} 🍱</strong>
      );
    },
    renderCell(params) {
        return (
            <strong className={(params.value == "Snack" ? "bg-orange-500 p-1 rounded" : params.value == "Breakfast" ? "bg-lime-500 p-1 rounded" : params.value == "Lunch" ? "bg-sky-500 p-1 rounded" : params.value == "Dinner" ? "bg-purple-500" : 'text-opacity-0')}>{params.value}</strong>
        )
    },
  },
  { field: "col3", headerName: "What's in it?", width: 300 },
  { field: "col4", headerName: "Ate at", width: 250 },
];

const columns = columnsDraft.map((col) => {
  if (col.field === "col1") {
    return col;
  }

  return {
    ...col,
    renderHeader(params: GridColumnHeaderParams<any, any, any>) {
      return (
        <strong className="font-semibold">{params.colDef.headerName}</strong>
      );
    },
  };
});

interface DashboardTableProps {
  meals: Meal[];
}

const DashboardTable: FC<DashboardTableProps> = ({ meals }) => {
  const { theme: applicationTheme } = useTheme();

  const theme = createTheme({
    palette: {
      mode: applicationTheme === "light" ? "light" : "dark",
    },
  });

  const rows = meals.map((req) => {
    // @ts-expect-error Server Component
    const food = req.foodItems;
    const foodInEach = food.map((item: { name: any }) => {
      return ` ${item.name}`;
    });
    return {
      id: req.id,
      col1: req.name,
      col2: req.flag,
      col4: req.AteAt,
      col3: foodInEach,
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
        pageSizeOptions={[5]}
        autoHeight
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        columns={columns}
        rows={rows}
      />
    </ThemeProvider>
  );
};

export default DashboardTable;
