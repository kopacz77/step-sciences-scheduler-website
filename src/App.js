import { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { EventAvailable, NoteAdd, Check, LocationOn, Info } from '@mui/icons-material';
import { getCompanyConfig, getCompanyIdFromDomain } from './config/companyConfigs';

function App() {
  // Get company ID from URL parameters or use default
  const [activeStep, setActiveStep] = useState(0);
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [companyConfig, setCompanyConfig] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    // First check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let companyId = urlParams.get('company');
    
    // If no company in URL, detect from domain
    if (!companyId) {
      companyId = getCompanyIdFromDomain();
    }
    
    const config = getCompanyConfig(companyId);
    setCompanyConfig(config);
    
    // Update document title with company name
    document.title = `${config.name} Appointment Scheduling`;
    
    // Check if there's a status parameter (could be set by the calendar)
    const status = urlParams.get('status');
    if (status === 'booked') {
      setAppointmentBooked(true);
      setActiveStep(1);
    }

    // Check localStorage for appointment status
    const storedBookingStatus = localStorage.getItem('appointmentBooked');
    if (storedBookingStatus === 'true') {
      setAppointmentBooked(true);
      setActiveStep(1);
    }
  }, []);

  // Create theme based on company config
  const theme = companyConfig ? createTheme({
    palette: {
      primary: {
        main: companyConfig.primaryColor,
      },
      secondary: {
        main: companyConfig.secondaryColor,
      },
    },
    typography: {
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
    },
  }) : createTheme();

  // Handle when an appointment is booked
  const handleAppointmentBooked = () => {
    setAppointmentBooked(true);
    setActiveStep(1);
    // Store booking status in localStorage
    localStorage.setItem('appointmentBooked', 'true');
  };

  // Opens intake web app in a new tab
  const handleIntakeForm = () => {
    if (companyConfig) {
      window.open(companyConfig.intakeFormUrl, '_blank');
      setActiveStep(2);
    }
  };

  // Define steps for the appointment process
  const steps = [
    { 
      label: 'Schedule Appointment', 
      icon: <EventAvailable />,
      description: 'Select an available time slot that works for you.'
    },
    { 
      label: 'Complete Intake Form', 
      icon: <NoteAdd />,
      description: 'Fill out the required intake information.'
    },
    { 
      label: 'All Set!', 
      icon: <Check />,
      description: 'Your appointment is confirmed and you\'re ready to go.'
    },
  ];

  // If config isn't loaded yet, show loading
  if (!companyConfig) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="static" color="primary" elevation={3}>
          <Toolbar>
            {companyConfig.logo && (
              <Box 
                component="img" 
                src={companyConfig.logo} 
                alt={`${companyConfig.name} logo`}
                sx={{ height: 40, mr: 2, display: { xs: 'none', sm: 'block' } }}
              />
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {companyConfig.name} Appointment Scheduling
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
          {/* Welcome Message */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'secondary.light', borderRadius: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Welcome to {companyConfig.fullName}
            </Typography>
            <Typography variant="body1">
              We're excited to help you with your health and performance needs. Please follow the steps below to book your appointment.
            </Typography>
          </Paper>

          {/* Location Information */}
          {companyConfig.meetingLocation && (
            <Paper variant="outlined" sx={{ p: 2, mb: 4, borderColor: 'grey.300' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationOn color="primary" sx={{ mt: 0.5, mr: 1 }} />
                <Box>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Meeting Location
                  </Typography>
                  <Typography variant="body2">
                    {companyConfig.meetingLocation}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Stepper */}
          <Box sx={{ mb: 4 }}>
            {isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="div" sx={{ mr: 1 }}>
                  Step {activeStep + 1} of {steps.length}:
                </Typography>
                <Typography variant="h6" color="primary">
                  {steps[activeStep].label}
                </Typography>
              </Box>
            ) : (
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel StepIconComponent={() => (
                      <Box sx={{ 
                        backgroundColor: index <= activeStep ? 'primary.main' : 'grey.400',
                        color: 'white',
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        {step.icon}
                      </Box>
                    )}>
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
          </Box>

          {/* Current Step Content */}
          <Box sx={{ mb: 4 }}>
            <Card variant="outlined" sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: 2
                  }}>
                    {steps[activeStep].icon}
                  </Box>
                  <Typography variant="h5" component="h2">
                    {steps[activeStep].label}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {steps[activeStep].description}
                </Typography>

                {activeStep === 0 && (
                  <>
                    <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                      Please select an available time slot in the calendar below.
                    </Typography>
                    <Box sx={{ height: '600px', border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
                      <iframe
                        title={`${companyConfig.name} Appointment Scheduler`}
                        src={companyConfig.calendarUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleAppointmentBooked}
                      >
                        I've Booked My Appointment
                      </Button>
                    </Box>

                    {/* Special Instructions */}
                    {companyConfig.specialInstructions && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        mt: 3, 
                        p: 2, 
                        bgcolor: 'info.light', 
                        borderRadius: 1 
                      }}>
                        <Info color="info" sx={{ mr: 1, mt: 0.3 }} />
                        <Typography variant="body2" color="info.dark">
                          <strong>Note:</strong> {companyConfig.specialInstructions}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}

                {activeStep === 1 && (
                  <>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                      Now that you've booked your appointment, please complete the intake form by clicking the button below.
                      This form will help us prepare for your visit.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<NoteAdd />}
                        onClick={handleIntakeForm}
                      >
                        Complete Intake Form
                      </Button>
                    </Box>
                  </>
                )}

                {activeStep === 2 && (
                  <>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Thank you for completing both steps! Your appointment is now fully confirmed.
                    </Typography>
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: 'success.light', 
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <Check color="success" sx={{ mr: 1 }} />
                      <Typography variant="body1" color="success.dark">
                        You're all set! We look forward to seeing you at your scheduled time.
                      </Typography>
                    </Box>
                    
                    {/* Meeting Location Reminder */}
                    {companyConfig.meetingLocation && (
                      <Box sx={{ 
                        mt: 3, 
                        p: 2, 
                        bgcolor: 'background.paper', 
                        border: '1px solid', 
                        borderColor: 'primary.light',
                        borderRadius: 1
                      }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Appointment Details:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn fontSize="small" sx={{ mr: 1 }} color="primary" />
                          <Typography variant="body2">
                            <strong>Location:</strong> {companyConfig.meetingLocation}
                          </Typography>
                        </Box>
                        {companyConfig.specialInstructions && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Info fontSize="small" sx={{ mr: 1 }} color="primary" />
                            <Typography variant="body2">
                              <strong>Note:</strong> {companyConfig.specialInstructions}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Need Help Section */}
          <Paper variant="outlined" sx={{ p: 2, mb: 4, borderColor: 'grey.300' }}>
            <Typography variant="h6" gutterBottom>
              Need Assistance?
            </Typography>
            <Typography variant="body2">
              If you have any questions or need help with the scheduling process, please contact us at{' '}
              <Box component="span" sx={{ fontWeight: 'bold' }}>
                {companyConfig.contactEmail}
              </Box>
            </Typography>
          </Paper>
        </Container>

        {/* Footer */}
        <Box sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: 'grey.100',
          borderTop: '1px solid',
          borderColor: 'grey.300'
        }}>
          <Container maxWidth="md">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  &copy; {new Date().getFullYear()} Step Sciences
                </Typography>
              </Grid>
              {companyConfig.showBranding && (
                <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography variant="body2" color="text.secondary">
                    Powered by Step Sciences
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;