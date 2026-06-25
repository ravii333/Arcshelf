import {
  Box,
  Typography,
  Button,
  Paper,
  FormHelperText,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const FileUpload = ({
  label,
  name,
  file,
  onChange,
  error,
  accept = ".pdf,.png,.jpg,.jpeg,.gif",
}) => {
  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          textAlign: "center",
          border: "2px dashed",
          borderColor: error
            ? "error.main"
            : file
            ? "success.main"
            : "grey.300",
          bgcolor: error
            ? "error.light"
            : file
            ? "success.light"
            : "grey.50",
          "&:hover": {
            borderColor: error ? "error.main" : "primary.main",
            bgcolor: error ? "error.light" : "primary.light",
          },
          transition: "all 0.3s",
        }}
      >
        {file ? (
          <CheckCircleIcon
            sx={{ fontSize: 64, color: "success.main", mb: 2 }}
          />
        ) : (
          <CloudUploadIcon
            sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
          />
        )}

        <Box sx={{ mt: 2 }}>
          <Button
            component="label"
            variant="contained"
            startIcon={file ? <CheckCircleIcon /> : <CloudUploadIcon />}
            sx={{
              bgcolor: "#16a34a",
              "&:hover": {
                bgcolor: "#128c43",
                transform: "scale(1.05)",
              },
            }}
          >
            {file ? "Change File" : "Upload a file"}
            <input
              id={name}
              name={name}
              type="file"
              hidden
              onChange={onChange}
              accept={accept}
            />
          </Button>
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            or drag and drop
          </Typography>
          <Typography variant="caption" sx={{ mt: 1, color: "text.secondary" }}>
            PDF, PNG, JPG, GIF up to 10MB
          </Typography>
        </Box>

        {file && (
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "success.main",
            }}
          >
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: "success.dark", display: "flex", alignItems: "center", gap: 1 }}
            >
              <CheckCircleIcon fontSize="small" />
              Selected: {file.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Paper>
        )}

        {error && (
          <FormHelperText error sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
            <ErrorOutlineIcon fontSize="small" />
            {error}
          </FormHelperText>
        )}
      </Paper>
    </Box>
  );
};
