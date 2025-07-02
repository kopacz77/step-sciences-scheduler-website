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
  CircularProgress
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
  friday_location: company.scanDayLocations?.friday?.trim() || null,
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

  const handleSave = async (company) => {
    try {
      setLoading(true);
      const dbCompany = formatCompanyForDatabase(company);
      
      // Validate required fields
      if (!dbCompany.id || !dbCompany.name || !dbCompany.calendar_url || !dbCompany.intake_form_url) {
        throw new Error('Please fill in all required fields');
      }

      let result;
      if (companies.find(c => c.id === company.id)) {
        // Update existing company
        const { data, error } = await supabase
          .from('companies')
          .update(dbCompany)
          .eq('id', company.id)
          .select()
          .single();
        
        if (error) throw new Error(error.message);
        result = data;
      } else {
        // Insert new company
        const { data, error } = await supabase
          .from('companies')
          .insert([dbCompany])
          .select()
          .single();
        
        if (error) throw new Error(error.message);
        result = data;
      }

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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Company Portal Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openDialog()}
          disabled={loading}
        >
          Add New Company
        </Button>
      </Box>

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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCompany?.id ? 'Edit Company' : 'Add New Company'}
        </DialogTitle>
        <DialogContent>
          {editingCompany && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company ID"
                  value={editingCompany.id}
                  onChange={(e) => setEditingCompany({...editingCompany, id: e.target.value})}
                  placeholder="e.g., gm-windsor"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={editingCompany.name}
                  onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})}
                  placeholder="e.g., GM Windsor"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={editingCompany.fullName}
                  onChange={(e) => setEditingCompany({...editingCompany, fullName: e.target.value})}
                  placeholder="e.g., General Motors Windsor Engine Plant"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Primary Color"
                  type="color"
                  value={editingCompany.primaryColor}
                  onChange={(e) => setEditingCompany({...editingCompany, primaryColor: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Secondary Color"
                  type="color"
                  value={editingCompany.secondaryColor}
                  onChange={(e) => setEditingCompany({...editingCompany, secondaryColor: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Google Calendar URL"
                  value={editingCompany.calendarUrl}
                  onChange={(e) => setEditingCompany({...editingCompany, calendarUrl: e.target.value})}
                  placeholder="https://calendar.google.com/..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Intake Form URL"
                  value={editingCompany.intakeFormUrl}
                  onChange={(e) => setEditingCompany({...editingCompany, intakeFormUrl: e.target.value})}
                  placeholder="https://step-sciences.web.app/intake/..."
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
                  label="Domain"
                  value={editingCompany.domain}
                  onChange={(e) => setEditingCompany({...editingCompany, domain: e.target.value})}
                  placeholder="company.stepsciences.com"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editingCompany.hasScanDays}
                      onChange={(e) => setEditingCompany({...editingCompany, hasScanDays: e.target.checked})}
                    />
                  }
                  label="Has Different Locations for Monday/Friday"
                />
              </Grid>

              {editingCompany.hasScanDays ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Monday Location"
                      value={editingCompany.scanDayLocations.monday}
                      onChange={(e) => setEditingCompany({
                        ...editingCompany,
                        scanDayLocations: {...editingCompany.scanDayLocations, monday: e.target.value}
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Friday Location"
                      value={editingCompany.scanDayLocations.friday}
                      onChange={(e) => setEditingCompany({
                        ...editingCompany,
                        scanDayLocations: {...editingCompany.scanDayLocations, friday: e.target.value}
                      })}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Meeting Location"
                    value={editingCompany.meetingLocation || ''}
                    onChange={(e) => setEditingCompany({...editingCompany, meetingLocation: e.target.value})}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Special Instructions"
                  value={editingCompany.specialInstructions}
                  onChange={(e) => setEditingCompany({...editingCompany, specialInstructions: e.target.value})}
                  placeholder="e.g., Please bring health card and ID..."
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
  );
};

export default AdminInterface;