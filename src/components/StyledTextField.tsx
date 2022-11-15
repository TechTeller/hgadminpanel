import TextField, { TextFieldProps } from "@mui/material/TextField";

const StyledTextField = (props: TextFieldProps) => (
  <TextField
    fullWidth
    id="filled-input"
    variant="filled"
    InputLabelProps={{ shrink: true }}
    sx={{
      backgroundColor: "#334155",
      color: "#f1f5f9",
      "& #filled-input": {
        color: "#f1f5f9",
      },
      "& #filled-input-label": {
        color: "#f1f5f9",
      },
    }}
    {...props}
  />
);

export default StyledTextField;
