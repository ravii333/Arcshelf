import { Box, IconButton, MenuItem, Select, Typography } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";


const labelSx = { color: "neutral.500", fontWeight: 500, whiteSpace: "nowrap", fontSize: "0.8125rem" };

// A borderless select that sits inside one of the grouped "pill" containers.
const innerSelectSx = {
  fontSize: "0.8125rem",
  fontWeight: 700,
  color: "neutral.800",
  "& .MuiSelect-select": { py: "5px", pl: 1, pr: "24px !important" },
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "& .MuiSelect-icon": { color: "neutral.500" },
};

const arrowSx = {
  width: 30,
  height: 30,
  borderRadius: "8px",
  color: "neutral.600",
  transition: "all 150ms ease",
  "&:hover:not(.Mui-disabled)": { bgcolor: "primary.50", color: "primary.700" },
  "&.Mui-disabled": { color: "neutral.300" },
};

// Rounded, bordered container that groups a cluster of controls together.
const pillSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  p: "3px 6px",
  border: "1px solid",
  borderColor: "neutral.200",
  borderRadius: "12px",
  bgcolor: "neutral.0",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
};

function PaginationBar({
  page,
  count,
  total,
  perPage,
  onChange,
  label = "items",
  scrollToTop = true,
  perPageOptions,
  onPerPageChange,
  sx,
}) {
  // Nothing to show when the list is empty.
  if (!total) return null;

  const pageCount = Math.max(count || 1, 1);
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const showPerPage = Boolean(perPageOptions && onPerPageChange);
  const showNavigator = pageCount > 1;

  const goTo = (event, value) => {
    if (value < 1 || value > pageCount || value === page) return;
    onChange(event, value);
    if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const menuProps = { PaperProps: { sx: { borderRadius: "10px", maxHeight: 280, mt: 0.5 } } };

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
      <Typography variant="body2" sx={labelSx}>
        Showing{" "}
        <Box component="span" sx={{ fontWeight: 700, color: "neutral.700" }}>
          {from}–{to}
        </Box>{" "}
        of{" "}
        <Box component="span" sx={{ fontWeight: 700, color: "neutral.700" }}>
          {total}
        </Box>{" "}
        {label}
      </Typography>

      {(showPerPage || showNavigator) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, sm: 2 },
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {showPerPage && (
            <Box sx={pillSx}>
              <Select
                value={perPage}
                onChange={onPerPageChange}
                size="small"
                sx={innerSelectSx}
                MenuProps={menuProps}
              >
                {perPageOptions.map((opt) => (
                  <MenuItem key={opt} value={opt} sx={{ fontSize: "0.8125rem" }}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
              <Typography sx={{ ...labelSx, pr: 0.5 }}>per page</Typography>
            </Box>
          )}

          {showNavigator && (
            <Box sx={pillSx}>
              <IconButton
                size="small"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={(e) => goTo(e, page - 1)}
                sx={arrowSx}
              >
                <KeyboardArrowLeftIcon fontSize="small" />
              </IconButton>

              <Select
                value={page}
                onChange={(e) => goTo(e, Number(e.target.value))}
                size="small"
                sx={innerSelectSx}
                MenuProps={menuProps}
              >
                {Array.from({ length: pageCount }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1} sx={{ fontSize: "0.8125rem" }}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
              <Typography sx={labelSx}>of {pageCount}</Typography>

              <IconButton
                size="small"
                aria-label="Next page"
                disabled={page >= pageCount}
                onClick={(e) => goTo(e, page + 1)}
                sx={arrowSx}
              >
                <KeyboardArrowRightIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default PaginationBar;
