import {
  ArrowBack,
  Check,
  CheckCircle,
  Error as ErrorIcon,
  EventAvailable,
  Info,
  NoteAdd,
  Schedule,
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
    showIntakeForm,
    onAppointmentBooked,
    onIntakeForm,
    onIntakeFormComplete,
    onBackToForm,
  }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState(null);

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

    const handleIntakeFormWithLoading = async () => {
      setIsLoading(true);
      setLoadingMessage('Loading intake form...');

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        onIntakeForm();
      } catch (err) {
        setError('Failed to load intake form. Please try again.');
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    };

    return (
      <Card variant="outlined" sx={{ mb: { xs: 2, sm: 4 }, overflow: 'hidden' }}>
        {/* Loading Progress Bar */}
        {isLoading && (
          <LinearProgress
            sx={{
              height: 4,
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
              p: { xs: 2, sm: 3 },
              borderBottom: '1px solid',
              borderColor: 'grey.200',
              bgcolor: isLoading ? 'grey.100' : 'grey.50',
              transition: 'background-color 0.3s ease',
            }}
          >
            <Box
              sx={{
                backgroundColor: isLoading ? 'grey.400' : 'primary.main',
                color: 'white',
                borderRadius: '50%',
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mr: { xs: 1.5, sm: 2 },
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'background-color 0.3s ease',
              }}
            >
              {error ? <ErrorIcon /> : steps[activeStep].icon}
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {error ? 'Error' : steps[activeStep].label}
              </Typography>
              {loadingMessage && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    mt: 0.5,
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
            {/* Reduced description on mobile - hide when Google scheduling is off */}
            {!isMobile && companyConfig.googleSchedulingEnabled !== false && (
              <Typography variant="body1" sx={{ mb: 3, fontSize: '1.2rem' }}>
                {steps[activeStep].description}
              </Typography>
            )}

            {activeStep === 0 && (
              <Box>
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

                    {/* Button to proceed to intake form */}
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
                        {isMobile ? 'Continue to Intake Form' : 'Proceed to Intake Form'}
                      </Button>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 2,
                          color: 'text.secondary',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        {isMobile ? 'After scheduling, tap to continue' : 'After scheduling your appointment, click to continue to the intake form'}
                      </Typography>
                    </Box>
                  </Box>
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

            {activeStep === 1 && (
              <Box>
                {!showIntakeForm ? (
                  <Box>
                    {/* Mobile: Put urgent action first, success message second */}
                    {isMobile ? (
                      <>
                        {/* CRITICAL: Mobile-first urgent call to action */}
                        <Alert
                          severity="warning"
                          sx={{ mb: 3, border: '2px solid', borderColor: 'warning.main' }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}
                          >
                            🚨 REQUIRED: Complete Intake Form Now
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              mt: 0.5,
                              textAlign: 'center',
                            }}
                          >
                            Your appointment isn't complete until this form is filled out
                          </Typography>
                        </Alert>

                        {/* CRITICAL: Make this button super prominent on mobile */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 3,
                          }}
                        >
                          <Button
                            variant="contained"
                            color="error"
                            size="large"
                            startIcon={<NoteAdd sx={{ fontSize: 24 }} />}
                            onClick={handleIntakeFormWithLoading}
                            disabled={isLoading}
                            sx={{
                              fontSize: '1.2rem',
                              py: 2.5,
                              px: 5,
                              fontWeight: 'bold',
                              minHeight: '64px',
                              minWidth: '280px',
                              boxShadow: '0 8px 25px rgba(211, 47, 47, 0.3)',
                              border: '3px solid',
                              borderColor: 'error.dark',
                              '&:hover': {
                                boxShadow: '0 12px 30px rgba(211, 47, 47, 0.4)',
                                transform: 'translateY(-3px)',
                                borderColor: 'error.dark',
                              },
                              '&:disabled': {
                                backgroundColor: 'grey.400',
                                color: 'white',
                              },
                              animation: 'pulse 2s infinite',
                              '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.05)' },
                                '100%': { transform: 'scale(1)' },
                              },
                            }}
                          >
                            {isLoading ? 'Loading...' : 'COMPLETE FORM NOW'}
                          </Button>
                        </Box>

                        {/* Success message comes after on mobile */}
                        <Alert severity="success" sx={{ mb: 2 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: '0.95rem', fontWeight: 500, textAlign: 'center' }}
                          >
                            ✓ Step 1 Complete: Appointment booked
                          </Typography>
                        </Alert>
                      </>
                    ) : (
                      <>
                        {/* Desktop: Keep original order */}
                        <Alert severity="success" sx={{ mb: 3 }}>
                          <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                            ✓ Great! Your appointment has been booked.
                          </Typography>
                        </Alert>

                        <Typography
                          variant="body1"
                          sx={{
                            mb: 3,
                            fontSize: '1.2rem',
                            fontWeight: 400,
                          }}
                        >
                          Now please complete the intake form below. This form will help us prepare
                          for your visit.
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<NoteAdd sx={{ fontSize: 24 }} />}
                            onClick={handleIntakeFormWithLoading}
                            disabled={isLoading}
                            sx={{
                              fontSize: '1.2rem',
                              py: 1.5,
                              px: 4,
                              fontWeight: 'bold',
                              minWidth: '250px',
                              '&:hover': {
                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                                transform: 'translateY(-2px)',
                              },
                              '&:disabled': {
                                backgroundColor: 'grey.400',
                                color: 'white',
                              },
                            }}
                          >
                            {isLoading ? 'Loading...' : 'Complete Intake Form'}
                          </Button>
                        </Box>
                      </>
                    )}

                    {/* Mobile-specific bottom reminder */}
                    {isMobile && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 2,
                          textAlign: 'center',
                          color: 'error.main',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        ⚠️ Mandatory Step - Do Not Skip
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={onBackToForm}
                        startIcon={<ArrowBack />}
                        sx={{
                          alignSelf: { xs: 'flex-start', sm: 'center' },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        Back to Instructions
                      </Button>

                      {/* CRITICAL: Make this completion button super prominent */}
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={onIntakeFormComplete}
                        sx={{
                          fontWeight: 'bold',
                          fontSize: { xs: '1.05rem', sm: '1.1rem' },
                          alignSelf: { xs: 'flex-end', sm: 'center' },
                          py: { xs: 1.5, sm: 1 },
                          px: { xs: 3, sm: 2 },
                          minHeight: { xs: '48px', sm: 'auto' },
                          boxShadow: isMobile ? '0 6px 20px rgba(76, 175, 80, 0.3)' : undefined,
                          '&:hover': {
                            boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        {isMobile ? 'Form Complete ✓' : "I've Completed the Form"}
                      </Button>
                    </Box>

                    {/* Mobile-specific reminder above iframe */}
                    {isMobile && (
                      <Alert
                        severity="error"
                        sx={{ mb: 2, border: '2px solid', borderColor: 'error.main' }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontSize: '1rem', fontWeight: 700, textAlign: 'center' }}
                        >
                          🚨 AFTER FILLING FORM: Tap "Form Complete ✓" button above!
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: '0.9rem', fontWeight: 500, textAlign: 'center', mt: 0.5 }}
                        >
                          Don't forget this final step or your appointment won't be confirmed
                        </Typography>
                      </Alert>
                    )}

                    <Box
                      sx={{
                        height: { xs: '500px', sm: '600px', md: '700px' },
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        overflow: 'hidden',
                        mt: 2,
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
