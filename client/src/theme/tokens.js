// Design Tokens for ArcShelf UI Redesign (Option B — Refined Emerald)

export const colors = {
  primary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    400: '#34d399',
    500: '#10b981',
    600: '#059669', // main button
    700: '#047857', // hover
    800: '#065f46',
    900: '#064e3b', // dark header / footer gradient start
  },
  neutral: {
    0: '#ffffff',
    50: '#f8fafc', // page bg
    100: '#f1f5f9', // input bg
    200: '#e2e8f0', // borders
    300: '#cbd5e1', // disabled
    400: '#94a3b8', // placeholder
    500: '#64748b', // secondary text
    600: '#475569', // body
    700: '#334155', // strong body
    800: '#1e293b', // headings
    900: '#0f172a', // primary text
  },
  accent: {
    blue: '#3b82f6',
    purple: '#8b5cf6',
    amber: '#f59e0b',
    red: '#ef4444',
    teal: '#14b8a6',
  },
  bg: {
    page: '#f8fafc',
    paper: '#ffffff',
    subtle: '#f1f5f9',
    hero: 'linear-gradient(160deg, #ecfdf5 0%, #f8fafc 45%, #eff6ff 100%)',
    dark: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0f172a 100%)',
  }
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const shadows = [
  'none',
  '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',    // 1 - micro
  '0 1px 3px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.08)',    // 2 - card
  '0 2px 6px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08)',   // 3 - raised card
  '0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.10)',  // 4 - dropdown
  '0 8px 24px rgba(0,0,0,0.10), 0 16px 40px rgba(0,0,0,0.10)', // 5 - modal
];

export const brandShadow = '0 4px 20px rgba(5, 150, 105, 0.30)';

export const transitions = {
  easeOutQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  fast: '120ms cubic-bezier(0.22, 1, 0.36, 1)',
  base: '200ms cubic-bezier(0.22, 1, 0.36, 1)',
  slow: '350ms cubic-bezier(0.22, 1, 0.36, 1)',
  page: '400ms cubic-bezier(0.77, 0, 0.175, 1)',
};
