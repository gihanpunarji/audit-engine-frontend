import { useState } from 'react';
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
  CircularProgress,
  Stack,
} from '@mui/material';
import { submitDocument } from '../services/api';

export default function UploadDocumentModal({ open, onClose, targets = [], onDocumentSubmitted }) {
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeTargets = targets.filter((t) => t.status === 'ACTIVE');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTargetId) {
      setError('Please select an active audit target');
      return;
    }
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await submitDocument(selectedTargetId, file);
      onDocumentSubmitted(result);
      onClose();
      // Reset form
      setSelectedTargetId('');
      setFile(null);
    } catch (err) {
      setError(err.message || 'Failed to submit document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: '#111827',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'text.primary' }}>
        Submit Document for AI Audit
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" id="upload-document-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Stack spacing={3}>
            <TextField
              label="Select Audit Target Intake"
              select
              fullWidth
              required
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              helperText={activeTargets.length === 0 ? 'No active audit targets found. Please create one first.' : ''}
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
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="upload-document-form"
          variant="contained"
          color="primary"
          disabled={loading || activeTargets.length === 0 || !file}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload & Trigger AI Audit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
