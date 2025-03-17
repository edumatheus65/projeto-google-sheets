"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SheetData } from "../../_lib/googleSheetsService";
// import { StatusBadge } from "./status-badge";

export const columns: ColumnDef<SheetData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "quantity",
    header: "QTD",
  },
  {
    accessorKey: "uniPrice",
    header: "VALOR UNIT",
  },
  {
    accessorKey: "totalPrice",
    header: "VALOR",
  },
  {
    accessorKey: "orderDate",
    header: "DATA DO PEDIDO",
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
];
