import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Button, Tooltip, CircularProgress } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useSavedPapers } from "../../context/SavedPapersContext";

/**
 * Save / wishlist toggle for a paper. Works for logged-out users too:
 * clicking while logged out redirects to /login.
 *
 * variant="icon" (default) renders a compact icon button (for cards).
 * variant="button" renders a labelled button (for the detail page header).
 */
export default function SaveButton({ paperId, variant = "icon", onNotify, sx }) {
  const { isSaved, toggleSave } = useSavedPapers();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const loggedIn = Boolean(localStorage.getItem("profile"));
  const saved = isSaved(paperId);

  const handleClick = async (e) => {
    // cards wrap the whole surface in a Link — don't navigate when saving
    e.preventDefault();
    e.stopPropagation();

    if (!loggedIn) {
      navigate("/login");
      return;
    }
    if (busy) return;

    setBusy(true);
    try {
      const nowSaved = await toggleSave(paperId);
      onNotify?.(nowSaved ? "Saved to your wishlist." : "Removed from your wishlist.", "success");
    } catch {
      onNotify?.("Couldn't update saved papers. Try again.", "error");
    } finally {
      setBusy(false);
    }
  };

  const label = saved ? "Remove from saved" : "Save for later";

  if (variant === "button") {
    return (
      <Button
        onClick={handleClick}
        disabled={busy}
        variant={saved ? "contained" : "outlined"}
        startIcon={
          busy ? (
            <CircularProgress size={16} color="inherit" />
          ) : saved ? (
            <BookmarkIcon />
          ) : (
            <BookmarkBorderIcon />
          )
        }
        sx={{
          fontWeight: 700,
          borderRadius: "10px",
          flexShrink: 0,
          px: 3,
          py: 1.25,
          ...(saved
            ? { bgcolor: "#ffffff", color: "primary.700", "&:hover": { bgcolor: "neutral.50" } }
            : {
                color: "#ffffff",
                borderColor: "rgba(255,255,255,0.6)",
                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
              }),
          ...sx,
        }}
      >
        {saved ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <Tooltip title={loggedIn ? label : "Log in to save"} arrow>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-label={label}
        sx={{
          bgcolor: "rgba(255,255,255,0.9)",
          color: saved ? "primary.600" : "neutral.500",
          "&:hover": { bgcolor: "#ffffff", color: "primary.700" },
          ...sx,
        }}
      >
        {busy ? (
          <CircularProgress size={16} color="inherit" />
        ) : saved ? (
          <BookmarkIcon fontSize="small" />
        ) : (
          <BookmarkBorderIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
