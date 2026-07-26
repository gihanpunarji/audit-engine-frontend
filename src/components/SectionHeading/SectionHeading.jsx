import { Typography, Box } from '@mui/material';

/**
 * SectionHeading — Reusable section header with label, title, and subtitle.
 * @param {object} props
 * @param {string} [props.label] - Small badge label above title (e.g. "FEATURES")
 * @param {string} props.title - Main section heading (supports gradient via `gradientText`)
 * @param {string} [props.subtitle] - Descriptive paragraph below heading
 * @param {boolean} [props.centered=true] - Center align text
 * @param {string} [props.gradientText] - Part of the title to render with gradient effect
 */
export default function SectionHeading({ label, title, subtitle, centered = true, gradientText }) {
  const renderTitle = () => {
    if (!gradientText) {
      return title;
    }

    const parts = title.split(gradientText);
    return (
      <>
        {parts[0]}
        <Box
          component="span"
          sx={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {gradientText}
        </Box>
        {parts[1] || ''}
      </>
    );
  };

  return (
    <Box sx={{ textAlign: centered ? 'center' : 'left', mb: 8, maxWidth: centered ? '720px' : 'none', mx: centered ? 'auto' : 0 }}>
      {label && (
        <Typography
          variant="overline"
          sx={{
            color: 'secondary.main',
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            mb: 2,
            display: 'block',
          }}
        >
          {label}
        </Typography>
      )}
      <Typography variant="h2" sx={{ color: 'text.primary', mb: subtitle ? 3 : 0 }}>
        {renderTitle()}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={{ fontSize: '1.125rem', maxWidth: '600px', mx: centered ? 'auto' : 0 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
