import { Card, CardContent, Box, Skeleton, Divider } from "@mui/material";

export default function LoadingCard() {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pointerEvents: "none",
        border: "1px solid",
        borderColor: "neutral.200",
        borderRadius: '16px',
        boxShadow: "none",
        bgcolor: "neutral.0",
        '&:hover': {
          transform: "none",
          boxShadow: "none",
        }
      }}
    >
      {/* Thumbnail Skeleton */}
      <Skeleton
        variant="rectangular"
        height={150}
        animation="wave"
        sx={{
          bgcolor: "neutral.100",
        }}
      />

      <CardContent sx={{ p: "14px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title */}
        <Skeleton
          variant="text"
          width="85%"
          height={20}
          animation="wave"
          sx={{ mb: 1, bgcolor: "neutral.100" }}
        />
        <Skeleton
          variant="text"
          width="50%"
          height={16}
          animation="wave"
          sx={{ mb: 2, bgcolor: "neutral.100" }}
        />

        <Divider sx={{ my: 1, borderColor: "neutral.100" }} />

        {/* Footer row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto", pt: 0.5 }}>
          <Skeleton
            variant="rectangular"
            width={70}
            height={16}
            animation="wave"
            sx={{ borderRadius: 1, bgcolor: "neutral.100" }}
          />
          <Skeleton
            variant="rectangular"
            width={40}
            height={16}
            animation="wave"
            sx={{ borderRadius: 1, bgcolor: "neutral.100" }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
