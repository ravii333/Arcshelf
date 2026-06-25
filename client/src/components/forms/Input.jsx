import { TextField } from "@mui/material";

export const Input = ({ label, name, error, ...props }) => (
  <TextField
    id={name}
    name={name}
    label={label}
    fullWidth
    error={!!error}
    helperText={error}
    variant="outlined"
    {...props}
  />
);
