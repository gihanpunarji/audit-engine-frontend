import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

/**
 * Hero — Above-the-fold section with headline, subheadline, CTA buttons, and ambient glow.
 */
export default function Hero() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  return (
    <Box
      id="hero"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        pt: 8,
      }}
    >
      {/* Ambient Glow Orbs */}
      <Box className="glow-orb glow-orb--blue animate-float" sx={{ width: 500, height: 500, top: '-10%', left: '-10%' }} />
      <Box className="glow-orb glow-orb--cyan" sx={{ width: 400, height: 400, bottom: '5%', right: '-5%', animationDelay: '3s' }} />
      <Box className="glow-orb glow-orb--purple animate-float" sx={{ width: 300, height: 300, top: '30%', right: '15%', animationDelay: '1.5s' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: 780, mx: 'auto', textAlign: 'center' }}>
          {/* Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2.5,
              py: 0.75,
              borderRadius: '100px',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              background: 'rgba(59, 130, 246, 0.08)',
              mb: 4,
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3B82F6', boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)' }} />
          </Box>

          {/* Headline */}
          <Typography variant="h1" sx={{ color: 'text.primary', mb: 3 }}>
            AI-Powered Document{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 50%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Auditing
            </Box>
            {' '}for Enterprise
          </Typography>

          {/* Subheadline */}
          <Typography
            variant="body1"
            sx={{ fontSize: '1.2rem', maxWidth: 620, mx: 'auto', mb: 5, lineHeight: 1.7 }}
          >
            Upload receipts, invoices, warranty claims, or any business document.
            Our AI extracts structured data, detects anomalies, and flags compliance
            violations — in seconds, not hours.
          </Typography>

          {/* CTA Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStart}
              sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
            >
              {isAuthenticated ? 'Go to Account' : 'Start Free Trial'}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
            >
              Watch Demo
            </Button>
          </Stack>

          {/* Trust Signal */}
          <Typography variant="body2" sx={{ mt: 4, fontSize: '0.8rem', color: 'text.secondary' }}>
            No credit card required · 14-day free trial · SOC 2 compliant
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
