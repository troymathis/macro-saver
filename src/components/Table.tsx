"use client";

import { Food, Meal } from "@prisma/client";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  GridColumnHeaderParams,
  type GridColDef,
  DataGrid,
} from "@mui/x-data-grid";
import { useTheme } from "next-themes";
import { FC } from 'react'

interface TableProps {
  
}

const Table: FC<TableProps> = ({}) => {
  return <div>Table</div>
}

export default Table