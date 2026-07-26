import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, Container } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
];

/**
 * Navbar — Top navigation bar with scroll-aware transparency and mobile drawer.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled ? 'rgba(10, 14, 26, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(148, 163, 184, 0.08)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', px: 0, py: 1 }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#fff',
                }}
              >
                A
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.15rem' }}>
                AuditEngine
              </Typography>
            </Box>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
              {NAV_LINKS.map((link) => (
                <Typography
                  key={link.label}
                  component="a"
                  href={link.href}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleGetStarted}
              >
                {isAuthenticated ? 'My Account' : 'Get Started'}
              </Button>
            </Box>

            {/* Mobile Hamburger */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <Box sx={{ width: 22, height: 2, bgcolor: 'text.primary', borderRadius: 1 }} />
                <Box sx={{ width: 22, height: 2, bgcolor: 'text.primary', borderRadius: 1 }} />
                <Box sx={{ width: 16, height: 2, bgcolor: 'text.primary', borderRadius: 1 }} />
              </Box>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: 'rgba(10, 14, 26, 0.95)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ pt: 4, px: 2 }}>
          <List>
            {NAV_LINKS.map((link) => (
              <ListItem
                key={link.label}
                component="a"
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              setDrawerOpen(false);
              handleGetStarted();
            }}
          >
            {isAuthenticated ? 'My Account' : 'Get Started'}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
