import { Box, Paper, Typography, Button, Avatar } from "@mui/material";

export default function EmptyState({ icon, title, description, action }) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: { xs: 4, md: 8 },
        border: "1px dashed",
        borderColor: "neutral.300",
        borderRadius: 4,
        bgcolor: "neutral.0",
        maxWidth: 580,
        mx: "auto",
      }}
    >
      {icon && (
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: "primary.50",
            color: "primary.main",
            mb: 3,
            '& svg': { fontSize: 32 }
          }}
        >
          {icon}
        </Avatar>
      )}

      {title && (
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: "text.primary" }}>
          {title}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 360, lineHeight: 1.6 }}>
          {description}
        </Typography>
      )}

      {action && (
        <Button
          variant={action.variant || "contained"}
          color={action.color || "primary"}
          onClick={action.onClick}
          component={action.component}
          to={action.to}
          href={action.href}
          startIcon={action.startIcon}
          endIcon={action.endIcon}
          sx={action.sx}
        >
          {action.text}
        </Button>
      )}
    </Paper>
  );
}
