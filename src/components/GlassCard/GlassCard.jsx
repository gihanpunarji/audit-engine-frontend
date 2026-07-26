import { Card, CardContent } from '@mui/material';

/**
 * GlassCard — Reusable glassmorphism card container.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {object} [props.sx] - Additional MUI sx styles
 * @param {boolean} [props.hoverable=true] - Enable hover lift effect
 * @param {boolean} [props.noPadding=false] - Remove default padding
 */
export default function GlassCard({ children, sx = {}, hoverable = true, noPadding = false, ...rest }) {
  return (
    <Card
      elevation={0}
      sx={{
        background: 'rgba(17, 24, 39, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.08)',
        borderRadius: '16px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        ...(hoverable && {
          '&:hover': {
            border: '1px solid rgba(59, 130, 246, 0.25)',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.12)',
            transform: 'translateY(-4px)',
          },
        }),
        ...sx,
      }}
      {...rest}
    >
      <CardContent sx={{ padding: noPadding ? 0 : '32px', '&:last-child': { paddingBottom: noPadding ? 0 : '32px' } }}>
        {children}
      </CardContent>
    </Card>
  );
}
