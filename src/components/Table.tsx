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
  {field: "col2", headerName: "Flag", width: 250},
  {field: "col3", headerName: "What's in it?", width: 300},
  {field: "col4", headerName: "Ate at", width: 250},
];

const columns = columnsDraft.map((col) => {
    if (col.field === 'col1') {
        return col;
    }
})

interface TableProps {}

const Table: FC<TableProps> = ({}) => {
  return <div>Table</div>;
};

export default Table;
