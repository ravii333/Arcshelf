import { Chip } from "@mui/material";

export default function PaperBadge({ label, size = "small", sx }) {
  const getColors = (type = "") => {
    const formattedType = type.toLowerCase().trim();
    if (formattedType.includes("mid")) {
      return {
        bgcolor: "rgba(245, 158, 11, 0.08)", // accent.amber / warning
        color: "#b45309", // warning.dark
        borderColor: "rgba(245, 158, 11, 0.25)",
      };
    } else if (formattedType.includes("final")) {
      return {
        bgcolor: "rgba(5, 150, 105, 0.08)", // primary.600
        color: "#047857", // primary.700
        borderColor: "rgba(5, 150, 105, 0.25)",
      };
    } else if (formattedType.includes("quiz")) {
      return {
        bgcolor: "rgba(59, 130, 246, 0.08)", // accent.blue
        color: "#1d4ed8", // info.dark
        borderColor: "rgba(59, 130, 246, 0.25)",
      };
    } else {
      // Assignment / Other
      return {
        bgcolor: "rgba(139, 92, 246, 0.08)", // accent.purple
        color: "#6d28d9", // purple dark
        borderColor: "rgba(139, 92, 246, 0.25)",
      };
    }
  };

  const badgeColors = getColors(label);

  return (
    <Chip
      label={label}
      size={size}
      variant="outlined"
      sx={{
        borderRadius: 1.5,
        fontWeight: 600,
        fontSize: size === "small" ? "0.6875rem" : "0.75rem",
        height: size === "small" ? 20 : 26,
        bgcolor: badgeColors.bgcolor,
        color: badgeColors.color,
        borderColor: badgeColors.borderColor,
        borderWidth: "1px",
        '& .MuiChip-label': { px: 1 },
        ...sx,
      }}
    />
  );
}
