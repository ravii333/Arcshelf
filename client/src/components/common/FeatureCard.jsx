import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StyledCard = styled(Card, { shouldForwardProp: (prop) => prop !== 'stepColor' })(({ theme, stepColor }) => ({
  position: 'relative',
  borderRadius: 20,
  border: '1px solid',
  borderColor: '#f1f5f9', // neutral.100
  borderTop: `3px solid ${stepColor}`,
  backgroundColor: '#ffffff',
  boxShadow: 'none',
  transition: 'all 250ms cubic-bezier(0.22, 1, 0.36, 1)',
  aspectRatio: '1 / 1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.08)', // shadow[4]
    transform: 'translateY(-6px)',
    '& .feature-icon': {
      transform: 'scale(1.08)',
    },
    '& .feature-arrow': {
      transform: 'translateX(4px)',
    },
    '& .feature-accent': {
      transform: 'scaleX(1)',
    },
  },
}));

const AccentLine = styled(Box, { shouldForwardProp: (prop) => prop !== 'stepColor' })(({ stepColor }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: 4,
  backgroundColor: stepColor,
  transform: 'scaleX(0)',
  transformOrigin: 'left',
  transition: 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
}));

const FeatureCard = ({
  icon,
  title,
  description,
  badgeText, // e.g. "01", "02", "03"
  stepColor = "#059669", // step-specific color (blue, green, purple)
  iconBgColor = "rgba(5, 150, 105, 0.08)",
}) => {
  return (
    <StyledCard stepColor={stepColor}>
      <CardContent
        sx={{
          p: { xs: 2.5, sm: 3, md: 3.5 },
          '&:last-child': { pb: { xs: 2.5, sm: 3, md: 3.5 } },
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Section: Icon & Step Badge */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          {/* Icon Container */}
          <Box
            className="feature-icon"
            sx={{
              width: { xs: 44, md: 52 },
              height: { xs: 44, md: 52 },
              borderRadius: 3,
              background: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 250ms var(--ease-out-quint)',
              '& svg': {
                fontSize: { xs: 22, md: 26 },
                color: stepColor,
              }
            }}
          >
            {icon}
          </Box>

          {/* Step Badge */}
          {badgeText && (
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                color: stepColor,
                fontSize: { xs: '0.7rem', md: '0.75rem' },
                letterSpacing: '0.05em',
                lineHeight: 1,
                mt: 0.5,
              }}
            >
              {badgeText}
            </Typography>
          )}
        </Box>

        {/* Middle Section: Title & Description */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', my: { xs: 1.5, md: 2.5 } }}>
          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: { xs: 0.75, md: 1.5 },
              color: 'neutral.900',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              lineHeight: { xs: 1.5, md: 1.65 },
              color: 'neutral.500',
              fontSize: { xs: '0.8rem', md: '0.875rem' },
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* Bottom Section: Arrow Indicator */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: stepColor,
            fontWeight: 600,
            fontSize: '0.8125rem',
            cursor: 'pointer',
          }}
        >
          <ArrowForwardIcon
            className="feature-arrow"
            sx={{
              fontSize: 16,
              transition: 'transform 250ms var(--ease-out-quint)',
            }}
          />
        </Box>
      </CardContent>

      <AccentLine className="feature-accent" stepColor={stepColor} />
    </StyledCard>
  );
};

export default FeatureCard;
