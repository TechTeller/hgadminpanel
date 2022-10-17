import * as React from "react";
import { Box, FormControl, OutlinedInput, useFormControl } from "@mui/material"

export interface ChildAdminProps {
  title: string,
};

const ChildAdmin = (props: ChildAdminProps) => {
  const { title } = props;
  return (
    <Box>
      <h3>{title}</h3>
    </Box>
  );
}

export default ChildAdmin;
