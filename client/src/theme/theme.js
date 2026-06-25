import { createTheme } from '@mui/material/styles';
import { colors, borderRadius, shadows } from './tokens';

const theme = createTheme({
  palette: {
    primary: {
      50: colors.primary[50],
      100: colors.primary[100],
      200: colors.primary[200],
      400: colors.primary[400],
      500: colors.primary[500],
      600: colors.primary[600],   // main
      700: colors.primary[700],   // dark (hover)
      800: colors.primary[800],
      900: colors.primary[900],
      main: colors.primary[600],
      dark: colors.primary[700],
      light: colors.primary[400],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.neutral[700],
      dark: colors.neutral[900],
      light: colors.neutral[500],
      contrastText: '#ffffff',
    },
    success: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
      contrastText: '#ffffff',
    },
    error: {
      main: colors.accent.red,
      light: '#fca5a5',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    warning: {
      main: colors.accent.amber,
      light: '#fde047',
      dark: '#b45309',
      contrastText: '#ffffff',
    },
    info: {
      main: colors.accent.blue,
      light: '#93c5fd',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    neutral: {
      ...colors.neutral,
    },
    accent: {
      ...colors.accent,
    },
    background: {
      default: colors.bg.page,
      paper: colors.bg.paper,
      subtle: colors.bg.subtle,
      hero: colors.bg.hero,
      dark: colors.bg.dark,
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[500],
      disabled: colors.neutral[300],
    },
    divider: colors.neutral[200],
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' },
    h2: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    h3: { fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.375rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.5, letterSpacing: '0.01em' },
    body1: { fontSize: '1rem', lineHeight: 1.65 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    caption: { fontSize: '0.75rem', lineHeight: 1.5, letterSpacing: '0.02em' },
    overline: { fontSize: '0.6875rem', fontWeight: 600, lineHeight: 1.5, letterSpacing: '0.1em', textTransform: 'uppercase' },
    button: { fontSize: '0.875rem', fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: borderRadius.sm, // Base unit (8px)
  },
  shadows: [
    shadows[0],
    shadows[1],
    shadows[2],
    shadows[3],
    shadows[4],
    shadows[5],
    'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm + 2, // 10px
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 200ms cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': { boxShadow: 'none', transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0px)' },
        },
        contained: {
          '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.15)' },
          '&.MuiButton-containedPrimary:hover': {
            boxShadow: '0 4px 20px rgba(5, 150, 105, 0.35)', // Option B brand shadow glow
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px' },
        },
        sizeSmall: { borderRadius: borderRadius.sm, padding: '6px 14px', fontSize: '0.8125rem' },
        sizeLarge: { borderRadius: borderRadius.md, padding: '14px 28px', fontSize: '1rem' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg, // 16px
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.08)',
          border: '1px solid rgba(226, 232, 240, 1)',
          transition: 'all 250ms cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.1), 0 16px 40px rgba(0,0,0,0.06)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: borderRadius.lg, backgroundImage: 'none' },
        elevation0: { border: '1px solid #e2e8f0' },
        elevation1: { boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.sm + 2, // 10px
            fontSize: '0.9375rem',
            '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
            '&:hover fieldset': { borderColor: '#94a3b8' },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary[500],
              borderWidth: '2px',
              boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.12)',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: colors.primary[700] },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm + 2, // 10px
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary[500],
            borderWidth: '2px',
            boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.sm - 2, // 6px
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 26,
        },
        sizeSmall: { height: 20, fontSize: '0.6875rem' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: borderRadius.sm + 2, border: '1px solid', fontSize: '0.875rem' },
        standardError: { borderColor: '#fca5a5', backgroundColor: '#fef2f2' },
        standardSuccess: { borderColor: '#86efac', backgroundColor: '#f0fdf4' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: borderRadius.sm, fontSize: '0.75rem', padding: '6px 10px' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
          color: colors.neutral[800],
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: '1px solid #e2e8f0', boxShadow: 'none' },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#e2e8f0' },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: { '& .MuiPaginationItem-root': { borderRadius: borderRadius.sm } },
      },
    },
    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
      styleOverrides: { root: { borderRadius: borderRadius.sm, backgroundColor: '#f1f5f9' } },
    },
  },
});

export default theme;
