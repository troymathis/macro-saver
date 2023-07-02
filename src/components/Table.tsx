"use client";

import { Food, Meal } from "@prisma/client";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  GridColumnHeaderParams,
  type GridColDef,
  DataGrid,
} from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import { FC } from "react";

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

  const rows = meals.map(
    (req) => {
        const food = req.foodItems
        const foodInEach = food.map((item: { name: any; }) => {
            return ` ${item.name}`
        })
      return {
        id: req.id,
        col1: req.name,
        col2: req.flag,
        col4: req.AteAt,
        col3: foodInEach,
      }
    }
  );

  return (
    <ThemeProvider theme={theme}>
      <DataGrid
        style={{
          backgroundColor:
            applicationTheme === "light" ? "whitesmoke" : "rgb(217 249 157)",
          fontSize: "1rem",
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
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
