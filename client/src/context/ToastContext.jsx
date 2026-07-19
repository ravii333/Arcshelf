import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Snackbar, Alert } from "@mui/material";

const ToastContext = createContext(null);

// Per-severity theming, matching the app's emerald brand.
const STYLES = {
  success: {
    borderColor: "#86efac",
    bgcolor: "#f0fdf4",
    color: "#047857",
    iconColor: "#059669",
  },
  error: {
    borderColor: "#fca5a5",
    bgcolor: "#fef2f2",
    color: "#b91c1c",
    iconColor: "#ef4444",
  },
  info: {
    borderColor: "#93c5fd",
    bgcolor: "#eff6ff",
    color: "#1d4ed8",
    iconColor: "#3b82f6",
  },
};

/**
 * App-wide toast notifications. Mount once near the root (above the router so
 * toasts survive navigation), then call `const toast = useToast()` anywhere and
 * use `toast.success(msg)`, `toast.error(msg)`, or `toast.info(msg)`.
 */
export function ToastProvider({ children }) {
  const [state, setState] = useState({ open: false, message: "", severity: "success" });

  const show = useCallback((message, severity) => {
    setState({ open: true, message, severity });
  }, []);

  const handleClose = useCallback((_e, reason) => {
    if (reason === "clickaway") return;
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const toast = useMemo(
    () => ({
      success: (message) => show(message, "success"),
      error: (message) => show(message, "error"),
      info: (message) => show(message, "info"),
    }),
    [show]
  );

  const style = STYLES[state.severity] || STYLES.info;

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={state.severity}
          variant="standard"
          sx={{
            width: "100%",
            borderRadius: "10px",
            fontWeight: 500,
            boxShadow: 4,
            border: "1px solid",
            borderColor: style.borderColor,
            bgcolor: style.bgcolor,
            color: style.color,
            "& .MuiAlert-icon": { color: style.iconColor },
          }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
