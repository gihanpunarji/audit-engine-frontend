import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import GlassCard from '../../components/GlassCard/GlassCard';
import { useAuth } from '../../context/AuthContext';

export default function CTA() {
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
    <Box component="section" className="section">
      <Container maxWidth="lg">
        <GlassCard
          sx={{
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(37, 99, 235, 0.15) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          <Typography variant="h2" sx={{ color: 'text.primary', mb: 2 }}>
            Ready to Automate Your Document Audits?
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            Stop spending hours manually verifying claims, invoices, and forms. Let AI handle extraction and anomaly flagging.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStart}
              sx={{ px: 4, py: 1.5 }}
            >
              {isAuthenticated ? 'Go to Account' : 'Get Started Now'}
            </Button>
            <Button variant="outlined" color="primary" size="large" sx={{ px: 4, py: 1.5 }}>
              Talk to Sales
            </Button>
          </Stack>
        </GlassCard>
      </Container>
    </Box>
  );
}
