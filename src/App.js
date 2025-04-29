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
  Divider,
  Chip,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { EventAvailable, NoteAdd, Check, LocationOn, Info, ArrowBack } from '@mui/icons-material';
import { getCompanyConfig, getCompanyIdFromDomain } from './config/companyConfigs';

function App() {
  // Get company ID from URL parameters or use default
  const [activeStep, setActiveStep] = useState(0);
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [companyConfig, setCompanyConfig] = useState(null);
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');

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
    
    // Update document title with generic title instead of company name
    document.title = "Online Appointment Scheduling Portal";
    
    // Update meta description too
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Online Appointment scheduling portal - Powered by Step Sciences');
    }
    
    // Update Open Graph meta tags if they exist
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Online Appointment Scheduling Portal');
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Online Appointment scheduling portal - Powered by Step Sciences');
    }
    
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
      background: {
        default: '#f9f9f9', // Slight off-white for better eye comfort
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: 16, // Increase base font size
      h4: {
        fontWeight: 700,
        fontSize: '2.2rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.8rem',
      },
      h6: {
        fontSize: '1.4rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1.1rem',
      },
      body2: {
        fontSize: '1rem',
      },
      button: {
        fontSize: '1rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 20px',
          },
          containedPrimary: {
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
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

  // Opens intake form embedded in the page
  const handleIntakeForm = () => {
    if (companyConfig) {
      setShowIntakeForm(true);
    }
  };

  // Handle completion of the intake form
  const handleIntakeFormComplete = () => {
    setShowIntakeForm(false);
    setActiveStep(2);
  };

  // Return to intake form button display
  const handleBackToFormButton = () => {
    setShowIntakeForm(false);
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
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        {/* Header */}
        <AppBar position="static" color="primary" elevation={3}>
          <Toolbar sx={{ minHeight: { xs: 70, sm: 80 }, py: 1 }}>
            {companyConfig.logo && (
              <Box 
                component="img" 
                src={companyConfig.logo} 
                alt={`${companyConfig.name} logo`}
                sx={{ height: 50, mr: 2, display: { xs: 'none', sm: 'block' } }}
              />
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: { xs: '1.3rem', sm: '1.6rem' }, fontWeight: 500 }}>
              {companyConfig.name} Appointment Scheduling
            </Typography>
            
            {/* Step Sciences Logo and Text in Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Box 
                component="img" 
                src="/favicon.ico" 
                alt="Step Sciences logo"
                sx={{ 
                  height: 75, 
                  mr: 1.5,
                  display: { xs: 'none', md: 'block' }
                  // Removed the filter to allow natural yellow color
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  display: { xs: 'none', md: 'block' }, 
                  fontSize: '1.75rem',
                  fontWeight: 500,
                  color: '#F0B537' // Yellow color for Step Sciences text to match logo
                }}
              >
                Step Sciences
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 3, flexGrow: 1 }}>
          {/* Welcome Message */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 4, 
              backgroundColor: 'secondary.light', 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem' }, textAlign: 'center' }}>
              Welcome to {companyConfig.fullName}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
              We're excited to help you with your health and performance needs. Please follow the steps below to book your appointment.
            </Typography>
          </Paper>

          {/* Location Information */}
          {companyConfig.meetingLocation && (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderColor: 'grey.300',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <LocationOn color="primary" sx={{ mt: 0.5, mr: 1, fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
                    Meeting Location
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
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
                        width: 48,
                        height: 48,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: index <= activeStep ? '0 4px 8px rgba(0,0,0,0.2)' : 'none'
                      }}>
                        {step.icon}
                      </Box>
                    )}>
                      <Typography sx={{ mt: 1, fontWeight: index === activeStep ? 600 : 400 }}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
          </Box>

          {/* Current Step Content */}
          <Box sx={{ mb: 4 }}>
            <Card variant="outlined" sx={{ mb: 4, overflow: 'hidden' }}>
              <CardContent sx={{ p: 0 }}>
                {/* Step Header */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 3,
                  borderBottom: '1px solid',
                  borderColor: 'grey.200',
                  bgcolor: 'grey.50'
                }}>
                  <Box sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: 2,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }}>
                    {steps[activeStep].icon}
                  </Box>
                  <Typography variant="h5" component="h2">
                    {steps[activeStep].label}
                  </Typography>
                </Box>

                {/* Step Content */}
                <Box sx={{ p: 3 }}>
                  <Typography variant="body1" sx={{ mb: 3, fontSize: '1.2rem' }}>
                    {steps[activeStep].description}
                  </Typography>

                  {activeStep === 0 && (
                    <Box>
                      <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', fontSize: '1.1rem' }}>
                        Please select an available time slot in the calendar below.
                      </Typography>
                      <Box sx={{ 
                        height: { xs: '600px', md: '700px' }, 
                        border: '1px solid #e0e0e0', 
                        borderRadius: 2, 
                        overflow: 'hidden',
                        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.05)'
                      }}>
                        <iframe
                          title={`${companyConfig.name} Appointment Scheduler`}
                          src={companyConfig.calendarUrl}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={handleAppointmentBooked}
                          sx={{ fontSize: '1.1rem', py: 1.5, px: 4 }}
                        >
                          I've Booked My Appointment
                        </Button>
                      </Box>

                      {/* Special Instructions */}
                      {companyConfig.specialInstructions && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          mt: 4, 
                          p: 3, 
                          bgcolor: 'info.light', 
                          borderRadius: 2 
                        }}>
                          <Info color="info" sx={{ mr: 1, mt: 0.3, fontSize: 24 }} />
                          <Typography variant="body2" color="info.dark" sx={{ fontSize: '1.1rem' }}>
                            <strong>Note:</strong> {companyConfig.specialInstructions}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  {activeStep === 1 && (
                    <Box>
                      {!showIntakeForm ? (
                        <Box>
                          <Typography variant="body1" sx={{ mb: 3, fontSize: '1.2rem' }}>
                            Now that you've booked your appointment, please complete the intake form below.
                            This form will help us prepare for your visit.
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="large"
                              startIcon={<NoteAdd sx={{ fontSize: 24 }} />}
                              onClick={handleIntakeForm}
                              sx={{ fontSize: '1.2rem', py: 1.5, px: 4 }}
                            >
                              Complete Intake Form
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          <Box sx={{ 
                            mb: 2, 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2
                          }}>
                            <Button 
                              variant="outlined" 
                              color="primary" 
                              onClick={handleBackToFormButton}
                              startIcon={<ArrowBack />}
                              sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                            >
                              Back to Instructions
                            </Button>
                            <Button 
                              variant="contained" 
                              color="success"
                              size="large" 
                              onClick={handleIntakeFormComplete}
                              sx={{ 
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                alignSelf: { xs: 'flex-end', sm: 'center' }
                              }}
                            >
                              I've Completed the Form
                            </Button>
                          </Box>
                          <Box sx={{ 
                            height: { xs: '600px', md: '700px' }, 
                            border: '1px solid #e0e0e0', 
                            borderRadius: 2, 
                            overflow: 'hidden',
                            mt: 2
                          }}>
                            <iframe
                              title="Intake Form"
                              src={companyConfig.intakeFormUrl}
                              width="100%"
                              height="100%"
                              frameBorder="0"
                            />
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}

                  {activeStep === 2 && (
                    <Box>
                      <Typography variant="body1" sx={{ mb: 3, fontSize: '1.2rem' }}>
                        Thank you for completing both steps! Your appointment is now fully confirmed.
                      </Typography>
                      <Box sx={{ 
                        p: 3, 
                        backgroundColor: 'success.light', 
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        mb: 4
                      }}>
                        <Check color="success" sx={{ mr: 2, fontSize: 32 }} />
                        <Typography variant="h6" color="success.dark" sx={{ fontWeight: 500 }}>
                          You're all set! We look forward to seeing you at your scheduled time.
                        </Typography>
                      </Box>
                      
                      {/* Meeting Location Reminder */}
                      {companyConfig.meetingLocation && (
                        <Box sx={{ 
                          p: 3, 
                          bgcolor: 'background.paper', 
                          border: '1px solid', 
                          borderColor: 'primary.light',
                          borderRadius: 2,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                        }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                            Appointment Details:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocationOn fontSize="medium" sx={{ mr: 1.5 }} color="primary" />
                            <Typography variant="body1" sx={{ fontSize: '1.15rem' }}>
                              <strong>Location:</strong> {companyConfig.meetingLocation}
                            </Typography>
                          </Box>
                          {companyConfig.specialInstructions && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Info fontSize="medium" sx={{ mr: 1.5 }} color="primary" />
                              <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                                <strong>Note:</strong> {companyConfig.specialInstructions}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Need Help Section */}
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderColor: 'grey.300',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.3rem' }}>
              Need Assistance?
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
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
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center' 
            }}>
              {/* Step Sciences Logo in Footer */}
              <Box 
                component="img" 
                src="/favicon.ico" 
                alt="Step Sciences logo"
                sx={{ height: 45, mb: 1.5 }}
              />
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1, fontSize: '1.1rem' }}>
                &copy; {new Date().getFullYear()} Step Sciences
              </Typography>
              
              {companyConfig.showBranding && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                  Powered by Step Sciences | Health and Performance Solutions
                </Typography>
              )}
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;