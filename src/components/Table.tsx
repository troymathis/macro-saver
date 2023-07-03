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
  { field: "col2", headerName: "Flag", width: 250 },
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

interface TableProps {
  meals: Meal[];
}

const Table: FC<TableProps> = ({ meals }) => {
  const { theme: applicationTheme } = useTheme();

  const theme = createTheme({
    palette: {
      mode: applicationTheme === "light" ? "light" : "dark",
    },
  });

  const rows = meals.map((req) => {
    // @ts-expect-error Server Componen
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

  const handleEvent: GridEventListener<'rowClick'> = (
    params, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details, // GridCallbackDetails
  ) => {
    event.preventDefault()

  };


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

export default Table;
