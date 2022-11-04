import React from "react"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import Link from "next/link"

export interface ColumnProps {
  fieldName: string,
  headerName: string,
}

export interface AdminListProps {
  columnProps: ColumnProps[],
  rowData: any[],
  slug: string,
  title: string,
}

const constructColumns = (columnData: ColumnProps[], slug: string) => {
  const colDef: GridColDef[] = []
  let firstItem = true;
  for (let item of columnData) {
    const { fieldName, headerName } = item
    let col: any = {
      field: fieldName,
      headerName,
      flex: 1,
    }
    if (firstItem) {
      const renderCell = (params: GridRenderCellParams) => {
        return (
          <Link href={`/${slug}/${params.row.id}`} className="hover:bg-slate-400">
            {params.value}
          </Link>
        )
      }
      const cellClassName = "hover:bg-slate-300 hover:text-sky-600"
      col = { ...col, renderCell, cellClassName }
    }
    colDef.push(col)
  }
  return colDef
}

const constructRows = (columnData: ColumnProps[], rowsData: any[]) => {
  const rows: any[] = []
  console.log("raw data", rowsData)
  for (let data of rowsData) {
    let row: any = { id: data.id }
    for (let item of columnData) {
      const { fieldName } = item
      row[fieldName] = data[fieldName] ?? ""
    }
    rows.push(row)
  }
  console.log("processed data", rows)
  return rows
}

const AdminList = (props: AdminListProps) => {
  const { columnProps, rowData, slug, title } = props
  const columns = constructColumns(columnProps, slug)
  const rows = constructRows(columnProps, rowData)
  return (
    <>
      <div className="m-2 self-start text-sm">
        <Link href="/">{"< Back to main page"}</Link>
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
            backgroundColor: '#334155',
            color: '#f1f5f9',
            '& .MuiTablePagination-root': {
              color: '#f1f5f9',
            },
          }}
        />
      </div>
    </>
  )
}

export default AdminList
