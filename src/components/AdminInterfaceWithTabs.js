import {
  Add as AddIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Visibility as PreviewIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  LocationOn as LocationIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
// All database operations now go through API endpoints

// Format client data for database
const formatCompanyForDatabase = (company) => ({
  id: company.id?.toLowerCase().trim(),
  name: company.name?.trim(),
  full_name: company.fullName?.trim(),
  primary_color: company.primaryColor || '#000000',
  secondary_color: company.secondaryColor || '#D4AF37',
  logo: company.logo || '/logos/default-logo.png',
  calendar_url: company.calendarUrl?.trim(),
  intake_form_url: company.intakeFormUrl?.trim(),
  contact_email: company.contactEmail?.trim() || 'info@stepsciences.com',
  show_branding: Boolean(company.showBranding ?? true),
  meeting_location: company.meetingLocation?.trim() || null,
  monday_location: company.scanDayLocations?.monday?.trim() || null,
  tuesday_location: company.scanDayLocations?.tuesday?.trim() || null,
  wednesday_location: company.scanDayLocations?.wednesday?.trim() || null,
  thursday_location: company.scanDayLocations?.thursday?.trim() || null,
  friday_location: company.scanDayLocations?.friday?.trim() || null,
  saturday_location: company.scanDayLocations?.saturday?.trim() || null,
  sunday_location: company.scanDayLocations?.sunday?.trim() || null,
  special_instructions: company.specialInstructions?.trim() || null,
  domain: company.domain?.toLowerCase().trim(),
  has_scan_days: Boolean(company.hasScanDays),
  is_active: Boolean(company.isActive ?? true),
  // Landing page fields
  landing_page_enabled: Boolean(company.landingPageEnabled ?? true),
  landing_page_title: company.landingPageTitle?.trim() || null,
  landing_page_subtitle: company.landingPageSubtitle?.trim() || null,
  landing_page_description: company.landingPageDescription?.trim() || null,
  landing_page_features: JSON.stringify(company.landingPageFeatures || []),
  landing_page_cta_text: company.landingPageCtaText?.trim() || null,
  landing_page_background_image: company.landingPageBackgroundImage?.trim() || null,
  landing_page_show_company_logo: Boolean(company.landingPageShowCompanyLogo ?? true),
});

const TabPanel = ({ children, value, index }) => {
  return <div hidden={value !== index}>{value === index && <Box>{children}</Box>}</div>;
};

const AdminInterface = () => {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [availableLogos, setAvailableLogos] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [newFeature, setNewFeature] = useState('');

  // Company form template
  const defaultCompany = {
    id: '',
    name: '',
    fullName: '',
    primaryColor: '#1976d2',
    secondaryColor: '#ffc107',
    logo: '/logos/default-logo.png',
    calendarUrl: '',
    intakeFormUrl: '',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: '',
    scanDayLocations: {
      monday: '',
      friday: '',
    },
    specialInstructions: '',
    localOrganizerMessage: '',
    bookingInstructions: '',
    domain: '',
    hasScanDays: false,
    isActive: true,
    // Landing page fields
    landingPageEnabled: true,
    landingPageTitle: 'Health & Performance Solutions',
    landingPageSubtitle: 'Professional health assessments for your workforce',
    landingPageDescription:
      'Step Sciences partners with leading organizations to provide comprehensive health and performance assessments.',
    landingPageFeatures: [
      'Professional Health Assessments',
      'Workforce Optimization',
      'Expert Analysis',
      'Confidential Results',
    ],
    landingPageCtaText: 'Schedule Your Assessment',
    landingPageBackgroundImage: '',
    landingPageShowCompanyLogo: true,
  };

  useEffect(() => {
    loadCompanies();
    loadAvailableLogos();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/companies');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const companies = await response.json();
      setCompanies(companies);
    } catch (err) {
      console.error('Failed to load companies:', err);
      setError('Failed to load companies: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableLogos = async () => {
    try {
      const response = await fetch('/api/logos');
      if (response.ok) {
        const logos = await response.json();
        setAvailableLogos(logos);
      }
    } catch (err) {
      console.error('Failed to load logos:', err);
    }
  };

  const handleSave = async (company) => {
    // Validation
    const errors = {};
    if (!company.id) errors.id = 'Company ID is required';
    if (!company.name) errors.name = 'Display name is required';
    if (!company.fullName) errors.fullName = 'Full name is required';
    if (!company.calendarUrl) errors.calendarUrl = 'Calendar URL is required';
    if (!company.intakeFormUrl) errors.intakeFormUrl = 'Intake form URL is required';
    if (!company.domain) errors.domain = 'Domain is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const formattedCompany = formatCompanyForDatabase(company);

      // Debug logging
      console.log('Saving company data:', {
        original: company,
        formatted: formattedCompany,
        landingPageFields: {
          enabled: formattedCompany.landing_page_enabled,
          title: formattedCompany.landing_page_title,
          subtitle: formattedCompany.landing_page_subtitle,
          description: formattedCompany.landing_page_description,
          features: formattedCompany.landing_page_features,
        }
      });

      const url = company.id ? `/api/companies/${company.id}` : '/api/companies';
      const method = company.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedCompany),
      });

      if (!response.ok) {
        throw new Error(`Failed to save company: ${response.statusText}`);
      }

      loadCompanies();
      setDialogOpen(false);
    } catch (err) {
      setError('Failed to save company: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        setLoading(true);
        const response = await fetch(`/api/companies/${id}`, { method: 'DELETE' });

        if (!response.ok) {
          throw new Error(`Failed to delete company: ${response.statusText}`);
        }

        loadCompanies();
      } catch (err) {
        setError('Failed to delete company: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const openDialog = (company = null) => {
    setEditingCompany(company || { ...defaultCompany });
    setDialogOpen(true);
    setActiveTab(0);
    setNewFeature('');
  };

  const addFeature = () => {
    if (newFeature.trim() && editingCompany) {
      const features = editingCompany.landingPageFeatures || [];
      setEditingCompany({
        ...editingCompany,
        landingPageFeatures: [...features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    if (editingCompany) {
      const features = [...(editingCompany.landingPageFeatures || [])];
      features.splice(index, 1);
      setEditingCompany({
        ...editingCompany,
        landingPageFeatures: features,
      });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', p: 3 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Company Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openDialog()}
            disabled={loading}
            size="large"
          >
            Add Company
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        <Grid container spacing={3}>
          {companies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company.id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {company.name}
                    </Typography>
                    <Box>
                      <IconButton size="small" onClick={() => openDialog(company)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(company.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {company.fullName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Domain: {company.domain}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={company.isActive ? 'Active' : 'Inactive'}
                      color={company.isActive ? 'success' : 'default'}
                      size="small"
                    />
                    {company.hasScanDays && <Chip label="Scan Days" color="info" size="small" />}
                    {company.landingPageEnabled && (
                      <Chip label="Landing Page" color="secondary" size="small" />
                    )}
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PreviewIcon />}
                    href={`https://${company.domain}`}
                    target="_blank"
                    size="small"
                  >
                    Preview Portal
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Edit/Add Dialog with Tabs */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>{editingCompany?.id ? 'Edit Company' : 'Add New Company'}</DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            {editingCompany && (
              <>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{ mb: 3 }}
                >
                  <Tab label="Basic Info" icon={<SettingsIcon />} iconPosition="start" />
                  <Tab label="Landing Page" icon={<HomeIcon />} iconPosition="start" />
                  <Tab label="Locations" icon={<LocationIcon />} iconPosition="start" />
                  <Tab label="URLs & Settings" icon={<ArticleIcon />} iconPosition="start" />
                </Tabs>

                {/* Tab 0: Basic Info */}
                <TabPanel value={activeTab} index={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company ID *"
                        value={editingCompany.id}
                        onChange={(e) =>
                          setEditingCompany({ ...editingCompany, id: e.target.value })
                        }
                        error={!!validationErrors.id}
                        helperText={
                          validationErrors.id || 'Lowercase letters, numbers, and hyphens only'
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Display Name *"
                        value={editingCompany.name}
                        onChange={(e) =>
                          setEditingCompany({ ...editingCompany, name: e.target.value })
                        }
                        error={!!validationErrors.name}
                        helperText={validationErrors.name}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name *"
                        value={editingCompany.fullName}
                        onChange={(e) =>
                          setEditingCompany({ ...editingCompany, fullName: e.target.value })
                        }
                        error={!!validationErrors.fullName}
                        helperText={validationErrors.fullName}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Primary Color
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                          type="color"
                          value={editingCompany.primaryColor}
                          onChange={(e) =>
                            setEditingCompany({ ...editingCompany, primaryColor: e.target.value })
                          }
                          sx={{ width: 80 }}
                        />
                        <Box
                          sx={{
                            width: 120,
                            height: 50,
                            backgroundColor: editingCompany.primaryColor,
                            border: '2px solid #ccc',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: editingCompany.primaryColor === '#000000' ? 'white' : 'black',
                              fontWeight: 'bold',
                            }}
                          >
                            PRIMARY
                          </Typography>
                        </Box>
                        <TextField
                          value={editingCompany.primaryColor}
                          onChange={(e) =>
                            setEditingCompany({ ...editingCompany, primaryColor: e.target.value })
                          }
                          placeholder="#000000"
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Secondary Color
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                          type="color"
                          value={editingCompany.secondaryColor}
                          onChange={(e) =>
                            setEditingCompany({ ...editingCompany, secondaryColor: e.target.value })
                          }
                          sx={{ width: 80 }}
                        />
                        <Box
                          sx={{
                            width: 120,
                            height: 50,
                            backgroundColor: editingCompany.secondaryColor,
                            border: '2px solid #ccc',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: editingCompany.secondaryColor === '#000000' ? 'white' : 'black',
                              fontWeight: 'bold',
                            }}
                          >
                            SECONDARY
                          </Typography>
                        </Box>
                        <TextField
                          value={editingCompany.secondaryColor}
                          onChange={(e) =>
                            setEditingCompany({ ...editingCompany, secondaryColor: e.target.value })
                          }
                          placeholder="#D4AF37"
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Grid>
                    {/* Logo Upload Section */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Company Logo
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        {/* Current Logo Preview */}
                        {editingCompany.logo && (
                          <Box
                            sx={{
                              width: 100,
                              height: 60,
                              border: '2px solid #e0e0e0',
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'grey.50',
                              overflow: 'hidden',
                            }}
                          >
                            <img
                              src={editingCompany.logo}
                              alt="Company logo"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </Box>
                        )}

                        {/* Upload and Select Options */}
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              id="logo-upload"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file && editingCompany.id) {
                                  try {
                                    // Generate the expected file path
                                    const fileExt = file.name.split('.').pop().toLowerCase();
                                    const safeCompanyId = editingCompany.id.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                                    const expectedPath = `/logos/${safeCompanyId}-logo.${fileExt}`;

                                    // Show instructions to user
                                    const fileName = `${safeCompanyId}-logo.${fileExt}`;
                                    alert(
                                      `To use this logo:\n1. Save the uploaded file as: ${fileName}\n2. Add it to public/logos/ folder\n3. Commit to Git\n\nThe path ${expectedPath} will be saved to the database.`
                                    );

                                    setEditingCompany({ ...editingCompany, logo: expectedPath });
                                  } catch (error) {
                                    alert('Logo upload failed: ' + error.message);
                                  }
                                }
                              }}
                            />
                            <label htmlFor="logo-upload">
                              <Button
                                variant="outlined"
                                component="span"
                                disabled={!editingCompany.id}
                                sx={{ textTransform: 'none' }}
                              >
                                Upload New Logo
                              </Button>
                            </label>

                            <TextField
                              select
                              label="Or choose existing"
                              value={editingCompany.logo || ''}
                              onChange={(e) =>
                                setEditingCompany({ ...editingCompany, logo: e.target.value })
                              }
                              sx={{ minWidth: 180 }}
                              size="small"
                            >
                              {availableLogos.map((logo) => (
                                <MenuItem key={logo.value} value={logo.value}>
                                  {logo.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Box>

                          <TextField
                            fullWidth
                            label="Logo URL (manual entry)"
                            value={editingCompany.logo}
                            onChange={(e) =>
                              setEditingCompany({ ...editingCompany, logo: e.target.value })
                            }
                            placeholder="/logos/company-logo.png"
                            size="small"
                          />

                          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                            Upload: PNG, JPG up to 2MB. Recommended: 200x50px
                            <br />
                            <em>
                              Note: Upload shows instructions. Manually add file to public/logos/ and commit to Git.
                            </em>
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editingCompany.isActive}
                            onChange={(e) =>
                              setEditingCompany({ ...editingCompany, isActive: e.target.checked })
                            }
                          />
                        }
                        label="Active"
                      />
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Tab 1: Landing Page */}
                <TabPanel value={activeTab} index={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editingCompany.landingPageEnabled}
                            onChange={(e) =>
                              setEditingCompany({
                                ...editingCompany,
                                landingPageEnabled: e.target.checked,
                              })
                            }
                            color="primary"
                          />
                        }
                        label="Enable Landing Page"
                      />
                    </Grid>

                    {editingCompany.landingPageEnabled && (
                      <>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Landing Page Title"
                            value={editingCompany.landingPageTitle || ''}
                            onChange={(e) =>
                              setEditingCompany({
                                ...editingCompany,
                                landingPageTitle: e.target.value,
                              })
                            }
                            helperText="Main headline on the landing page"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Landing Page Subtitle"
                            value={editingCompany.landingPageSubtitle || ''}
                            onChange={(e) =>
                              setEditingCompany({
                                ...editingCompany,
                                landingPageSubtitle: e.target.value,
                              })
                            }
                            helperText="Subheading below the main title"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Landing Page Description"
                            value={editingCompany.landingPageDescription || ''}
                            onChange={(e) =>
                              setEditingCompany({
                                ...editingCompany,
                                landingPageDescription: e.target.value,
                              })
                            }
                            helperText="Detailed description of services"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            Features List
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="Add a feature..."
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                              />
                              <Button variant="outlined" onClick={addFeature}>
                                Add
                              </Button>
                            </Box>
                            <List dense>
                              {(editingCompany.landingPageFeatures || []).map((feature, index) => (
                                <ListItem key={`${feature}-${index}`}>
                                  <ListItemText primary={feature} />
                                  <ListItemSecondaryAction>
                                    <IconButton
                                      edge="end"
                                      size="small"
                                      onClick={() => removeFeature(index)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Call to Action Text"
                            value={editingCompany.landingPageCtaText || ''}
                            onChange={(e) =>
                              setEditingCompany({
                                ...editingCompany,
                                landingPageCtaText: e.target.value,
                              })
                            }
                            helperText="Button text (e.g., 'Schedule Your Assessment')"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Background Image URL (optional)"
                            value={editingCompany.landingPageBackgroundImage || ''}
                            onChange={(e) =>
                              setEditingCompany({
                                ...editingCompany,
                                landingPageBackgroundImage: e.target.value,
                              })
                            }
                            helperText="Optional background image for landing page"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={editingCompany.landingPageShowCompanyLogo}
                                onChange={(e) =>
                                  setEditingCompany({
                                    ...editingCompany,
                                    landingPageShowCompanyLogo: e.target.checked,
                                  })
                                }
                              />
                            }
                            label="Show Company Logo on Landing Page"
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </TabPanel>

                {/* Tab 2: Locations */}
                <TabPanel value={activeTab} index={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editingCompany.hasScanDays}
                            onChange={(e) =>
                              setEditingCompany({
                                ...editingCompany,
                                hasScanDays: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Has Scan Days (different locations for different days)"
                      />
                    </Grid>

                    {editingCompany.hasScanDays ? (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Monday Location"
                            value={editingCompany.scanDayLocations?.monday || ''}
                            onChange={(e) =>
                              setEditingCompany({
                                ...editingCompany,
                                scanDayLocations: {
                                  ...editingCompany.scanDayLocations,
                                  monday: e.target.value,
                                },
                              })
                            }
                            multiline
                            rows={2}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Friday Location"
                            value={editingCompany.scanDayLocations?.friday || ''}
                            onChange={(e) =>
                              setEditingCompany({
                                ...editingCompany,
                                scanDayLocations: {
                                  ...editingCompany.scanDayLocations,
                                  friday: e.target.value,
                                },
                              })
                            }
                            multiline
                            rows={2}
                          />
                        </Grid>
                      </>
                    ) : (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Meeting Location"
                          value={editingCompany.meetingLocation || ''}
                          onChange={(e) =>
                            setEditingCompany({
                              ...editingCompany,
                              meetingLocation: e.target.value,
                            })
                          }
                          multiline
                          rows={3}
                          placeholder="e.g., Plant Health Services Building, Main Floor Reception"
                        />
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Special Instructions"
                        value={editingCompany.specialInstructions || ''}
                        onChange={(e) =>
                          setEditingCompany({
                            ...editingCompany,
                            specialInstructions: e.target.value,
                          })
                        }
                        placeholder="e.g., Please bring health card and employee ID"
                        helperText="Instructions shown to employees during booking"
                      />
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Tab 3: URLs & Settings */}
                <TabPanel value={activeTab} index={3}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Domain *"
                        value={editingCompany.domain}
                        onChange={(e) =>
                          setEditingCompany({ ...editingCompany, domain: e.target.value })
                        }
                        error={!!validationErrors.domain}
                        helperText={validationErrors.domain || 'e.g., gmoshawa.stepsciences.com'}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Calendar URL *"
                        value={editingCompany.calendarUrl}
                        onChange={(e) =>
                          setEditingCompany({ ...editingCompany, calendarUrl: e.target.value })
                        }
                        error={!!validationErrors.calendarUrl}
                        helperText={
                          validationErrors.calendarUrl || 'Google Calendar appointment URL'
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Intake Form URL *"
                        value={editingCompany.intakeFormUrl}
                        onChange={(e) =>
                          setEditingCompany({ ...editingCompany, intakeFormUrl: e.target.value })
                        }
                        error={!!validationErrors.intakeFormUrl}
                        helperText={validationErrors.intakeFormUrl || 'URL to the intake form'}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Contact Email"
                        value={editingCompany.contactEmail}
                        onChange={(e) =>
                          setEditingCompany({ ...editingCompany, contactEmail: e.target.value })
                        }
                        type="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editingCompany.showBranding}
                            onChange={(e) =>
                              setEditingCompany({
                                ...editingCompany,
                                showBranding: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Show Step Sciences Branding"
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(editingCompany)}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminInterface;
