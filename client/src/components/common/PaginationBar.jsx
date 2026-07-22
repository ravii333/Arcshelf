import { Box, Pagination, Typography } from "@mui/material";

/**
 * Shared pagination footer used by Browse and the Dashboard lists.
 *
 * Renders a "Showing X–Y of Z" range on the left and the page control on the
 * right (stacked and centered on mobile). Hides itself when there is a single
 * page and nothing useful to say.
 */
function PaginationBar({
  page,
  count,
  total,
  perPage,
  onChange,
  label = "items",
  scrollToTop = true,
  sx,
}) {
  if (count <= 1) return null;

  const from = total ? (page - 1) * perPage + 1 : 0;
  const to = Math.min(page * perPage, total);

  const handleChange = (event, value) => {
    onChange(event, value);
    if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mt: 5,
        pt: 3,
        borderTop: "1px solid",
        borderColor: "neutral.200",
        ...sx,
      }}
    >
      <Typography variant="body2" sx={{ color: "neutral.500", fontWeight: 500 }}>
        Showing <Box component="span" sx={{ fontWeight: 700, color: "neutral.700" }}>{from}–{to}</Box> of{" "}
        <Box component="span" sx={{ fontWeight: 700, color: "neutral.700" }}>{total}</Box> {label}
      </Typography>

      <Pagination
        count={count}
        page={page}
        onChange={handleChange}
        shape="rounded"
        siblingCount={1}
        boundaryCount={1}
        sx={{
          "& .MuiPagination-ul": { flexWrap: "nowrap" },
          "& .MuiPaginationItem-root": {
            fontWeight: 600,
            color: "neutral.700",
            borderRadius: "10px",
            minWidth: 36,
            height: 36,
            border: "1px solid",
            borderColor: "neutral.200",
            transition: "all 150ms ease",
          },
          "& .MuiPaginationItem-ellipsis": {
            border: "none",
            lineHeight: "36px",
          },
          "& .MuiPaginationItem-root:hover:not(.Mui-selected)": {
            bgcolor: "primary.50",
            color: "primary.700",
            borderColor: "primary.200",
          },
          "& .MuiPaginationItem-root.Mui-selected": {
            backgroundImage: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            color: "white",
            borderColor: "transparent",
            boxShadow: "0 4px 12px rgba(5, 150, 105, 0.25)",
            "&:hover": {
              backgroundImage: "linear-gradient(135deg, #047857 0%, #064e3b 100%)",
            },
          },
          "& .MuiPaginationItem-root.Mui-disabled": {
            opacity: 0.4,
          },
        }}
      />
    </Box>
  );
}

export default PaginationBar;
