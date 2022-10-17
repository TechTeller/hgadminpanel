import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// TODO Get the data of the messages and show it in the parentAdmin
export interface columnProps {
  fieldName: string,
  headerName: string,
}

export interface ParentAdminProps {
  title: string,
  columnProps: columnProps[],
}

const constructColumns = (columnData: columnProps[]) => {
  const colDef: GridColDef[] = [];
  for (let item of columnData) {
    colDef.push({
      field: item.fieldName,
      headerName: item.headerName,
      width: 150,
    });
  };
  return colDef
}

const ParentAdmin = (props: ParentAdminProps) => {
  const { columnProps, title } = props;
  return (
    <div className="container">
      <h3 className="py-4">{title}</h3>
      <DataGrid className="mx-auto" columns={constructColumns(columnProps)} rows={[]} />
    </div>
  );
}
export default ParentAdmin;
