import { Link } from 'react-router-dom';
import { Card, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CodeIcon from '@mui/icons-material/Code';
import FunctionsIcon from '@mui/icons-material/Functions';
import ScienceIcon from '@mui/icons-material/Science';
import BookIcon from '@mui/icons-material/Book';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SaveButton from './SaveButton';

const GRADIENTS = [
  'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
  'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
];

// Solid accent colors paired with each gradient — used for the icon & footer on the white card.
const ACCENTS = [
  '#6366f1',
  '#059669',
  '#ef4444',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#3b82f6',
];

function hashOf(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getGradient(str = '') {
  return GRADIENTS[hashOf(str) % GRADIENTS.length];
}

function getAccent(str = '') {
  return ACCENTS[hashOf(str) % ACCENTS.length];
}

function getSubjectIcon(subject = '', color) {
  const s = subject.toLowerCase();

  const iconStyle = {
    color,
    fontSize: 48,
    transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
  };

  if (
    s.includes('code') ||
    s.includes('programm') ||
    s.includes('data structure') ||
    s.includes('algorithm') ||
    s.includes('operating system') ||
    s.includes('os') ||
    s.includes('network') ||
    s.includes('software') ||
    s.includes('computer') ||
    s.includes('java') ||
    s.includes('python') ||
    s.includes('web') ||
    s.includes('database') ||
    s.includes('sql')
  ) {
    return <CodeIcon sx={iconStyle} className="card-icon" />;
  }

  if (
    s.includes('math') ||
    s.includes('calculus') ||
    s.includes('algebra') ||
    s.includes('stat') ||
    s.includes('geometry') ||
    s.includes('discrete') ||
    s.includes('numerical')
  ) {
    return <FunctionsIcon sx={iconStyle} className="card-icon" />;
  }

  if (
    s.includes('physic') ||
    s.includes('chemistry') ||
    s.includes('science') ||
    s.includes('mechanic') ||
    s.includes('thermodynamic') ||
    s.includes('circuit') ||
    s.includes('electro')
  ) {
    return <ScienceIcon sx={iconStyle} className="card-icon" />;
  }

  if (
    s.includes('manage') ||
    s.includes('business') ||
    s.includes('econom') ||
    s.includes('finance') ||
    s.includes('marketing') ||
    s.includes('account')
  ) {
    return <TrendingUpIcon sx={iconStyle} className="card-icon" />;
  }

  if (
    s.includes('english') ||
    s.includes('literature') ||
    s.includes('history') ||
    s.includes('civics') ||
    s.includes('sociolog') ||
    s.includes('law')
  ) {
    return <BookIcon sx={iconStyle} className="card-icon" />;
  }

  return <DescriptionIcon sx={iconStyle} className="card-icon" />;
}

const StyledCard = styled(Card)({
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16, // original border radius preserved
  border: 'none',
  backgroundColor: '#ffffff',
  boxShadow: '0px 0px 15px rgba(0,0,0,0.09)',
  padding: 28,
  textDecoration: 'none',
  transition: 'all 250ms cubic-bezier(0.22, 1, 0.36, 1)',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0px 0px 20px rgba(0,0,0,0.13)',
    '& .card-title': { color: 'inherit' },
    '& .card-arrow': { transform: 'translateX(4px)' },
    '& .card-corner': { transform: 'scale(1.06)' },
    '& .card-icon': { transform: 'scale(1.1)' },
    // Fill the "View" pill with the card's accent on hover for a clear CTA affordance.
    '& .card-view-btn': { backgroundColor: 'var(--card-accent)', color: '#ffffff' },
  },
});

const CornerCircle = styled(Box, { shouldForwardProp: (prop) => prop !== 'gradient' })(({ gradient }) => ({
  position: 'absolute',
  width: 96,
  height: 96,
  right: -20,
  top: -28,
  borderRadius: '9999px',
  background: gradient,
  transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
  zIndex: 1,
}));

const ContributionCard = ({ question }) => {
  const seed = question._id || question.subject || '';
  const gradient = getGradient(seed);
  const accent = getAccent(seed);

  return (
    <StyledCard component={Link} to={`/questions/${question._id}`} sx={{ '--card-accent': accent }}>
      {/* Corner circle with year */}
      <CornerCircle className="card-corner" gradient={gradient}>
        {question.year && (
          <Typography
            sx={{
              position: 'absolute',
              bottom: 26,
              left: 18,
              color: '#ffffff',
              fontSize: '0.9375rem',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '0.02em',
            }}
          >
            {question.year}
          </Typography>
        )}
      </CornerCircle>

      {/* Save / wishlist toggle */}
      <Box
        sx={{ position: 'absolute', top: 14, left: 14, zIndex: 3 }}
        onClick={(e) => e.preventDefault()}
      >
        <SaveButton paperId={question._id} />
      </Box>

      {/* Icon */}
      <Box className="card-icon-wrap" sx={{ position: 'relative', width: 48, mb: 1.5, mt: 3 }}>
        {getSubjectIcon(question.subject, accent)}
      </Box>

      {/* Title — subject */}
      <Typography
        className="card-title"
        sx={{
          position: 'relative',
          fontWeight: 700,
          fontSize: '1.0625rem',
          color: 'neutral.900',
          mb: 0.75,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.35,
          transition: 'color 200ms ease',
        }}
      >
        {question.subject}
      </Typography>

      {/* Description — college / university */}
      <Typography
        sx={{
          position: 'relative',
          fontSize: '0.8125rem',
          color: 'neutral.500',
          lineHeight: 1.6,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          mb: 2,
        }}
      >
        {question.college?.name}
        {question.college?.university?.name && ` · ${question.college.university.name}`}
      </Typography>

      {/* Footer */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 'auto',
          pt: 1.5,
          borderTop: '1px solid',
          borderColor: 'neutral.100',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <FiberManualRecordIcon sx={{ fontSize: 7, color: accent }} />
          <Typography sx={{ fontSize: '0.6875rem', color: 'neutral.500', fontWeight: 600 }}>
            {question.examType}
          </Typography>
        </Box>

        <Box
          className="card-view-btn"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.4,
            px: 1.25,
            py: 0.5,
            borderRadius: '6px',
            bgcolor: 'neutral.100',
            color: accent,
            transition: 'background-color 200ms ease, color 200ms ease',
          }}
        >
          <Typography component="span" sx={{ fontWeight: 700, fontSize: '0.6875rem', color: 'inherit', lineHeight: 1 }}>
            View
          </Typography>
          <ArrowForwardIcon
            className="card-arrow"
            sx={{ fontSize: 13, color: 'inherit', transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </Box>
      </Box>
    </StyledCard>
  );
};

export default ContributionCard;
