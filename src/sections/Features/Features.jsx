import { Box, Container, Grid, Typography } from '@mui/material';
import GlassCard from '../../components/GlassCard/GlassCard';
import SectionHeading from '../../components/SectionHeading/SectionHeading';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Multimodal AI Extraction',
    description: 'Powered by AI to process PDFs, images, and scanned documents, turning raw text into structured JSON data in seconds.',
  },
  {
    icon: '🛡️',
    title: 'Automated Anomaly Detection',
    description: 'Instantly identifies calculation mismatches, unexpected line items, policy violations, and suspicious vendor values.',
  },
  {
    icon: '🏢',
    title: 'Multi-Tenant Organization RBAC',
    description: 'Enterprise-grade access control with custom roles: Owner, Admin, Reviewer, and Viewer tied to tenant organizations.',
  },
  {
    icon: '☁️',
    title: 'Secure Cloud Integration',
    description: 'Automatic document upload & isolation using deterministic org and target path structures.',
  },
  {
    icon: '🔄',
    title: 'Async Background Pipeline',
    description: 'Non-blocking processing engine so your users never wait on document uploads while AI completes deep audits.',
  },
  {
    icon: '📊',
    title: 'Severity Categorization',
    description: 'Findings are categorized into Critical, High, Medium, Low, and Info levels for fast human review prioritization.',
  },
];

export default function Features() {
  return (
    <Box id="features" component="section" className="section">
      <Container maxWidth="lg">
        <SectionHeading
          label="CAPABILITIES"
          title="Engineered for Automated Auditing"
          gradientText="Automated Auditing"
          subtitle="Everything you need to ingest, audit, and validate unstructured business documents at enterprise scale."
        />

        <Grid container spacing={3}>
          {FEATURES.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <GlassCard sx={{ height: '100%' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    mb: 2.5,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ color: 'text.primary', mb: 1.5 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
