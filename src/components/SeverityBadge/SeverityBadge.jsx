import { Chip } from '@mui/material';

const SEVERITY_COLORS = {
  critical: { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' },
  high:     { bg: 'rgba(249, 115, 22, 0.15)', color: '#F97316', border: 'rgba(249, 115, 22, 0.3)' },
  medium:   { bg: 'rgba(234, 179, 8, 0.15)',  color: '#EAB308', border: 'rgba(234, 179, 8, 0.3)' },
  low:      { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' },
  info:     { bg: 'rgba(6, 182, 212, 0.15)',  color: '#06B6D4', border: 'rgba(6, 182, 212, 0.3)' },
};

/**
 * SeverityBadge — Reusable severity indicator chip.
 * Maps directly to backend FindingSeverity enum.
 * @param {object} props
 * @param {'critical'|'high'|'medium'|'low'|'info'} props.severity
 * @param {string} [props.label] - Override display label (defaults to severity name)
 */
export default function SeverityBadge({ severity = 'info', label }) {
  const colors = SEVERITY_COLORS[severity] || SEVERITY_COLORS.info;

  return (
    <Chip
      label={label || severity.toUpperCase()}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        fontWeight: 700,
        fontSize: '0.7rem',
        letterSpacing: '0.08em',
      }}
    />
  );
}
