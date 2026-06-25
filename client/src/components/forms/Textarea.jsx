import { TextField } from "@mui/material";

export const Textarea = ({ label, name, error, rows = 4, ...props }) => (
  <TextField
    id={name}
    name={name}
    label={label}
    fullWidth
    multiline
    rows={rows}
    error={!!error}
    helperText={error}
    variant="outlined"
    {...props}
  />
);
