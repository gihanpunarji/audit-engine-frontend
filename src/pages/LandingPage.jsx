import { Box } from '@mui/material';
import { Navbar, Footer } from '../components';
import { Hero, Features, HowItWorks, Stats, CTA } from '../sections';

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <CTA />
      </Box>
      <Footer />
    </Box>
  );
}
