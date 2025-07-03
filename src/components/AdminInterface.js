import {
  Add as AddIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Visibility as PreviewIcon,
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
});

const AdminInterface = () => {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [availableLogos, setAvailableLogos] = useState([]);

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
  };

  useEffect(() => {
    loadCompanies();
    loadAvailableLogos();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);

      // Fetch companies from API
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
      console.error('Failed to load available logos:', err);
      // Don't show error to user - just fall back to empty list
    }
  };

  // Validate form fields
  const validateCompany = (company) => {
    const errors = {};

    if (!company.id?.trim()) errors.id = 'Company ID is required';
    if (!company.name?.trim()) errors.name = 'Company name is required';
    if (!company.fullName?.trim()) errors.fullName = 'Full company name is required';
    if (!company.calendarUrl?.trim()) errors.calendarUrl = 'Calendar URL is required';
    if (!company.intakeFormUrl?.trim()) errors.intakeFormUrl = 'Intake form URL is required';
    if (!company.domain?.trim()) errors.domain = 'Domain is required';

    // Basic URL validation - just check if it's a valid URL format
    try {
      if (company.calendarUrl && !company.calendarUrl.startsWith('http')) {
        errors.calendarUrl = 'Must be a valid URL (starting with http:// or https://)';
      }
    } catch (e) {
      errors.calendarUrl = 'Must be a valid URL';
    }

    try {
      if (company.intakeFormUrl && !company.intakeFormUrl.startsWith('http')) {
        errors.intakeFormUrl = 'Must be a valid URL (starting with http:// or https://)';
      }
    } catch (e) {
      errors.intakeFormUrl = 'Must be a valid URL';
    }

    // Validate ID format
    if (company.id && !/^[a-z0-9-]+$/.test(company.id)) {
      errors.id = 'ID must contain only lowercase letters, numbers, and hyphens';
    }

    return errors;
  };

  // Handle logo upload (manual process - add files to Git manually)
  const handleLogoUpload = async (file, companyId) => {
    if (!file) return null;

    try {
      setUploadingLogo(true);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image must be smaller than 2MB');
      }

      // Generate the expected file path
      const fileExt = file.name.split('.').pop().toLowerCase();
      const safeCompanyId = companyId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const expectedPath = `/logos/${safeCompanyId}-logo.${fileExt}`;

      // Show instructions to user
      const fileName = `${safeCompanyId}-logo.${fileExt}`;
      alert(`To use this logo:\n1. Save the uploaded file as: ${fileName}\n2. Add it to public/logos/ folder\n3. Commit to Git\n\nThe path ${expectedPath} will be saved to the database.`);

      return expectedPath;

    } catch (error) {
      console.error('Logo upload error:', error);
      throw error;
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (company) => {
    try {
      setLoading(true);

      // Validate form
      const errors = validateCompany(company);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        throw new Error('Please fix the highlighted fields');
      }

      setValidationErrors({});
      const dbCompany = formatCompanyForDatabase(company);

      // Debug logging
      console.log('Frontend validation passed. Sending data:', {
        originalData: company,
        formattedData: dbCompany,
        calendarUrl: dbCompany.calendar_url,
        intakeFormUrl: dbCompany.intake_form_url,
      });

      // Use API endpoints instead of direct Supabase calls to bypass RLS
      const isUpdate = companies.find((c) => c.id === company.id);
      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch('/api/companies', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbCompany),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Save company error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          sentData: dbCompany,
        });
        throw new Error(
          errorData.error ||
            errorData.errors?.join(', ') ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      await loadCompanies();
      setDialogOpen(false);
      setEditingCompany(null);
      setError(null);
    } catch (err) {
      console.error('Failed to save company:', err);
      setError('Failed to save company: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;

    try {
      setLoading(true);

      // Use API endpoint for delete
      const response = await fetch('/api/companies', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      await loadCompanies();
      setError(null);
    } catch (err) {
      console.error('Failed to delete company:', err);
      setError('Failed to delete company: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (company = null) => {
    setEditingCompany(company || { ...defaultCompany });
    setDialogOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: 'white', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'primary.main',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" sx={{ color: 'white' }}>
                🏭
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Plant Management Center
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage Canadian automotive plant configurations and settings
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Action Bar */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'white', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={`${companies.length} Plants`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              <Typography variant="body2" color="text.secondary">
                Active automotive manufacturing facilities
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openDialog()}
              disabled={loading}
              size="large"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Add New Plant
            </Button>
          </Box>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {companies.map((company) => (
            <Grid item xs={12} md={6} lg={4} key={company.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {company.name}
                      </Typography>
                      {/* Logo Preview */}
                      {company.logo && (
                        <Box
                          sx={{
                            width: 80,
                            height: 40,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.50',
                            overflow: 'hidden',
                            mb: 1,
                          }}
                        >
                          <img
                            src={company.logo}
                            alt={`${company.name} logo`}
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
                    </Box>
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

        {/* Edit/Add Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>{editingCompany?.id ? 'Edit Company' : 'Add New Company'}</DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            {editingCompany && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company ID *"
                    value={editingCompany.id}
                    onChange={(e) => {
                      setEditingCompany({ ...editingCompany, id: e.target.value });
                      if (validationErrors.id) {
                        setValidationErrors({ ...validationErrors, id: null });
                      }
                    }}
                    placeholder="e.g., test-plant"
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
                    onChange={(e) => {
                      setEditingCompany({ ...editingCompany, name: e.target.value });
                      if (validationErrors.name) {
                        setValidationErrors({ ...validationErrors, name: null });
                      }
                    }}
                    placeholder="e.g., Test Plant"
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
                    onChange={(e) => {
                      setEditingCompany({ ...editingCompany, fullName: e.target.value });
                      if (validationErrors.fullName) {
                        setValidationErrors({ ...validationErrors, fullName: null });
                      }
                    }}
                    placeholder="e.g., Test Manufacturing Plant - Test City, ON"
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
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <Box
                          sx={{
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            No Logo
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Upload and Select Options */}
                    <Box>
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
                                const logoPath = await handleLogoUpload(file, editingCompany.id);
                                setEditingCompany({ ...editingCompany, logo: logoPath });
                              } catch (error) {
                                setError('Logo upload failed: ' + error.message);
                              }
                            }
                          }}
                        />
                        <label htmlFor="logo-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            disabled={uploadingLogo || !editingCompany.id}
                            sx={{ textTransform: 'none' }}
                          >
                            {uploadingLogo ? 'Uploading...' : 'Upload New'}
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
                      <Typography variant="caption" display="block" color="text.secondary">
                        Upload: PNG, JPG up to 2MB. Recommended: 200x50px<br />
                        <em>Note: Upload shows instructions. Manually add file to public/logos/ and commit to Git.</em>
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Google Calendar URL *"
                    value={editingCompany.calendarUrl}
                    onChange={(e) => {
                      setEditingCompany({ ...editingCompany, calendarUrl: e.target.value });
                      if (validationErrors.calendarUrl) {
                        setValidationErrors({ ...validationErrors, calendarUrl: null });
                      }
                    }}
                    placeholder="https://calendar.google.com/calendar/u/0/appointments/schedules/..."
                    error={!!validationErrors.calendarUrl}
                    helperText={
                      validationErrors.calendarUrl ||
                      'Any valid URL (Google Calendar, external calendar, etc.)'
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Intake Form URL *"
                    value={editingCompany.intakeFormUrl}
                    onChange={(e) => {
                      setEditingCompany({ ...editingCompany, intakeFormUrl: e.target.value });
                      if (validationErrors.intakeFormUrl) {
                        setValidationErrors({ ...validationErrors, intakeFormUrl: null });
                      }
                    }}
                    placeholder="https://step-sciences.web.app/intake/test/plant"
                    error={!!validationErrors.intakeFormUrl}
                    helperText={
                      validationErrors.intakeFormUrl ||
                      'Any valid URL (Step Sciences forms, external forms, etc.)'
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    value={editingCompany.contactEmail}
                    onChange={(e) =>
                      setEditingCompany({ ...editingCompany, contactEmail: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Domain *"
                    value={editingCompany.domain}
                    onChange={(e) => {
                      setEditingCompany({ ...editingCompany, domain: e.target.value });
                      if (validationErrors.domain) {
                        setValidationErrors({ ...validationErrors, domain: null });
                      }
                    }}
                    placeholder="testplant.stepsciences.com"
                    error={!!validationErrors.domain}
                    helperText={validationErrors.domain || 'Must be a stepsciences.com subdomain'}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingCompany.hasScanDays}
                        onChange={(e) => {
                          const newState = { ...editingCompany, hasScanDays: e.target.checked };
                          if (!e.target.checked) {
                            newState.scanDayLocations = {};
                          } else if (
                            !newState.scanDayLocations ||
                            Object.keys(newState.scanDayLocations).length === 0
                          ) {
                            newState.scanDayLocations = { monday: '', friday: '' };
                          }
                          setEditingCompany(newState);
                        }}
                      />
                    }
                    label="Has Different Locations by Day of Week"
                  />
                </Grid>

                {editingCompany.hasScanDays ? (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Day-Specific Locations
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Select which days have different meeting locations
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        {[
                          'monday',
                          'tuesday',
                          'wednesday',
                          'thursday',
                          'friday',
                          'saturday',
                          'sunday',
                        ].map((day) => (
                          <Grid item xs={12} sm={6} md={4} key={day}>
                            <Paper
                              elevation={1}
                              sx={{
                                p: 2.5,
                                bgcolor:
                                  editingCompany.scanDayLocations &&
                                  editingCompany.scanDayLocations[day] !== undefined
                                    ? 'primary.50'
                                    : 'grey.50',
                                border:
                                  editingCompany.scanDayLocations &&
                                  editingCompany.scanDayLocations[day] !== undefined
                                    ? '1px solid'
                                    : 'none',
                                borderColor: 'primary.200',
                                minHeight: 120,
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      editingCompany.scanDayLocations &&
                                      editingCompany.scanDayLocations[day] !== undefined
                                    }
                                    onChange={(e) => {
                                      const newLocations = {
                                        ...(editingCompany.scanDayLocations || {}),
                                      };
                                      if (e.target.checked) {
                                        newLocations[day] = '';
                                      } else {
                                        delete newLocations[day];
                                      }
                                      setEditingCompany({
                                        ...editingCompany,
                                        scanDayLocations: newLocations,
                                      });
                                    }}
                                    size="small"
                                  />
                                }
                                label={
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="600"
                                    color="text.primary"
                                  >
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                  </Typography>
                                }
                                sx={{ mb: 1, alignSelf: 'flex-start' }}
                              />
                              {editingCompany.scanDayLocations &&
                                editingCompany.scanDayLocations[day] !== undefined && (
                                  <TextField
                                    fullWidth
                                    label="Location Details"
                                    value={editingCompany.scanDayLocations[day] || ''}
                                    onChange={(e) =>
                                      setEditingCompany({
                                        ...editingCompany,
                                        scanDayLocations: {
                                          ...editingCompany.scanDayLocations,
                                          [day]: e.target.value,
                                        },
                                      })
                                    }
                                    multiline
                                    rows={2}
                                    size="small"
                                    variant="outlined"
                                    placeholder="e.g., Building C - Room 101"
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                        fontSize: '0.875rem',
                                      },
                                    }}
                                  />
                                )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Meeting Location"
                      value={editingCompany.meetingLocation || ''}
                      onChange={(e) =>
                        setEditingCompany({ ...editingCompany, meetingLocation: e.target.value })
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
                      setEditingCompany({ ...editingCompany, specialInstructions: e.target.value })
                    }
                    placeholder="e.g., Please bring health card and employee ID. Arrive 10 minutes early."
                    helperText="Instructions shown to employees during the booking process"
                  />
                </Grid>
              </Grid>
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
