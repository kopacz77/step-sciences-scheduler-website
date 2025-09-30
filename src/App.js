import {
  Check,
  EventAvailable,
  ExpandLess,
  ExpandMore,
  Info,
  LocationOn,
  NoteAdd,
  Refresh,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Container,
  Fab,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCompanyConfig,
  getCompanyIdFromDomain,
  validateUrlParams,
} from './config/dynamicCompanyConfigs';

// Import components
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ScanDayLocationInfo from './components/ScanDayLocationInfo';
import StepContent from './components/StepContent';

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [companyConfig, setCompanyConfig] = useState(null);
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const loadCompanyConfig = async () => {
      try {
        // Validate and sanitize URL parameters
        const validatedParams = validateUrlParams();

        // Get company configuration with validation
        let companyId = validatedParams.company;
        if (!companyId) {
          companyId = await getCompanyIdFromDomain();
        }

        const config = await getCompanyConfig(companyId);
        setCompanyConfig(config);

        // Update document metadata (XSS safe)
        document.title = 'Online Appointment Scheduling Portal';

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute(
            'content',
            'Online Appointment scheduling portal - Powered by Step Sciences'
          );
        }

        // Check if we should skip landing page (direct links, return users, etc.)
        const shouldSkipLanding =
          validatedParams.status === 'booked' ||
          validatedParams.reset === true ||
          localStorage.getItem('appointmentBooked') === 'true' ||
          localStorage.getItem('intakeFormCompleted') === 'true' ||
          validatedParams.direct === 'true' ||
          !config.landingPageEnabled;

        if (shouldSkipLanding) {
          setShowLandingPage(false);
        }

        // Check for existing booking status (validated)
        if (validatedParams.status === 'booked') {
          setAppointmentBooked(true);
          setActiveStep(1);
        }

        // Check for reset parameter (validated)
        if (validatedParams.reset === true) {
          // Clear localStorage and reset state
          localStorage.removeItem('appointmentBooked');
          localStorage.removeItem('intakeFormCompleted');
          localStorage.removeItem('landingPageSeen');
          setAppointmentBooked(false);
          setActiveStep(0);
          setShowIntakeForm(false);
          setShowLandingPage(true);

          // Clean URL by removing reset parameter
          const newUrl = new URL(window.location);
          newUrl.searchParams.delete('reset');
          window.history.replaceState({}, '', newUrl);
          return;
        }

        // Check localStorage with validation
        const storedBookingStatus = localStorage.getItem('appointmentBooked');
        if (storedBookingStatus === 'true') {
          setAppointmentBooked(true);
          setActiveStep(1);
        }
      } catch (error) {
        console.error('Failed to load company configuration:', error);
        // Set fallback config or show error message
      }
    };

    loadCompanyConfig();
  }, []);

  // Memoized theme creation to prevent recreation on every render
  const theme = useMemo(() => {
    if (!companyConfig) {
      return createTheme();
    }

    return createTheme({
      palette: {
        primary: { main: companyConfig.primaryColor },
        secondary: { main: companyConfig.secondaryColor },
        background: { default: '#f9f9f9', paper: '#ffffff' },
      },
      typography: {
        fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: 16,
        h4: { fontWeight: 700, fontSize: { xs: '1.6rem', sm: '2.2rem' } },
        h5: { fontWeight: 600, fontSize: { xs: '1.4rem', sm: '1.8rem' } },
        h6: { fontSize: { xs: '1.2rem', sm: '1.4rem' }, fontWeight: 500 },
        body1: { fontSize: { xs: '1rem', sm: '1.1rem' } },
        body2: { fontSize: { xs: '0.9rem', sm: '1rem' } },
        button: { fontSize: { xs: '0.95rem', sm: '1rem' }, fontWeight: 500 },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: { borderRadius: 8, padding: { xs: '8px 16px', sm: '10px 20px' } },
            containedPrimary: { '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.2)' } },
          },
        },
        MuiCard: {
          styleOverrides: { root: { borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } },
        },
        MuiPaper: {
          styleOverrides: { root: { borderRadius: 12 } },
        },
      },
    });
  }, [companyConfig]);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleAppointmentBooked = useCallback(() => {
    setAppointmentBooked(true);
    setActiveStep(1);
    localStorage.setItem('appointmentBooked', 'true');
  }, []);

  const handleIntakeForm = useCallback(() => {
    if (companyConfig) setShowIntakeForm(true);
  }, [companyConfig]);

  const handleIntakeFormComplete = useCallback(() => {
    setShowIntakeForm(false);
    setActiveStep(2);
    localStorage.setItem('intakeFormCompleted', 'true');
  }, []);

  const handleBackToFormButton = useCallback(() => {
    setShowIntakeForm(false);
  }, []);

  // Landing page navigation
  const handleNavigateToScheduler = useCallback(() => {
    setShowLandingPage(false);
    localStorage.setItem('landingPageSeen', 'true');
    window.scrollTo(0, 0);
  }, []);

  // Reset function
  const handleStartOver = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('appointmentBooked');
    localStorage.removeItem('intakeFormCompleted');
    localStorage.removeItem('landingPageSeen');

    // Reset all state
    setAppointmentBooked(false);
    setActiveStep(0);
    setShowIntakeForm(false);
    setShowLandingPage(companyConfig?.landingPageEnabled || false);

    // Scroll to top
    window.scrollTo(0, 0);
  }, [companyConfig?.landingPageEnabled]);

  // Memoized steps array to prevent recreation on every render
  const steps = useMemo(
    () => [
      {
        label: 'Schedule Appointment',
        icon: <EventAvailable />,
        description: 'Select an available time slot that works for you.',
      },
      {
        label: 'Complete Intake Form',
        icon: <NoteAdd />,
        description: 'Fill out the required intake information.',
      },
      {
        label: 'All Set!',
        icon: <Check />,
        description: "Your appointment is confirmed and you're ready to go.",
      },
    ],
    []
  );

  // Loading state
  if (!companyConfig) {
    return (
      <Container
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      {showLandingPage && companyConfig?.landingPageEnabled ? (
        <LandingPage
          companyConfig={companyConfig}
          onNavigateToScheduler={handleNavigateToScheduler}
        />
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: 'background.default',
          }}
        >
          {/* Enhanced Header with Navigation */}
          <Header
            companyConfig={companyConfig}
            showBackButton={activeStep > 0 && showIntakeForm}
            onBackClick={() => setShowIntakeForm(false)}
            currentStep={activeStep + 1}
            totalSteps={3}
          />

          <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 }, flexGrow: 1 }}>
            {/* Mobile-Optimized Welcome Message */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 4 },
                mb: { xs: 2, sm: 4 },
                backgroundColor: 'secondary.light',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
                Welcome to {companyConfig.fullName}
              </Typography>
              {!isMobile && (
                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                  We're excited to help you with your health and performance needs. Please follow
                  the steps below to book your appointment.
                </Typography>
              )}
            </Paper>

            {/* Compact Process Flow Alert for Mobile */}
            <Alert
              severity={isMobile ? 'warning' : 'info'}
              sx={{
                mb: { xs: 2, sm: 4 },
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                '& .MuiAlert-message': { fontSize: { xs: '0.95rem', sm: '1.1rem' } },
                ...(isMobile && {
                  border: '2px solid',
                  borderColor: 'warning.main',
                  backgroundColor: 'warning.light',
                }),
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: isMobile ? 700 : 500, textAlign: isMobile ? 'center' : 'left' }}
              >
                <strong>{isMobile ? '🚨 BOTH STEPS MANDATORY:' : 'Important:'}</strong>{' '}
                {isMobile
                  ? '1️⃣ Book appointment → 2️⃣ Complete intake form. DO NOT STOP after step 1!'
                  : 'Please complete both steps below - first book your appointment, then fill out the intake form. Both are required for your visit.'}
              </Typography>
            </Alert>

            {/* Collapsible Location Information for Mobile */}
            {companyConfig.hasScanDays ? (
              <ScanDayLocationInfo companyConfig={companyConfig} />
            ) : (
              companyConfig.meetingLocation && (
                <Paper
                  variant="outlined"
                  sx={{
                    mb: { xs: 2, sm: 4 },
                    borderColor: 'grey.300',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  {isMobile ? (
                    // Collapsible version for mobile
                    <Box>
                      <Box
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                        }}
                        onClick={() => setShowLocationDetails(!showLocationDetails)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn color="primary" sx={{ mr: 1, fontSize: 24 }} />
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}
                          >
                            Meeting Location
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          {showLocationDetails ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                      <Collapse in={showLocationDetails}>
                        <Box sx={{ p: 2, pt: 0, textAlign: 'center' }}>
                          <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                            {companyConfig.meetingLocation}
                          </Typography>
                        </Box>
                      </Collapse>
                    </Box>
                  ) : (
                    // Full version for desktop
                    <Box
                      sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
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
                  )}
                </Paper>
              )
            )}

            {/* Compact Stepper for Mobile */}
            <Box sx={{ mb: { xs: 2, sm: 4 } }}>
              {isMobile ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 2,
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontSize: '1.1rem',
                      color: activeStep === 1 ? 'error.main' : 'text.primary',
                      fontWeight: activeStep === 1 ? 700 : 500,
                    }}
                  >
                    Step {activeStep + 1} of {steps.length}: {steps[activeStep].label}
                  </Typography>
                  {activeStep === 1 && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.9rem',
                        color: 'error.main',
                        fontWeight: 600,
                        textAlign: 'center',
                        mt: 0.5,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      ⚠️ INCOMPLETE - ACTION REQUIRED
                    </Typography>
                  )}
                </Box>
              ) : (
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              backgroundColor: index <= activeStep ? 'primary.main' : 'grey.400',
                              color: 'white',
                              borderRadius: '50%',
                              width: 48,
                              height: 48,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              boxShadow: index <= activeStep ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
                            }}
                          >
                            {step.icon}
                          </Box>
                        )}
                      >
                        <Typography sx={{ mt: 1, fontWeight: index === activeStep ? 600 : 400 }}>
                          {step.label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              )}
            </Box>

            {/* Step Content */}
            <StepContent
              activeStep={activeStep}
              steps={steps}
              companyConfig={companyConfig}
              showIntakeForm={showIntakeForm}
              onAppointmentBooked={handleAppointmentBooked}
              onIntakeForm={handleIntakeForm}
              onIntakeFormComplete={handleIntakeFormComplete}
              onBackToForm={handleBackToFormButton}
            />

            {/* Final Step Location Reminder */}
            {activeStep === 2 && (companyConfig.hasScanDays || companyConfig.meetingLocation) && (
              <Box
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'primary.light',
                  borderRadius: 2,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  mb: { xs: 2, sm: 4 },
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 500, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                >
                  Appointment Details:
                </Typography>

                {companyConfig.hasScanDays ? (
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn fontSize="medium" sx={{ mr: 1.5 }} color="success" />
                      <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                        <strong>Monday Location:</strong> {companyConfig.scanDayLocations.monday}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn fontSize="medium" sx={{ mr: 1.5 }} color="info" />
                      <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                        <strong>Friday Location:</strong> {companyConfig.scanDayLocations.friday}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn fontSize="medium" sx={{ mr: 1.5 }} color="primary" />
                    <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                      <strong>Location:</strong> {companyConfig.meetingLocation}
                    </Typography>
                  </Box>
                )}

                {companyConfig.specialInstructions && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Info fontSize="medium" sx={{ mr: 1.5 }} color="primary" />
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
                      <strong>Note:</strong> {companyConfig.specialInstructions}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Start Over Button - Positioned near bottom, before Need Help section */}
            {activeStep === 1 && !showIntakeForm && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: { xs: 3, sm: 4 },
                  mb: { xs: 3, sm: 4 },
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleStartOver}
                  startIcon={<Refresh />}
                  sx={{
                    fontSize: { xs: '0.95rem', sm: '1rem' },
                    py: { xs: 1.5, sm: 1.5 },
                    px: { xs: 2.5, sm: 3 },
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'primary.main',
                      color: 'white',
                    },
                  }}
                >
                  Start Over
                </Button>
              </Box>
            )}

            {/* Compact Need Help Section */}
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2.5, sm: 3 },
                mb: { xs: 2, sm: 4 },
                borderColor: 'grey.300',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem' } }}
              >
                Need Assistance?
              </Typography>
              <Typography variant="body1" sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                {isMobile
                  ? 'Questions? Email us at '
                  : 'If you have any questions or need help with the scheduling process, please contact us at '}
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                  {companyConfig.contactEmail}
                </Box>
              </Typography>
            </Paper>
          </Container>

          {/* Floating Action Button for Start Over (Mobile) - Show on step 1 only */}
          {activeStep === 1 && !showIntakeForm && isMobile && (
            <Fab
              color="primary"
              aria-label="start over"
              onClick={handleStartOver}
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 1000,
              }}
            >
              <Refresh />
            </Fab>
          )}

          {/* Footer */}
          <Box
            sx={{
              py: { xs: 2, sm: 3 },
              px: 2,
              mt: 'auto',
              backgroundColor: 'grey.100',
              borderTop: '1px solid',
              borderColor: 'grey.300',
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box
                  component="img"
                  src="/favicon.ico"
                  alt="Step Sciences logo"
                  sx={{ height: { xs: 35, sm: 45 }, mb: 1.5 }}
                />

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 1, fontSize: { xs: '1rem', sm: '1.1rem' } }}
                >
                  &copy; {new Date().getFullYear()} Step Sciences
                </Typography>

                {companyConfig.showBranding && !isMobile && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                    Powered by Step Sciences | Health and Performance Solutions
                  </Typography>
                )}
              </Box>
            </Container>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;
