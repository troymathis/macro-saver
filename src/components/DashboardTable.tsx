// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

"use client";

import { Food, Meal } from "@prisma/client";
import { Chip, ThemeProvider, createTheme } from "@mui/material";
import {
  GridColumnHeaderParams,
  type GridColDef,
  DataGrid,
} from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import { FC, FormEvent } from "react";
import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import { useRouter } from "next/navigation";
import Paragraph from "./ui/Paragraph";
import { cn } from "@/lib/utils";

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
            <Paragraph className={cn("text-black italic items-center pt-2", "dark:text-white")}>{params.value}</Paragraph>
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
            <Chip variant="filled"
            style={{ backgroundColor: params.value === "Snack" ? 'orange': params.value === "Dinner" ? "violet" : params.value === "Breakfast" ? 'cornflowerblue' : params.value === "Lunch" ? 'green' : null}}
            label={params.value}
            key={params.value}></Chip>
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
  const router = useRouter()

  const rowClick = (proxy, event) => {
    router.push(`/meal/${proxy.id}`)
    // how to get the resource id??
}


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
        className="hover:cursor-pointer"
        onRowClick={rowClick}
        disableRowSelectionOnClick
        disableColumnSelector
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
