import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CodeIcon from '@mui/icons-material/Code';
import FunctionsIcon from '@mui/icons-material/Functions';
import ScienceIcon from '@mui/icons-material/Science';
import BookIcon from '@mui/icons-material/Book';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PaperBadge from './PaperBadge';
import SaveButton from './SaveButton';

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

function getDesign(seed = '') {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % 5;
  const patternId = `pattern-${Math.abs(hash)}`;
  
  switch (index) {
    case 0: // Code/Grid
      return (
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.2, pointerEvents: 'none', zIndex: 1 }}>
          <defs>
            <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1.2" />
              <circle cx="20" cy="0" r="1.5" fill="white" />
              <circle cx="0" cy="20" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      );
    case 1: // Waves/Flow
      return (
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.3, pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,30 Q25,70 50,30 T100,30 L100,100 L0,100 Z" fill="rgba(255,255,255,0.2)" />
          <path d="M0,50 Q35,20 70,60 T100,40 L100,100 L0,100 Z" fill="rgba(255,255,255,0.15)" />
        </svg>
      );
    case 2: // Orbits/Circles
      return (
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.25, pointerEvents: 'none', zIndex: 1 }}>
          <circle cx="30" cy="30" r="40" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="5,5" />
          <circle cx="30" cy="30" r="25" fill="none" stroke="white" strokeWidth="1.2" />
          <circle cx="30" cy="30" r="4" fill="white" />
          <circle cx="85" cy="115" r="50" fill="none" stroke="white" strokeWidth="1.5" />
          <circle cx="170" cy="40" r="35" fill="none" stroke="white" strokeWidth="1.2" strokeDasharray="4,4" />
        </svg>
      );
    case 3: // Diagonal Stripes
      return (
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.18, pointerEvents: 'none', zIndex: 1 }}>
          <defs>
            <pattern id={patternId} width="40" height="40" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="8" />
              <line x1="20" y1="0" x2="20" y2="40" stroke="white" strokeWidth="2.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      );
    default: // Hexagons
      return (
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.2, pointerEvents: 'none', zIndex: 1 }}>
          <defs>
            <pattern id={patternId} width="28" height="48.5" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
              <path d="M 0 0 L 14 8 L 28 0 L 28 16 L 14 24 L 0 16 Z M 0 24 L 14 32 L 28 24 L 28 40 L 14 48 L 0 40 Z" 
                    fill="none" stroke="white" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      );
  }
}

function getSubjectIcon(subject = '') {
  const s = subject.toLowerCase();
  
  const iconStyle = {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 48,
    position: 'relative',
    zIndex: 3,
    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
    transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)'
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
    '& .card-icon': { transform: 'scale(1.15)' },
  },
}));

const Overlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.3)',
  opacity: 0,
  transition: 'opacity 200ms ease',
  zIndex: 2,
});

const ContributionCard = ({ question }) => {
  const gradient = getGradient(question._id || question.subject);
  const designPattern = getDesign(question._id || question.subject || '');

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
        {designPattern}
        <Overlay className="card-overlay" />

        {getSubjectIcon(question.subject)}

        {/* Save / wishlist toggle (bottom-right of thumbnail) */}
        <Box sx={{ position: 'absolute', bottom: 10, right: 10, zIndex: 3 }}>
          <SaveButton paperId={question._id} />
        </Box>

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
