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
  LinearProgress,
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

        // Check for reset parameter (validated)
        if (validatedParams.reset === true) {
          // Clear localStorage and reset state
          localStorage.removeItem('appointmentBooked');
          localStorage.removeItem('intakeFormCompleted');
          localStorage.removeItem('landingPageSeen');
          setAppointmentBooked(false);
          setActiveStep(0);
          setShowLandingPage(true);

          // Clean URL by removing reset parameter
          const newUrl = new URL(window.location);
          newUrl.searchParams.delete('reset');
          window.history.replaceState({}, '', newUrl);
          return;
        }

        // Check localStorage with validation for progress restoration
        const storedBookingStatus = localStorage.getItem('appointmentBooked');
        const storedFormStatus = localStorage.getItem('intakeFormCompleted');

        if (storedBookingStatus === 'true') {
          // User has already booked, show final step
          setAppointmentBooked(true);
          setActiveStep(2);
        } else if (storedFormStatus === 'true' || validatedParams.status === 'booked') {
          // User has completed form, show booking step
          setActiveStep(1);
        }
        // Otherwise stay at step 0 (form)
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

    // Compute a lighter version of primary color for secondary palette
    const primaryColor = companyConfig.primaryColor;
    // Create a light background variant of the primary color
    const lightPrimaryBg = `${primaryColor}15`; // 15% opacity for backgrounds

    return createTheme({
      palette: {
        primary: { main: primaryColor },
        secondary: { main: primaryColor, light: lightPrimaryBg },
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
  const handleIntakeFormComplete = useCallback(() => {
    // Form is complete, now show booking step
    setActiveStep(1);
    localStorage.setItem('intakeFormCompleted', 'true');
  }, []);

  const handleAppointmentBooked = useCallback(() => {
    // Booking is complete, show final confirmation
    setAppointmentBooked(true);
    setActiveStep(2);
    localStorage.setItem('appointmentBooked', 'true');
  }, []);

  const handleIntakeForm = useCallback(() => {
    // Not used in new flow, but keeping for compatibility
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
    setShowLandingPage(companyConfig?.landingPageEnabled || false);

    // Scroll to top
    window.scrollTo(0, 0);
  }, [companyConfig?.landingPageEnabled]);

  // Memoized steps array to prevent recreation on every render
  const steps = useMemo(
    () => [
      {
        label: 'Complete Intake Form',
        icon: <NoteAdd />,
        description: 'Fill out the required intake information to get started.',
      },
      {
        label: 'Schedule Appointment',
        icon: <EventAvailable />,
        description: 'Select an available time slot that works for you.',
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
            showBackButton={false}
            onBackClick={() => {}}
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

            {/* Critical Process Flow Alert - Enhanced for All Devices */}
            <Alert
              severity="error"
              sx={{
                mb: { xs: 3, sm: 5 },
                fontSize: { xs: '1rem', sm: '1.2rem' },
                border: '3px solid',
                borderColor: 'error.main',
                backgroundColor: 'error.light',
                boxShadow: '0 4px 16px rgba(211, 47, 47, 0.3)',
                animation: 'pulseBorder 2s ease-in-out infinite',
                '@keyframes pulseBorder': {
                  '0%': { borderColor: 'error.main', boxShadow: '0 4px 16px rgba(211, 47, 47, 0.3)' },
                  '50%': { borderColor: 'error.dark', boxShadow: '0 6px 20px rgba(211, 47, 47, 0.5)' },
                  '100%': { borderColor: 'error.main', boxShadow: '0 4px 16px rgba(211, 47, 47, 0.3)' },
                },
                '& .MuiAlert-message': {
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  width: '100%',
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  textAlign: 'center',
                  fontSize: { xs: '1.05rem', sm: '1.2rem' },
                }}
              >
                <strong>{isMobile ? '🚨 BOTH STEPS MANDATORY' : '⚠️ CRITICAL: BOTH STEPS REQUIRED'}</strong>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  mt: 1,
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                }}
              >
                {isMobile
                  ? '1️⃣ Complete intake form → 2️⃣ Schedule appointment. DO NOT STOP after step 1!'
                  : 'You must complete BOTH steps: (1) Fill out the intake form, then (2) Schedule your appointment. Both are required for your visit.'}
              </Typography>
            </Alert>

            {/* Location Information - Always Visible */}
            {companyConfig.hasScanDays ? (
              <ScanDayLocationInfo companyConfig={companyConfig} />
            ) : (
              companyConfig.meetingLocation && (
                <Paper
                  variant="outlined"
                  sx={{
                    mb: { xs: 2, sm: 4 },
                    borderColor: 'primary.light',
                    border: '2px solid',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 2.5, sm: 3 },
                      display: 'flex',
                      flexDirection: { xs: 'row', sm: 'column' },
                      alignItems: 'center',
                      textAlign: { xs: 'left', sm: 'center' },
                      gap: { xs: 1.5, sm: 0 },
                    }}
                  >
                    <LocationOn
                      color="primary"
                      sx={{
                        fontSize: { xs: 28, sm: 32 },
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        gutterBottom={!isMobile}
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          mb: { xs: 0.5, sm: 1 },
                        }}
                      >
                        Meeting Location
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: '1rem', sm: '1.15rem' },
                          fontWeight: 500,
                          color: 'text.primary',
                        }}
                      >
                        {companyConfig.meetingLocation}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )
            )}

            {/* Visual Progress Bar - Shows Overall Completion */}
            <Box sx={{ width: '100%', mb: 3 }}>
              <LinearProgress
                variant="determinate"
                value={(activeStep / 2) * 100}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: 'grey.300',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    background:
                      activeStep === 2
                        ? 'linear-gradient(90deg, #4CAF50 0%, #81C784 100%)'
                        : 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                    transition: 'transform 0.6s ease-in-out',
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  {activeStep === 0
                    ? 'Getting Started'
                    : activeStep === 1
                      ? 'Almost Done!'
                      : 'Complete!'}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {Math.round((activeStep / 2) * 100)}% Complete
                </Typography>
              </Box>
            </Box>

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
                      fontSize: '1.4rem',
                      color: activeStep < 2 ? 'primary.main' : 'success.main',
                      fontWeight: 700,
                    }}
                  >
                    Step {activeStep + 1} of {steps.length}: {steps[activeStep].label}
                  </Typography>
                  {activeStep < 2 && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.9rem',
                        color: 'primary.dark',
                        fontWeight: 600,
                        textAlign: 'center',
                        mt: 0.5,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      ⏳ IN PROGRESS
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
              onAppointmentBooked={handleAppointmentBooked}
              onIntakeForm={handleIntakeForm}
              onIntakeFormComplete={handleIntakeFormComplete}
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
            {activeStep === 1 && (
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
          {activeStep === 1 && isMobile && (
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
