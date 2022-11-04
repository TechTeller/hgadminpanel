import { TextField } from "@mui/material"

interface Props {
  label: string,
  multiline?: boolean,
  rows?: number,
  value: string
}

const StyledTextField = (props: Props) => {
  const { label, multiline, rows, value } = props;
  return (
    <TextField
      id="filled-multiline-static"
      label={label}
      value={value}
      variant="filled"
      sx={{
        backgroundColor: '#334155',
        color: '#f1f5f9',
        '& #filled-multiline-static': {
          color: '#f1f5f9',
        },
        '& #filled-multiline-static-label': {
          color: '#f1f5f9',
        },
      }}
      multiline={multiline ?? false}
      rows={rows ?? 4}
    />
  )
}

export default StyledTextField
