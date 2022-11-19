import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiSvgIcon: {
      defaultProps: {
        htmlColor: "#f1f5f9",
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: "filled",
      },
      styleOverrides: {
        root: {
          backgroundColor: "#334155",
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          color: "#f1f5f9",
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
      styleOverrides: {
        root: {
          color: "#f1f5f9",
        },
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        disablePortal: true,
      },
    },
  },
});

export default theme;
