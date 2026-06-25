import { Box, Typography } from "@mui/material";

export default function SectionHeader({ overline, title, subtitle, align = "left", action }) {
  const isCentered = align === "center";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isCentered ? "column" : { xs: "column", md: "row" },
        justifyContent: isCentered ? "center" : "space-between",
        alignItems: isCentered ? "center" : { xs: "flex-start", md: "flex-end" },
        gap: 2,
        mb: { xs: 4, md: 6 },
        textAlign: align,
        width: "100%",
      }}
    >
      <Box sx={{ maxWidth: isCentered ? 720 : 640, mx: isCentered ? "auto" : 0 }}>
        {overline && (
          <Typography
            variant="overline"
            color="primary.main"
            sx={{
              display: "block",
              mb: 1,
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            {overline}
          </Typography>
        )}
        {title && (
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.5rem" },
              color: "text.primary",
              mb: subtitle ? 1.5 : 0,
            }}
          >
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {action && (
        <Box sx={{ flexShrink: 0, mt: isCentered ? 2 : { xs: 1, md: 0 } }}>
          {action}
        </Box>
      )}
    </Box>
  );
}
