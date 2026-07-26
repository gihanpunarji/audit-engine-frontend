import { Box, Container, Grid, Typography } from '@mui/material';
import GlassCard from '../../components/GlassCard/GlassCard';
import SectionHeading from '../../components/SectionHeading/SectionHeading';

const STEPS = [
  {
    step: '01',
    title: 'Ingest & Upload',
    description: 'Submit receipts, warranty claims, or application forms via API or UI straight into secure cloud storage.',
  },
  {
    step: '02',
    title: 'AI Processing & Extraction',
    description: 'AI analyzes document contents, extracts structured JSON attributes, and verifies business rules.',
  },
  {
    step: '03',
    title: 'Review Flagged Findings',
    description: 'Human reviewers get an prioritized feed of anomalies with recommendations and severity levels for quick resolution.',
  },
];

export default function HowItWorks() {
  return (
    <Box id="how-it-works" component="section" className="section">
      <Container maxWidth="lg">
        <SectionHeading
          label="WORKFLOW"
          title="Simple 3-Step Process"
          gradientText="3-Step Process"
          subtitle="From raw unstructured document to validated audit findings in three effortless steps."
        />

        <Grid container spacing={4}>
          {STEPS.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <GlassCard sx={{ height: '100%', position: 'relative' }}>
                <Typography
                  variant="h2"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 24,
                    color: 'rgba(59, 130, 246, 0.15)',
                    fontWeight: 900,
                    fontSize: '3.5rem',
                    userSelect: 'none',
                  }}
                >
                  {item.step}
                </Typography>

                <Box sx={{ pt: 2 }}>
                  <Typography variant="h6" sx={{ color: 'text.primary', mb: 1.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </Box>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
