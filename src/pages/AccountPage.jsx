import { useNavigate } from 'react';
import { Box, Container, Typography, Button, Stack, Chip, Divider } from '@mui/material';
import GlassCard from '../components/GlassCard/GlassCard';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useAuth } from '../context/AuthContext';

export default function AccountPage() {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="md" sx={{ flexGrow: 1, py: 12 }}>
        <GlassCard sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                My Account & Workspace
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Manage your document audit targets and view audit history
              </Typography>
            </Box>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Sign Out
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={3}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                AUTHENTICATED USER
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h6" sx={{ color: 'primary.light', fontWeight: 700 }}>
                  {userEmail || 'Active Session'}
                </Typography>
                <Chip label="ACTIVE SESSION" color="success" size="small" sx={{ fontWeight: 700 }} />
              </Stack>
            </Box>

            <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mb: 1 }}>
                🚀 Audit Engine Workspace Active
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                You are successfully logged in. You can now configure document intake targets, upload business documents (receipts, claims, forms), and view AI-flagged anomalies and findings in real time.
              </Typography>
            </Box>
          </Stack>
        </GlassCard>
      </Container>

      <Footer />
    </Box>
  );
}
