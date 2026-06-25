import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import useIntersection from "../../hooks/useIntersection";

export default function StatCard({ value, label, color }) {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersection({ triggerOnce: true, threshold: 0.1 });

  // Parse numeric part, e.g. "1K+" -> 1000, "98%" -> 98, "50+" -> 50
  const parseValue = (val) => {
    const cleanVal = String(val);
    const num = parseInt(cleanVal.replace(/[^0-9]/g, ""), 10) || 0;
    const suffix = cleanVal.replace(/[0-9]/g, "");
    
    if (cleanVal.includes("K")) {
      return { target: num * 1000, format: (c) => `${Math.floor(c / 1000)}K${suffix.replace('K', '')}` };
    }
    return { target: num, format: (c) => `${c}${suffix}` };
  };

  const { target, format } = parseValue(value);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.round(start + easeProgress * (target - start));
      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target]);

  return (
    <Box
      ref={ref}
      sx={{
        textAlign: "center",
        py: { xs: 1, md: 1.5 },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h1"
        align="center"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "2.25rem", md: "3.25rem" },
          color: color || "primary.main",
          lineHeight: 1,
          mb: 1.5,
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          textAlign: "center",
        }}
      >
        {format(count)}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{
          fontWeight: 600,
          letterSpacing: "0.02em",
          fontSize: "0.8125rem",
          textAlign: "center",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
