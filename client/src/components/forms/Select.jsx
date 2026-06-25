import React from "react";
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from "@mui/material";

export const Select = ({ label, name, children, error, ...props }) => {
  // Convert option elements to MenuItem if needed (for backward compatibility)
  const childrenArray = React.Children.toArray(children);
  const menuItems = childrenArray.map((child, index) => {
    // Check if it's an option element by checking the type name
    if (React.isValidElement(child) && child.type === 'option') {
      return (
        <MenuItem 
          key={child.props.value || index} 
          value={child.props.value || ''} 
          disabled={child.props.disabled}
        >
          {child.props.children}
        </MenuItem>
      );
    }
    // If it's already a MenuItem, return as is
    return child;
  });

  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <MuiSelect
        id={name}
        name={name}
        labelId={`${name}-label`}
        label={label}
        {...props}
      >
        {menuItems}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
