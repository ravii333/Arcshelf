import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const GRADIENTS = [
  'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
  'linear-gradient(135deg, #16a34a 0%, #0d9488 100%)',
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
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[200]}`,
  transition: 'all 0.3s ease',
  textDecoration: 'none',
  '&:hover': {
    boxShadow: theme.shadows[8],
    transform: 'translateY(-4px)',
    '& .card-title': { color: '#128c43' },
    '& .card-arrow': { transform: 'translateX(4px)' },
    '& .card-overlay': { opacity: 1 },
  },
}));

const Overlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)',
  opacity: 0,
  transition: 'opacity 0.3s',
  borderRadius: 'inherit',
});

const ContributionCard = ({ question }) => {
  const gradient = getGradient(question._id || question.subject);

  return (
    <StyledCard component={Link} to={`/questions/${question._id}`} sx={{ color: 'inherit' }}>
      {/* Thumbnail */}
      <Box
        sx={{
          position: 'relative',
          height: 140,
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

        <DescriptionIcon sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 40 }} />
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 600,
            textAlign: 'center',
            fontSize: '0.75rem',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            maxWidth: '90%',
          }}
        >
          {question.subject}
        </Typography>

        {/* Chips */}
        <Chip
          label={question.year}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            fontSize: '0.625rem',
            fontWeight: 700,
            height: 20,
          }}
        />
        <Chip
          label={question.course}
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            bgcolor: 'rgba(0,0,0,0.35)',
            color: 'white',
            fontSize: '0.625rem',
            fontWeight: 700,
            height: 20,
            maxWidth: '55%',
            '& .MuiChip-label': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          }}
        />
      </Box>

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography
          variant="body2"
          className="card-title"
          sx={{
            fontWeight: 600,
            mb: 0.75,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            transition: 'color 0.25s',
            lineHeight: 1.4,
          }}
        >
          {question.subject}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {question.college?.name}
          {question.college?.university?.name && `, ${question.college.university.name}`}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 1.25,
            mt: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <FiberManualRecordIcon sx={{ fontSize: 7, color: '#16a34a' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {question.examType}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', color: '#16a34a' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, mr: 0.4, fontSize: '0.7rem' }}>
              View
            </Typography>
            <ArrowForwardIcon
              className="card-arrow"
              sx={{ fontSize: 13, transition: 'transform 0.25s' }}
            />
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ContributionCard;
