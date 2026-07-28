import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
  Typography,
  Alert,
  Stack,
  keyframes,
} from '@mui/material';
import { submitDocument } from '../services/api';

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6); transform: scale(1); }
  50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); transform: scale(1.15); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const STEPS = [
  { label: 'Uploading document', icon: '📤' },
  { label: 'Extracting content', icon: '🔍' },
  { label: 'Running AI analysis', icon: '🤖' },
];

const STEP_DURATIONS = [2500, 3500, 0];

export default function UploadDocumentModal({ open, onClose, targets = [], onDocumentSubmitted }) {
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [success, setSuccess] = useState(false);

  const progressRef = useRef(null);
  const stepRef = useRef(null);

  const activeTargets = targets.filter((t) => t.status === 'ACTIVE');

  useEffect(() => {
    if (!loading) return;

    setProgress(0);
    setCurrentStep(0);

    const startTime = Date.now();
    const phase1End = STEP_DURATIONS[0];
    const phase2End = phase1End + STEP_DURATIONS[1];

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (elapsed < phase1End) {
        setProgress(Math.min(28, (elapsed / phase1End) * 28));
        setCurrentStep(0);
      } else if (elapsed < phase2End) {
        const phaseProgress = (elapsed - phase1End) / STEP_DURATIONS[1];
        setProgress(28 + phaseProgress * 42);
        setCurrentStep(1);
      } else {
        setCurrentStep(2);
        setProgress((prev) => Math.min(prev + 0.3, 88));
      }
    }, 60);

    return () => clearInterval(progressRef.current);
  }, [loading]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTargetId) { setError('Please select an active audit target'); return; }
    if (!file) { setError('Please select a file to upload'); return; }

    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      const result = await submitDocument(selectedTargetId, file);
      clearInterval(progressRef.current);
      setProgress(100);
      setCurrentStep(2);
      setSuccess(true);

      setTimeout(() => {
        onDocumentSubmitted(result);
        onClose();
        setSelectedTargetId('');
        setFile(null);
        setLoading(false);
        setProgress(0);
        setCurrentStep(0);
        setSuccess(false);
      }, 1400);
    } catch (err) {
      clearInterval(progressRef.current);
      setError(err.message || 'Failed to submit document');
      setLoading(false);
      setProgress(0);
      setCurrentStep(0);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: '#0D1117',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'text.primary', pb: 1 }}>
        Submit Document for AI Audit
      </DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!loading && (
          <Box component="form" id="upload-document-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Stack spacing={3}>
              <TextField
                label="Select Audit Target Intake"
                select
                fullWidth
                required
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                helperText={activeTargets.length === 0 ? 'No active audit targets. Create one first.' : ''}
              >
                {activeTargets.map((target) => (
                  <MenuItem key={target.id} value={target.id}>
                    {target.name} ({target.documentType})
                  </MenuItem>
                ))}
              </TextField>

              <Box
                sx={{
                  border: '2px dashed rgba(59, 130, 246, 0.3)',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'rgba(59, 130, 246, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#3B82F6',
                    bgcolor: 'rgba(59, 130, 246, 0.08)',
                  },
                }}
                component="label"
              >
                <input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" hidden onChange={handleFileChange} />
                <Typography variant="body1" sx={{ color: 'primary.light', fontWeight: 600, mb: 0.5 }}>
                  {file ? file.name : 'Click to select or drag & drop document'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Supports PDF, PNG, JPG, JPEG, WEBP (Max 10MB)
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {loading && (
          <Box
            sx={{
              mt: 1,
              animation: `${fadeIn} 0.35s ease forwards`,
            }}
          >
            <Stack spacing={3.5}>
              <Stack direction="row" spacing={0} justifyContent="space-between" sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: '12.5%',
                    right: '12.5%',
                    height: 2,
                    bgcolor: 'rgba(148,163,184,0.1)',
                    zIndex: 0,
                  }}
                />
                {STEPS.map((step, idx) => {
                  const done = idx < currentStep || success;
                  const active = idx === currentStep && !success;
                  return (
                    <Stack key={idx} alignItems="center" spacing={1} sx={{ flex: 1, zIndex: 1 }}>
                      <Box
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          transition: 'all 0.4s ease',
                          bgcolor: done
                            ? 'rgba(34, 197, 94, 0.2)'
                            : active
                            ? 'rgba(59, 130, 246, 0.2)'
                            : 'rgba(148, 163, 184, 0.08)',
                          border: done
                            ? '2px solid #22C55E'
                            : active
                            ? '2px solid #3B82F6'
                            : '2px solid rgba(148,163,184,0.15)',
                          color: done ? '#22C55E' : active ? '#3B82F6' : 'text.disabled',
                          animation: active ? `${pulse} 1.6s ease-in-out infinite` : 'none',
                        }}
                      >
                        {done ? '✓' : step.icon}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: done ? '#22C55E' : active ? 'primary.light' : 'text.disabled',
                          fontWeight: active || done ? 700 : 400,
                          fontSize: '0.7rem',
                          textAlign: 'center',
                          transition: 'color 0.4s ease',
                        }}
                      >
                        {step.label}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>

              <Box>
                <Box
                  sx={{
                    position: 'relative',
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(148, 163, 184, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: `${progress}%`,
                      borderRadius: 4,
                      background: success
                        ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
                        : 'linear-gradient(90deg, #1D4ED8, #3B82F6, #06B6D4, #3B82F6, #1D4ED8)',
                      backgroundSize: '200% auto',
                      animation: success ? 'none' : `${shimmer} 2s linear infinite`,
                      transition: 'width 0.3s ease, background 0.5s ease',
                      boxShadow: success
                        ? '0 0 16px rgba(34, 197, 94, 0.5)'
                        : '0 0 16px rgba(59, 130, 246, 0.5)',
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: success ? '#22C55E' : 'primary.light', fontWeight: 600 }}>
                    {success
                      ? '✅ Analysis complete!'
                      : `${STEPS[currentStep]?.label}...`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {Math.round(progress)}%
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        )}
      </DialogContent>

      {!loading && (
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            form="upload-document-form"
            variant="contained"
            color="primary"
            disabled={activeTargets.length === 0 || !file}
          >
            Upload & Trigger AI Audit
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
