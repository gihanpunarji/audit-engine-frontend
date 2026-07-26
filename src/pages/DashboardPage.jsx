import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import GlassCard from '../components/GlassCard/GlassCard';
import SeverityBadge from '../components/SeverityBadge/SeverityBadge';
import CreateTargetModal from '../components/CreateTargetModal';
import UploadDocumentModal from '../components/UploadDocumentModal';
import { useAuth } from '../context/AuthContext';
import {
  fetchCurrentUser,
  fetchAuditTargets,
  pauseAuditTarget,
  activateAuditTarget,
  fetchAuditsByTarget,
  fetchAuditFindings,
} from '../services/api';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'targets', label: 'Audit Targets', icon: '🎯' },
  { id: 'uploads', label: 'Document Submissions', icon: '📁' },
  { id: 'findings', label: 'AI Audit Findings', icon: '⚠️' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [userProfile, setUserProfile] = useState(null);
  const [targets, setTargets] = useState([]);
  const [audits, setAudits] = useState([]);
  const [findings, setFindings] = useState([]);
  const [selectedAuditId, setSelectedAuditId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Load User & Targets
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const profile = await fetchCurrentUser();
        setUserProfile(profile);

        if (profile.organizationId) {
          const fetchedTargets = await fetchAuditTargets(profile.organizationId);
          console.log('Fetched targets:', fetchedTargets);
          setTargets(fetchedTargets);

          // Load audits for first active target if exists
          if (fetchedTargets.length > 0) {
            const firstAudits = await fetchAuditsByTarget(fetchedTargets[0].id);
            setAudits(firstAudits);
          }
        }
      } catch (err) {
        setError('Failed to load dashboard data. Please check your backend connection.');
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Refresh targets
  const refreshTargets = async () => {
    if (userProfile?.organizationId) {
      const updated = await fetchAuditTargets(userProfile.organizationId);
      setTargets(updated);
    }
  };

  // Target Status Actions
  const handleToggleTargetStatus = async (target) => {
    try {
      if (target.status === 'ACTIVE') {
        await pauseAuditTarget(target.id);
      } else {
        await activateAuditTarget(target.id);
      }
      refreshTargets();
    } catch (err) {
      alert('Failed to update target status');
    }
  };

  // Select Audit to view Findings
  const handleViewFindings = async (auditId) => {
    try {
      setSelectedAuditId(auditId);
      const auditFindings = await fetchAuditFindings(auditId);
      setFindings(auditFindings);
      setActiveTab('findings');
    } catch (err) {
      alert('Failed to load findings for this audit');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0A0E1A' }}>
      {/* Brand */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#fff',
          }}
        >
          A
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.15rem' }}>
          AuditEngine
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.08)' }} />

      {/* Nav List */}
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => setActiveTab(item.id)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.08)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, fontSize: '1.2rem' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'primary.light' : 'text.secondary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.08)' }} />

      {/* Profile & Logout */}
      <Box sx={{ p: 2.5 }}>
        {userProfile && (
          <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(17, 24, 39, 0.6)' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {userProfile.fName} {userProfile.lName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              {userProfile.email}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={userProfile.role} size="small" color="primary" sx={{ fontSize: '0.65rem', height: 20 }} />
              {userProfile.organizationName && (
                <Chip
                  label={userProfile.organizationName}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.65rem', height: 20 }}
                />
              )}
            </Stack>
          </Box>
        )}
        <Button variant="outlined" color="error" fullWidth onClick={handleLogout} size="small">
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Header */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'rgba(10, 14, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              ☰
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setCreateModalOpen(true)}
            >
              + New Target
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setUploadModalOpen(true)}
            >
              Upload Document
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid rgba(148, 163, 184, 0.08)' },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid rgba(148, 163, 184, 0.08)' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <Stack spacing={4}>
                  {/* Stats Row */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <GlassCard>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                          TOTAL TARGETS
                        </Typography>
                        <Typography variant="h3" sx={{ color: 'primary.light', fontWeight: 800, mt: 1 }}>
                          {targets.length}
                        </Typography>
                      </GlassCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <GlassCard>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                          ACTIVE INTAKES
                        </Typography>
                        <Typography variant="h3" sx={{ color: 'secondary.main', fontWeight: 800, mt: 1 }}>
                          {targets.filter((t) => t.status === 'ACTIVE').length}
                        </Typography>
                      </GlassCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <GlassCard>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                          AUDITS PROCESSED
                        </Typography>
                        <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 800, mt: 1 }}>
                          {audits.length}
                        </Typography>
                      </GlassCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <GlassCard>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                          FLAGGED FINDINGS
                        </Typography>
                        <Typography variant="h3" sx={{ color: 'error.main', fontWeight: 800, mt: 1 }}>
                          {findings.length}
                        </Typography>
                      </GlassCard>
                    </Grid>
                  </Grid>

                  {/* Audit Targets Overview Table */}
                  <Paper sx={{ background: 'rgba(17, 24, 39, 0.6)', borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Audit Targets Intake Summary
                      </Typography>
                      <Button size="small" onClick={() => setActiveTab('targets')}>
                        View All
                      </Button>
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead sx={{ bgcolor: 'rgba(148, 163, 184, 0.04)' }}>
                          <TableRow>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>TARGET NAME</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>TYPE</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>STATUS</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>ACTION</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {targets.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                No audit targets created yet. Click "+ New Target" to create your first document intake point.
                              </TableCell>
                            </TableRow>
                          ) : (
                            targets.slice(0, 5).map((target) => (
                              <TableRow key={target.id} hover>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{target.name}</TableCell>
                                <TableCell><Chip label={target.documentType} size="small" variant="outlined" /></TableCell>
                                <TableCell>
                                  <Chip
                                    label={target.status}
                                    size="small"
                                    color={target.status === 'ACTIVE' ? 'success' : 'warning'}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button size="small" onClick={() => handleToggleTargetStatus(target)}>
                                    {target.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Stack>
              )}

              {/* TAB 2: AUDIT TARGETS */}
              {activeTab === 'targets' && (
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      Configured Audit Targets
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => setCreateModalOpen(true)}>
                      + Create Audit Target
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    {targets.map((target) => (
                      <Grid item xs={12} sm={6} md={4} key={target.id}>
                        <GlassCard>
                          <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {target.name}
                              </Typography>
                              <Chip
                                label={target.status}
                                size="small"
                                color={target.status === 'ACTIVE' ? 'success' : 'warning'}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {target.description || 'No description provided.'}
                            </Typography>
                            <Chip
                              label={`Type: ${target.documentType}`}
                              size="small"
                              variant="outlined"
                              sx={{ alignSelf: 'flex-start' }}
                            />
                            <Divider sx={{ my: 1 }} />
                            <Button
                              variant="outlined"
                              size="small"
                              color={target.status === 'ACTIVE' ? 'warning' : 'success'}
                              onClick={() => handleToggleTargetStatus(target)}
                            >
                              {target.status === 'ACTIVE' ? 'Pause Intake' : 'Activate Intake'}
                            </Button>
                          </Stack>
                        </GlassCard>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              )}

              {/* TAB 3: DOCUMENT SUBMISSIONS */}
              {activeTab === 'uploads' && (
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      Document Submissions
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => setUploadModalOpen(true)}>
                      Upload Document
                    </Button>
                  </Box>

                  <Paper sx={{ background: 'rgba(17, 24, 39, 0.6)', borderRadius: 3, overflow: 'hidden' }}>
                    <TableContainer>
                      <Table>
                        <TableHead sx={{ bgcolor: 'rgba(148, 163, 184, 0.04)' }}>
                          <TableRow>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>FILE NAME</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>TARGET</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>STATUS</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>ACTIONS</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {audits.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                No documents submitted yet. Click "Upload Document" to process a receipt or claim with AI.
                              </TableCell>
                            </TableRow>
                          ) : (
                            audits.map((audit) => (
                              <TableRow key={audit.id} hover>
                                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                                  {audit.originalFileName}
                                </TableCell>
                                <TableCell>{audit.auditTargetName}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={audit.status}
                                    size="small"
                                    color={
                                      audit.status === 'COMPLETED'
                                        ? 'success'
                                        : audit.status === 'PROCESSING'
                                          ? 'info'
                                          : audit.status === 'FAILED'
                                            ? 'error'
                                            : 'warning'
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button size="small" onClick={() => handleViewFindings(audit.id)}>
                                    View Findings
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Stack>
              )}

              {/* TAB 4: FINDINGS */}
              {activeTab === 'findings' && (
                <Stack spacing={3}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    AI-Flagged Audit Findings & Anomalies
                  </Typography>

                  {findings.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      No findings loaded yet. Select a document from Submissions tab or upload a new file to see AI findings.
                    </Alert>
                  ) : (
                    <Grid container spacing={3}>
                      {findings.map((finding) => (
                        <Grid item xs={12} key={finding.id}>
                          <GlassCard>
                            <Stack spacing={1.5}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <SeverityBadge severity={finding.severity.toLowerCase()} />
                                  <Chip label={finding.category} size="small" variant="outlined" />
                                </Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {new Date(finding.createdAt).toLocaleString()}
                                </Typography>
                              </Box>

                              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                {finding.title}
                              </Typography>

                              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                {finding.description}
                              </Typography>

                              {finding.recommendation && (
                                <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: 'rgba(6, 182, 212, 0.08)',
                                    border: '1px solid rgba(6, 182, 212, 0.2)',
                                  }}
                                >
                                  <Typography variant="caption" sx={{ color: 'secondary.light', fontWeight: 700, display: 'block', mb: 0.5 }}>
                                    💡 AI RECOMMENDATION
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                    {finding.recommendation}
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </GlassCard>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Stack>
              )}
            </>
          )}
        </Container>
      </Box>

      {/* Modals */}
      <CreateTargetModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onTargetCreated={() => refreshTargets()}
        organizationId={userProfile?.organizationId}
      />

      <UploadDocumentModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        targets={targets}
        onDocumentSubmitted={(newAudit) => {
          setAudits((prev) => [newAudit, ...prev]);
          setActiveTab('uploads');
        }}
      />
    </Box>
  );
}
