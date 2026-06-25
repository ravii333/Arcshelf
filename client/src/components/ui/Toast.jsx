import { Snackbar, Alert } from "@mui/material";

export default function Toast({ open, message, severity = "success", onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          borderRadius: 2.5,
          fontWeight: 500,
          boxShadow: 4,
          border: '1px solid',
          borderColor: severity === 'success' ? '#86efac' : severity === 'error' ? '#fca5a5' : 'divider',
          bgcolor: severity === 'success' ? '#f0fdf4' : severity === 'error' ? '#fef2f2' : 'background.paper',
          color: severity === 'success' ? '#047857' : severity === 'error' ? '#b91c1c' : 'text.primary',
          '& .MuiAlert-icon': {
            color: severity === 'success' ? '#059669' : severity === 'error' ? '#ef4444' : 'inherit'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
