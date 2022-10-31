import React from "react"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import Link, { LinkProps } from "next/link"

// TODO Get the data of the messages and show it in the parentAdmin
export interface ColumnProps {
  fieldName: string,
  headerName: string,
}

export interface ListAdminProps {
  title: string,
  slug: string
  columnProps: ColumnProps[],
  rows: any[],
  link: LinkProps,
}

const constructColumns = (columnData: ColumnProps[], slug: string) => {
  const colDef: GridColDef[] = []
  let firstItem = true;
  for (let item of columnData) {
    const { fieldName, headerName } = item
    let col: any = {
      field: fieldName,
      headerName,
    }
    if (firstItem) {
      const renderCell = (params: GridRenderCellParams) => {
        return <Link href={`/${slug}/${params.value}`}>{params.value}</Link>
      }
      col = { ...col, renderCell }
    }
    colDef.push(col)
  }
  return colDef
}

const EmbedListAdmin = (props: ListAdminProps) => {
  const { columnProps, rows, slug, title } = props;
  const columns = constructColumns(columnProps, slug)
  return (
    <div className="container">
      <h3 className="py-4">{title}</h3>
      <DataGrid className="mx-auto" columns={columns} rows={rows} pageSize={20} pagination checkboxSelection />
    </div>
  )
}

export default EmbedListAdmin
