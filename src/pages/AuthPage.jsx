import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import GlassCard from '../components/GlassCard/GlassCard';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/authApi';

export default function AuthPage() {
  const [tabValue, setTabValue] = useState(0); // 0 = Login, 1 = Register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = await loginUser({ email: loginEmail, password: loginPassword });
      login(token, loginEmail);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await registerUser({
        fName,
        lName,
        email: regEmail,
        password: regPassword,
        organizationName: orgName,
        organizationSlug: orgSlug,
      });

      if (result === 'User Already Registered') {
        setError('A user with this email is already registered.');
      } else {
        setSuccess('Account created successfully! Please sign in.');
        setTabValue(0); // Switch to Sign In tab
        setLoginEmail(regEmail);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />

      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 12 }}>
        <GlassCard sx={{ width: '100%', p: { xs: 3, sm: 5 } }}>
          <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 800, mb: 1, color: 'text.primary' }}>
            {tabValue === 0 ? 'Welcome Back' : 'Create Account'}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
            {tabValue === 0
              ? 'Sign in to access your document audit targets & findings'
              : 'Register your organization to start auditing business documents'}
          </Typography>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              mb: 4,
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': { fontWeight: 700, fontSize: '0.95rem' },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          {/* LOGIN FORM */}
          {tabValue === 0 && (
            <Box component="form" onSubmit={handleLoginSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.5, mt: 1 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
              </Stack>
            </Box>
          )}

          {/* REGISTER FORM */}
          {tabValue === 1 && (
            <Box component="form" onSubmit={handleRegisterSubmit}>
              <Stack spacing={2.5}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="First Name"
                    fullWidth
                    required
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                  />
                  <TextField
                    label="Last Name"
                    fullWidth
                    required
                    value={lName}
                    onChange={(e) => setLName(e.target.value)}
                  />
                </Stack>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
                <TextField
                  label="Organization Name"
                  placeholder="e.g. Acme Financial"
                  fullWidth
                  required
                  value={orgName}
                  onChange={(e) => {
                    setOrgName(e.target.value);
                    setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                />
                <TextField
                  label="Organization Slug"
                  placeholder="e.g. acme-financial"
                  fullWidth
                  required
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value)}
                  helperText="Unique organization identifier slug"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.5, mt: 1 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account & Organization'}
                </Button>
              </Stack>
            </Box>
          )}
        </GlassCard>
      </Container>

      <Footer />
    </Box>
  );
}
