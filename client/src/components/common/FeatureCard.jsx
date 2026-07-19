import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card, { shouldForwardProp: (prop) => prop !== 'stepColor' })(() => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 20, // original border radius preserved
  border: 'none',
  backgroundColor: '#ffffff',
  boxShadow: '0px 0px 15px rgba(0,0,0,0.09)',
  padding: 36, // p-9
  height: '100%',
  transition: 'all 250ms cubic-bezier(0.22, 1, 0.36, 1)',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: `0px 0px 20px rgba(0,0,0,0.12)`,
    '& .feature-corner': {
      transform: 'scale(1.06)',
    },
    '& .feature-icon': {
      transform: 'scale(1.08)',
    },
  },
}));

const CornerCircle = styled(Box, { shouldForwardProp: (prop) => prop !== 'stepColor' })(({ stepColor }) => ({
  position: 'absolute',
  width: 96, // w-24
  height: 96, // h-24
  right: -20, // -right-5
  top: -28, // -top-7
  borderRadius: '9999px',
  backgroundColor: stepColor,
  transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
}));

const FeatureCard = ({
  icon,
  title,
  description,
  badgeText, // e.g. "01", "02", "03"
  stepColor = "#059669",
}) => {
  return (
    <StyledCard stepColor={stepColor}>
      {/* Corner circle with step number */}
      <CornerCircle className="feature-corner" stepColor={stepColor}>
        {badgeText && (
          <Typography
            sx={{
              position: 'absolute',
              bottom: 24, // bottom-6
              left: 28, // left-7
              color: '#ffffff',
              fontSize: '1.5rem', // text-2xl
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {badgeText}
          </Typography>
        )}
      </CornerCircle>

      {/* Icon */}
      <Box
        className="feature-icon"
        sx={{
          position: 'relative',
          width: 48, // w-12
          color: stepColor,
          mb: 1.5,
          transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
          '& svg': {
            width: 48,
            height: 48,
            fontSize: 48,
            color: stepColor,
            fill: 'currentColor',
          },
        }}
      >
        {icon}
      </Box>

      {/* Title */}
      <Typography
        sx={{
          position: 'relative',
          fontWeight: 700,
          fontSize: '1.25rem', // text-xl
          color: 'neutral.900',
          mb: 1.5,
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        sx={{
          position: 'relative',
          fontSize: '0.875rem', // text-sm
          color: 'neutral.500', // zinc-500
          lineHeight: 1.7, // leading-6
        }}
      >
        {description}
      </Typography>
    </StyledCard>
  );
};

export default FeatureCard;
