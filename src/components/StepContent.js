import {
  Check,
  CheckCircle,
  Error as ErrorIcon,
  Info,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Fade,
  LinearProgress,
  Skeleton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { memo, useEffect, useState } from 'react';
import GoogleCalendarButton from './GoogleCalendarButton';

const StepContent = memo(
  ({
    activeStep,
    steps,
    companyConfig,
    onAppointmentBooked,
    onIntakeForm,
    onIntakeFormComplete,
  }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState(null);
    const [showFallbackButton, setShowFallbackButton] = useState(false);

    // Listen for postMessage from intake form iframe
    useEffect(() => {
      const handleMessage = (event) => {
        // Optional: Verify origin for added security
        // if (event.origin !== 'https://step-sciences.web.app') return;

        if (event.data.type === 'INTAKE_FORM_COMPLETED') {
          console.log('Intake form completed at:', event.data.timestamp);

          // Automatically advance to booking step
          handleIntakeFormCompleteWithLoading();
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Show fallback continue button after 15 seconds if on Step 0 (form step)
    useEffect(() => {
      if (activeStep === 0) {
        const timer = setTimeout(() => {
          setShowFallbackButton(true);
        }, 15000); // 15 seconds

        return () => clearTimeout(timer);
      } else {
        setShowFallbackButton(false);
      }
    }, [activeStep]);

    // Enhanced loading state for intake form completion
    const handleIntakeFormCompleteWithLoading = async () => {
      setIsLoading(true);
      setLoadingMessage('Processing form submission...');

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        onIntakeFormComplete();
      } catch (err) {
        setError('Failed to process form completion. Please try again.');
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    };

    // Enhanced loading states for better UX
    const handleAppointmentBookedWithLoading = async () => {
      setIsLoading(true);
      setLoadingMessage('Confirming your appointment...');

      try {
        // Add small delay for better UX feedback
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onAppointmentBooked();
      } catch (err) {
        setError('Failed to confirm appointment. Please try again.');
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    };

    return (
      <Card
        variant="outlined"
        sx={{
          mb: { xs: 2, sm: 4 },
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '2px solid',
          borderColor: 'primary.light',
          borderRadius: 3,
        }}
      >
        {/* Loading Progress Bar */}
        {isLoading && (
          <LinearProgress
            sx={{
              height: 6,
              '& .MuiLinearProgress-bar': {
                transition: 'transform 1.5s ease-in-out',
              },
            }}
          />
        )}

        <CardContent sx={{ p: 0 }}>
          {/* Enhanced Step Header with Loading States */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: { xs: 2.5, sm: 3.5 },
              borderBottom: '3px solid',
              borderColor: 'primary.main',
              bgcolor: isLoading ? 'grey.50' : 'primary.light',
              transition: 'background-color 0.3s ease',
            }}
          >
            <Box
              sx={{
                backgroundColor: isLoading ? 'grey.400' : 'primary.main',
                color: 'white',
                borderRadius: '50%',
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mr: { xs: 2, sm: 2.5 },
                boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                transition: 'all 0.3s ease',
                border: '3px solid white',
              }}
            >
              {error ? <ErrorIcon /> : steps[activeStep].icon}
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontSize: { xs: '1.4rem', sm: '1.7rem' },
                  fontWeight: 700,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: 'primary.dark',
                }}
              >
                {error ? 'Error' : steps[activeStep].label}
              </Typography>
              {loadingMessage && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    mt: 0.5,
                    fontWeight: 500,
                  }}
                >
                  {loadingMessage}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Error Display */}
          {error && (
            <Alert
              severity="error"
              sx={{ m: { xs: 2, sm: 3 }, mb: 0 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Step Content with Loading States */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Reduced description on mobile */}
            {!isMobile && (
              <Typography variant="body1" sx={{ mb: 3, fontSize: '1.2rem' }}>
                {steps[activeStep].description}
              </Typography>
            )}

            {/* STEP 0: INTAKE FORM (NEW FIRST STEP) */}
            {activeStep === 0 && (
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  {isMobile
                    ? 'Complete the form below to get started'
                    : 'Please fill out the intake form below. After submission, you\'ll be directed to schedule your appointment.'}
                </Typography>

                {/* Intake Form iframe - shown immediately */}
                <Box
                  sx={{
                    height: { xs: '500px', sm: '600px', md: '700px' },
                    border: '4px solid',
                    borderColor: 'primary.main',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                  }}
                >
                  <iframe
                    title="Intake Form"
                    src={companyConfig.intakeFormUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                    referrerPolicy="strict-origin-when-cross-origin"
                    loading="lazy"
                    allow="encrypted-media"
                  />
                </Box>

                {/* Info alert below iframe */}
                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.95rem', sm: '1rem' },
                      fontWeight: 500,
                      textAlign: 'center',
                    }}
                  >
                    After submitting the form, you'll automatically advance to schedule your appointment
                  </Typography>
                </Alert>

                {/* Fallback Continue Button - Shows after 15 seconds */}
                {showFallbackButton && (
                  <Fade in={showFallbackButton}>
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Already submitted the form? Click below to continue
                        </Typography>
                      </Alert>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleIntakeFormCompleteWithLoading}
                        disabled={isLoading}
                        startIcon={<CheckCircle />}
                        sx={{
                          fontSize: { xs: '1.1rem', sm: '1.2rem' },
                          py: { xs: 2, sm: 2.5 },
                          px: { xs: 4, sm: 5 },
                          minHeight: { xs: '56px', sm: '60px' },
                          fontWeight: 'bold',
                          borderRadius: 3,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          '&:hover': {
                            boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        {isMobile ? 'Continue to Booking' : 'Form Submitted - Continue to Booking'}
                      </Button>
                    </Box>
                  </Fade>
                )}

                {companyConfig.specialInstructions && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mt: { xs: 3, sm: 4 },
                      p: { xs: 2, sm: 3 },
                      bgcolor: 'warning.light',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'warning.main',
                    }}
                  >
                    <Info color="warning" sx={{ mr: 1, mt: 0.3, fontSize: { xs: 20, sm: 24 } }} />
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        fontSize: { xs: '0.95rem', sm: '1.1rem' },
                        fontWeight: 500,
                      }}
                    >
                      <strong>Note:</strong> {companyConfig.specialInstructions}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* STEP 1: BOOKING (NEW SECOND STEP) */}
            {activeStep === 1 && (
              <Box>
                {/* Success message that form is complete */}
                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    ✓ Great! Your intake form has been submitted.
                  </Typography>
                </Alert>

                <Typography
                  variant="body1"
                  sx={{
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  {isMobile
                    ? 'Now schedule your appointment:'
                    : 'Now please schedule your appointment below.'}
                </Typography>

                {/* Only show booking instructions when Google scheduling is enabled */}
                {companyConfig.googleSchedulingEnabled !== false && (
                  <Typography
                    variant="body2"
                    sx={{
                      mb: { xs: 2, sm: 3 },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      textAlign: 'center',
                      fontWeight: isMobile ? 600 : 400,
                    }}
                  >
                    {isMobile
                      ? (companyConfig.bookingPageInstructionsMobile || 'Tap to book your appointment:')
                      : (companyConfig.bookingPageInstructionsDesktop || 'Click the booking button below to schedule your appointment:')}
                  </Typography>
                )}

                {companyConfig.googleSchedulingEnabled !== false ? (
                  <GoogleCalendarButton
                    companyConfig={companyConfig}
                    onAppointmentBooked={handleAppointmentBookedWithLoading}
                    isMobile={isMobile}
                    isLoading={isLoading}
                    error={error}
                    setError={setError}
                  />
                ) : (
                  <Box>
                    <Box
                      sx={{
                        p: { xs: 3, sm: 4 },
                        bgcolor: 'info.light',
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: 'info.main',
                        textAlign: 'center',
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: '1.1rem', sm: '1.2rem' },
                          fontWeight: 500,
                          color: 'info.dark',
                        }}
                      >
                        {companyConfig.bookingPageAlternativeMessage || 'Please contact your local organizer to schedule your appointment.'}
                      </Typography>
                    </Box>

                    {/* Button to proceed to completion */}
                    <Box sx={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={handleAppointmentBookedWithLoading}
                        disabled={isLoading}
                        startIcon={<CheckCircle />}
                        sx={{
                          fontSize: { xs: '1.1rem', sm: '1.2rem' },
                          py: { xs: 2, sm: 2 },
                          px: { xs: 4, sm: 5 },
                          minHeight: { xs: '56px', sm: '60px' },
                          minWidth: { xs: '260px', sm: 'auto' },
                          maxWidth: { xs: '90vw', sm: 'none' },
                          borderRadius: { xs: 3, sm: 3 },
                          boxShadow: {
                            xs: '0 6px 20px rgba(76, 175, 80, 0.3)',
                            sm: '0 4px 12px rgba(0,0,0,0.15)',
                          },
                          fontWeight: 'bold',
                          width: { xs: '100%', sm: 'auto' },
                          '&:hover': {
                            boxShadow: {
                              xs: '0 8px 25px rgba(76, 175, 80, 0.4)',
                              sm: '0 6px 16px rgba(0,0,0,0.2)',
                            },
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        {isMobile ? 'Continue' : 'Confirm Booking'}
                      </Button>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 2,
                          color: 'text.secondary',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        {isMobile ? 'After scheduling, tap to finish' : 'After scheduling your appointment, click to complete'}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                    textAlign: isMobile ? 'center' : 'left',
                  }}
                >
                  {isMobile
                    ? 'All done! Your appointment is confirmed.'
                    : 'Thank you for completing both steps! Your appointment is now fully confirmed.'}
                </Typography>
                <Box
                  sx={{
                    p: { xs: 2, sm: 3 },
                    backgroundColor: 'success.light',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    textAlign: { xs: 'center', sm: 'left' },
                    mb: 4,
                  }}
                >
                  <Check
                    color="success"
                    sx={{
                      mr: { xs: 0, sm: 2 },
                      mb: { xs: 1, sm: 0 },
                      fontSize: { xs: 28, sm: 32 },
                    }}
                  />
                  <Typography
                    variant="h6"
                    color="success.dark"
                    sx={{
                      fontWeight: 500,
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    }}
                  >
                    {isMobile
                      ? "You're all set!"
                      : "You're all set! We look forward to seeing you at your scheduled time."}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }
);

StepContent.displayName = 'StepContent';

export default StepContent;
