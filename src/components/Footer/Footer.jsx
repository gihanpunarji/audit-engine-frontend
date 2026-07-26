import { Box, Container, Typography, Grid, IconButton } from '@mui/material';

const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Documentation', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

/**
 * Footer — Site footer with links, branding, and social icons.
 */
export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid rgba(148, 163, 184, 0.08)',
        pt: 8,
        pb: 4,
        background: 'rgba(10, 14, 26, 0.5)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#fff',
                }}
              >
                A
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                AuditEngine
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ maxWidth: 280, mb: 3 }}>
              AI-powered document auditing platform. Extract data, detect anomalies, and enforce compliance — automatically.
            </Typography>
            {/* Social icons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['X', 'in', 'GH'].map((icon) => (
                <IconButton
                  key={icon}
                  size="small"
                  sx={{
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                    borderRadius: '8px',
                    color: 'text.secondary',
                    width: 36,
                    height: 36,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      background: 'rgba(59, 130, 246, 0.08)',
                    },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={category}>
              <Typography
                variant="overline"
                sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', mb: 2, display: 'block' }}
              >
                {category}
              </Typography>
              {links.map((link) => (
                <Typography
                  key={link}
                  component="a"
                  href="#"
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    display: 'block',
                    mb: 1.5,
                    transition: 'color 0.2s ease',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>
          ))}
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            mt: 8,
            pt: 3,
            borderTop: '1px solid rgba(148, 163, 184, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} AuditEngine. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            Built with Spring Boot + React + Gemini AI
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
