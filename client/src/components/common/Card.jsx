import React from 'react';
import { Card as MuiCard } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(MuiCard)(({ theme, hover }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[200]}`,
  transition: 'all 0.3s',
  ...(hover && {
    '&:hover': {
      boxShadow: '0 6px 20px rgba(22, 163, 74, 0.15)',
      transform: 'translateY(-4px)',
      borderColor: 'rgba(22, 163, 74, 0.6)',
    },
  }),
}));

const Card = ({ children, hover = true, ...props }) => {
  return (
    <StyledCard hover={hover} {...props}>
      {children}
    </StyledCard>
  );
};

export default Card;
