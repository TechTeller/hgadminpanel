import React from "react";
import Button from "@mui/material/Button";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";

export interface ColumnProps {
  fieldName: string;
  headerName: string;
}

export interface AdminListProps {
  columnProps: ColumnProps[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData: any[];
  slug: string;
  title: string;
}

const constructColumns = (columnData: ColumnProps[], slug: string) => {
  const colDef: GridColDef[] = [];
  let firstItem = true;
  for (const item of columnData) {
    const { fieldName, headerName } = item;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let col: any = {
      field: fieldName,
      headerName,
      flex: 1,
    };
    if (firstItem) {
      const renderCell = (params: GridRenderCellParams) => {
        return (
          <Link
            href={`/${slug}/${params.row.id}`}
            className="w-full hover:bg-slate-400"
          >
            {params.value ?? ""}
          </Link>
        );
      };
      const cellClassName = "hover:bg-slate-300 hover:text-sky-600";
      col = { ...col, renderCell, cellClassName };
      firstItem = false;
    }
    colDef.push(col);
  }
  return colDef;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const constructRows = (columnData: ColumnProps[], rowsData: any[]) => {
  const rows = [];
  console.log("raw data", rowsData);
  for (const data of rowsData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row: any = { id: data.id };
    for (const item of columnData) {
      const { fieldName } = item;
      row[fieldName] = data[fieldName] ?? "";
    }
    rows.push(row);
  }
  console.log("processed data", rows);
  return rows;
};

const AdminList = (props: AdminListProps) => {
  const { columnProps, rowData, slug, title } = props;
  const columns = constructColumns(columnProps, slug);
  const rows = constructRows(columnProps, rowData);
  return (
    <>
      <div className="flex w-full items-center justify-between p-4">
        <Link href="/">{"< Back to main page"}</Link>
        <Button size="large" variant="contained" href={`/${slug}/new`}>
          Add New +
        </Button>
      </div>
      <div className="container px-4">
        <h2 className="py-4 text-xl">{title}</h2>
        <DataGrid
          className="mx-auto"
          columns={columns}
          rows={rows}
          autoHeight
          pageSize={20}
          rowsPerPageOptions={[20]}
          pagination
          checkboxSelection
          sx={{
            backgroundColor: "#334155",
            color: "#f1f5f9",
            "& .MuiTablePagination-root": {
              color: "#f1f5f9",
            },
          }}
        />
      </div>
    </>
  );
};

export default AdminList;
