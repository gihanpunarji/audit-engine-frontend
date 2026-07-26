import { Box, Container, Grid, Typography } from '@mui/material';
import GlassCard from '../../components/GlassCard/GlassCard';

const STATS = [
  { value: '99.4%', label: 'Extraction Accuracy' },
  { value: '< 10s', label: 'Average Audit Time' },
  { value: '5+', label: 'Severity Levels' },
  { value: '100%', label: 'Cloud Integration Secured' },
];

export default function Stats() {
  return (
    <Box component="section" className="section" sx={{ pt: 4, pb: 8 }}>
      <Container maxWidth="lg">
        <GlassCard noPadding sx={{ p: 4 }}>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {STATS.map((stat, index) => (
              <Grid item xs={6} md={3} key={index} sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h2"
                  sx={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 800,
                    mb: 0.5,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </GlassCard>
      </Container>
    </Box>
  );
}
