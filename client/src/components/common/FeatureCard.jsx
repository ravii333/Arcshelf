import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[200]}`,
  transition: 'all 0.5s',
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-4px)',
    '& .feature-icon': {
      transform: 'scale(1.1)',
    },
    '& .feature-title': {
      color: '#128c43',
    },
    '& .feature-accent': {
      opacity: 1,
    },
  },
}));

const AccentLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: 4,
  background: 'linear-gradient(135deg, #16a34a 0%, #128c43 100%)',
  borderRadius: `0 0 ${theme.spacing(2)} ${theme.spacing(2)}`,
  opacity: 0,
  transition: 'opacity 0.3s',
}));

const FeatureCard = ({
  icon,
  title,
  description,
  badgeText,
  iconBgColor,
  gradient,
}) => {
  return (
    <StyledCard>
      {badgeText && (
        <Chip
          label={badgeText}
          size="small"
          sx={{
            position: 'absolute',
            top: -12,
            right: 16,
            background: gradient || 'linear-gradient(135deg, #16a34a 0%, #128c43 100%)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 600,
            height: 24,
            boxShadow: 2,
            zIndex: 1,
          }}
        />
      )}

      <CardContent sx={{ p: 3 }}>
        <Box
          className="feature-icon"
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: iconBgColor || 'linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            transition: 'transform 0.3s',
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          className="feature-title"
          sx={{
            fontWeight: 600,
            mb: 1,
            transition: 'color 0.3s',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.7 }}
        >
          {description}
        </Typography>
      </CardContent>

      <AccentLine className="feature-accent" />
    </StyledCard>
  );
};

export default FeatureCard;
