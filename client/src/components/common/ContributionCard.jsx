import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PaperBadge from './PaperBadge';

const GRADIENTS = [
  'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
  'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Option B emerald
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
  'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
];

function getGradient(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2), // 16px
  borderColor: theme.palette.divider,
  transition: 'all 250ms cubic-bezier(0.22, 1, 0.36, 1)',
  textDecoration: 'none',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    borderColor: theme.palette.primary[200],
    '& .card-title': { color: theme.palette.primary[700] },
    '& .card-arrow': { transform: 'translateX(4px)' },
    '& .card-overlay': { opacity: 1 },
  },
}));

const Overlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.3)',
  opacity: 0,
  transition: 'opacity 200ms ease',
  zIndex: 1,
});

const ContributionCard = ({ question }) => {
  const gradient = getGradient(question._id || question.subject);

  return (
    <StyledCard component={Link} to={`/questions/${question._id}`}>
      {/* Thumbnail */}
      <Box
        sx={{
          position: 'relative',
          height: 150,
          background: gradient,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          px: 2,
          overflow: 'hidden',
        }}
      >
        <Overlay className="card-overlay" />

        <DescriptionIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 48, position: 'relative', zIndex: 2 }} />
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 600,
            textAlign: 'center',
            fontSize: '13px',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            maxWidth: '90%',
            fontFamily: '"Inter", sans-serif',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {question.subject}
        </Typography>

        {/* Year Chip (top-right) */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(255,255,255,0.9)',
            color: 'neutral.900',
            fontSize: '11px',
            fontWeight: 700,
            px: 1,
            py: 0.25,
            borderRadius: '6px',
            zIndex: 2,
            lineHeight: 1.5,
          }}
        >
          {question.year}
        </Box>

        {/* Course Chip (top-left) */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: 'rgba(0,0,0,0.35)',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 700,
            px: 1.2,
            py: 0.25,
            borderRadius: '6px',
            maxWidth: '55%',
            zIndex: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: 1.5,
          }}
        >
          {question.course}
        </Box>
      </Box>

      {/* Card Content */}
      <CardContent sx={{ p: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="body2"
          className="card-title"
          sx={{
            fontWeight: 600,
            fontSize: '14px',
            color: 'neutral.800',
            mb: 0.75,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            transition: 'color 200ms ease',
            lineHeight: 1.4,
          }}
        >
          {question.subject}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: 'neutral.400',
            fontSize: '12px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {question.college?.name}
          {question.college?.university?.name && ` · ${question.college.university.name}`}
        </Typography>

        {/* Card Footer Row */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
            pt: 1.25,
            borderTop: '1px solid',
            borderColor: 'neutral.100',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <FiberManualRecordIcon sx={{ fontSize: 7, color: 'primary.500' }} />
            <Typography variant="caption" sx={{ fontSize: '11px', color: 'neutral.500', fontWeight: 500 }}>
              {question.examType}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.600', transition: 'color 200ms' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 0.4, fontSize: '11px' }}>
              View
            </Typography>
            <ArrowForwardIcon
              className="card-arrow"
              sx={{ fontSize: 13, transition: 'transform 250ms var(--ease-out-quint)' }}
            />
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ContributionCard;
