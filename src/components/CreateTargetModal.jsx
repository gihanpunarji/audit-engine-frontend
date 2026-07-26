import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createAuditTarget } from '../services/api';

const DOCUMENT_TYPES = [
  { value: 'RECEIPT', label: 'Receipt' },
  { value: 'WARRANTY_CLAIM', label: 'Warranty Claim' },
  { value: 'APPLICATION_FORM', label: 'Application Form' },
  { value: 'INVOICE', label: 'Invoice' },
  { value: 'CONTRACT', label: 'Contract' },
];

export default function CreateTargetModal({ open, onClose, onTargetCreated, organizationId }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [documentType, setDocumentType] = useState('RECEIPT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newTarget = await createAuditTarget({
        name,
        description,
        documentType,
        organizationId,
      });
      onTargetCreated(newTarget);
      onClose();
      // Reset form
      setName('');
      setDescription('');
      setDocumentType('RECEIPT');
    } catch (err) {
      setError(err.message || 'Failed to create audit target');
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
        Create Audit Target
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" id="create-target-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Target Name"
              placeholder="e.g. Q3 Expense Receipts"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Document Type"
              select
              fullWidth
              required
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              {DOCUMENT_TYPES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Description"
              placeholder="Intake point details and compliance rules summary"
              multiline
              rows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="create-target-form"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Target'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
