import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Paper,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as PreviewIcon
} from '@mui/icons-material';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://cabtsqukaofxofsufaui.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYnRzcXVrYW9meG9mc3VmYXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjQwMzksImV4cCI6MjA2NzA0MDAzOX0.bjITY67lM0h4wWdpEpqvZCOhZuj-lLhF-PS65_6SyDk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Format database row to client format
const formatCompanyForClient = (row) => ({
  id: row.id,
  name: row.name,
  fullName: row.full_name,
  primaryColor: row.primary_color,
  secondaryColor: row.secondary_color,
  logo: row.logo,
  calendarUrl: row.calendar_url,
  intakeFormUrl: row.intake_form_url,
  contactEmail: row.contact_email,
  showBranding: Boolean(row.show_branding),
  meetingLocation: row.meeting_location,
  scanDayLocations: {
    monday: row.monday_location,
    friday: row.friday_location
  },
  specialInstructions: row.special_instructions,
  domain: row.domain,
  hasScanDays: Boolean(row.has_scan_days),
  isActive: Boolean(row.is_active)
});

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
  is_active: Boolean(company.isActive ?? true)
});

const AdminInterface = () => {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

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
      friday: ''
    },
    specialInstructions: '',
    localOrganizerMessage: '',
    bookingInstructions: '',
    domain: '',
    hasScanDays: false,
    isActive: true
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      
      // Fetch companies from Supabase
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw new Error(error.message);
      }

      const formattedCompanies = data.map(formatCompanyForClient);
      setCompanies(formattedCompanies);
    } catch (err) {
      console.error('Failed to load companies:', err);
      setError('Failed to load companies: ' + err.message);
    } finally {
      setLoading(false);
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

      // Use API endpoints instead of direct Supabase calls to bypass RLS
      const isUpdate = companies.find(c => c.id === company.id);
      const url = isUpdate ? `/api/companies/${company.id}` : '/api/companies';
      const method = isUpdate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbCompany)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Save company error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          sentData: dbCompany
        });
        throw new Error(errorData.error || errorData.errors?.join(', ') || `HTTP ${response.status}: ${response.statusText}`);
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
      
      // Soft delete - set is_active to false
      const { error } = await supabase
        .from('companies')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw new Error(error.message);
      
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
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'grey.50',
      py: 4
    }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: 'white', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
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
                fontSize: '1rem'
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{company.name}</Typography>
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
                  {company.hasScanDays && (
                    <Chip label="Scan Days" color="info" size="small" />
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

      {/* Edit/Add Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingCompany?.id ? 'Edit Company' : 'Add New Company'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {editingCompany && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company ID *"
                  value={editingCompany.id}
                  onChange={(e) => {
                    setEditingCompany({...editingCompany, id: e.target.value});
                    if (validationErrors.id) {
                      setValidationErrors({...validationErrors, id: null});
                    }
                  }}
                  placeholder="e.g., test-plant"
                  error={!!validationErrors.id}
                  helperText={validationErrors.id || "Lowercase letters, numbers, and hyphens only"}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Display Name *"
                  value={editingCompany.name}
                  onChange={(e) => {
                    setEditingCompany({...editingCompany, name: e.target.value});
                    if (validationErrors.name) {
                      setValidationErrors({...validationErrors, name: null});
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
                    setEditingCompany({...editingCompany, fullName: e.target.value});
                    if (validationErrors.fullName) {
                      setValidationErrors({...validationErrors, fullName: null});
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
                    onChange={(e) => setEditingCompany({...editingCompany, primaryColor: e.target.value})}
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
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="caption" sx={{ 
                      color: editingCompany.primaryColor === '#000000' ? 'white' : 'black',
                      fontWeight: 'bold'
                    }}>
                      PRIMARY
                    </Typography>
                  </Box>
                  <TextField
                    value={editingCompany.primaryColor}
                    onChange={(e) => setEditingCompany({...editingCompany, primaryColor: e.target.value})}
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
                    onChange={(e) => setEditingCompany({...editingCompany, secondaryColor: e.target.value})}
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
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="caption" sx={{ 
                      color: editingCompany.secondaryColor === '#000000' ? 'white' : 'black',
                      fontWeight: 'bold'
                    }}>
                      SECONDARY
                    </Typography>
                  </Box>
                  <TextField
                    value={editingCompany.secondaryColor}
                    onChange={(e) => setEditingCompany({...editingCompany, secondaryColor: e.target.value})}
                    placeholder="#D4AF37"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Google Calendar URL *"
                  value={editingCompany.calendarUrl}
                  onChange={(e) => {
                    setEditingCompany({...editingCompany, calendarUrl: e.target.value});
                    if (validationErrors.calendarUrl) {
                      setValidationErrors({...validationErrors, calendarUrl: null});
                    }
                  }}
                  placeholder="https://calendar.google.com/calendar/u/0/appointments/schedules/..."
                  error={!!validationErrors.calendarUrl}
                  helperText={validationErrors.calendarUrl || "Any valid URL (Google Calendar, external calendar, etc.)"}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Intake Form URL *"
                  value={editingCompany.intakeFormUrl}
                  onChange={(e) => {
                    setEditingCompany({...editingCompany, intakeFormUrl: e.target.value});
                    if (validationErrors.intakeFormUrl) {
                      setValidationErrors({...validationErrors, intakeFormUrl: null});
                    }
                  }}
                  placeholder="https://step-sciences.web.app/intake/test/plant"
                  error={!!validationErrors.intakeFormUrl}
                  helperText={validationErrors.intakeFormUrl || "Any valid URL (Step Sciences forms, external forms, etc.)"}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  value={editingCompany.contactEmail}
                  onChange={(e) => setEditingCompany({...editingCompany, contactEmail: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Domain *"
                  value={editingCompany.domain}
                  onChange={(e) => {
                    setEditingCompany({...editingCompany, domain: e.target.value});
                    if (validationErrors.domain) {
                      setValidationErrors({...validationErrors, domain: null});
                    }
                  }}
                  placeholder="testplant.stepsciences.com"
                  error={!!validationErrors.domain}
                  helperText={validationErrors.domain || "Must be a stepsciences.com subdomain"}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingCompany.hasScanDays}
                      onChange={(e) => {
                        const newState = {...editingCompany, hasScanDays: e.target.checked};
                        if (!e.target.checked) {
                          newState.scanDayLocations = {};
                        } else if (!newState.scanDayLocations || Object.keys(newState.scanDayLocations).length === 0) {
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
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                        <Grid item xs={12} sm={6} md={4} key={day}>
                          <Paper 
                            elevation={1} 
                            sx={{ 
                              p: 2.5, 
                              bgcolor: editingCompany.scanDayLocations && editingCompany.scanDayLocations[day] !== undefined ? 'primary.50' : 'grey.50',
                              border: editingCompany.scanDayLocations && editingCompany.scanDayLocations[day] !== undefined ? '1px solid' : 'none',
                              borderColor: 'primary.200',
                              minHeight: 120,
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={editingCompany.scanDayLocations && editingCompany.scanDayLocations[day] !== undefined}
                                  onChange={(e) => {
                                    const newLocations = {...(editingCompany.scanDayLocations || {})};
                                    if (e.target.checked) {
                                      newLocations[day] = '';
                                    } else {
                                      delete newLocations[day];
                                    }
                                    setEditingCompany({...editingCompany, scanDayLocations: newLocations});
                                  }}
                                  size="small"
                                />
                              }
                              label={
                                <Typography variant="subtitle2" fontWeight="600" color="text.primary">
                                  {day.charAt(0).toUpperCase() + day.slice(1)}
                                </Typography>
                              }
                              sx={{ mb: 1, alignSelf: 'flex-start' }}
                            />
                            {editingCompany.scanDayLocations && editingCompany.scanDayLocations[day] !== undefined && (
                              <TextField
                                fullWidth
                                label="Location Details"
                                value={editingCompany.scanDayLocations[day] || ''}
                                onChange={(e) => setEditingCompany({
                                  ...editingCompany,
                                  scanDayLocations: {...editingCompany.scanDayLocations, [day]: e.target.value}
                                })}
                                multiline
                                rows={2}
                                size="small"
                                variant="outlined"
                                placeholder="e.g., Building C - Room 101"
                                sx={{ 
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'white',
                                    fontSize: '0.875rem'
                                  }
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
                    onChange={(e) => setEditingCompany({...editingCompany, meetingLocation: e.target.value})}
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
                  onChange={(e) => setEditingCompany({...editingCompany, specialInstructions: e.target.value})}
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