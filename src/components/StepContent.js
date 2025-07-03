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
            {/* Reduced description on mobile */}
            {!isMobile && (
              <Typography variant="body1" sx={{ mb: 3, fontSize: '1.2rem' }}>
                {steps[activeStep].description}
              </Typography>
            )}

            {activeStep === 0 && (
              <Box>
                <GoogleCalendarButton
                  companyConfig={companyConfig}
                  onAppointmentBooked={handleAppointmentBookedWithLoading}
                  isMobile={isMobile}
                  isLoading={isLoading}
                  error={error}
                  setError={setError}
                />

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
                        fontWeight: 500
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
                    <Alert severity="success" sx={{ mb: { xs: 2, sm: 3 } }}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, fontWeight: 600 }}
                      >
                        ✓{' '}
                        {isMobile
                          ? 'Appointment booked!'
                          : 'Great! Your appointment has been booked.'}
                      </Typography>
                    </Alert>

                    <Typography
                      variant="body1"
                      sx={{
                        mb: { xs: 2, sm: 3 },
                        fontSize: { xs: '1.05rem', sm: '1.2rem' },
                        textAlign: isMobile ? 'center' : 'left',
                        fontWeight: isMobile ? 500 : 400,
                      }}
                    >
                      {isMobile
                        ? 'Now complete the intake form:'
                        : 'Now please complete the intake form below. This form will help us prepare for your visit.'}
                    </Typography>

                    {/* CRITICAL: Make this button super prominent on mobile */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: { xs: 2, sm: 0 },
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<NoteAdd sx={{ fontSize: { xs: 20, sm: 24 } }} />}
                        onClick={handleIntakeFormWithLoading}
                        disabled={isLoading}
                        sx={{
                          fontSize: { xs: '1.1rem', sm: '1.2rem' },
                          py: { xs: 2, sm: 1.5 },
                          px: { xs: 4, sm: 4 },
                          fontWeight: 'bold',
                          minHeight: { xs: '56px', sm: 'auto' },
                          minWidth: { xs: '200px', sm: '250px' },
                          boxShadow: isMobile ? '0 6px 20px rgba(0,0,0,0.15)' : undefined,
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
                        {isLoading
                          ? 'Loading...'
                          : isMobile
                            ? 'Complete Form'
                            : 'Complete Intake Form'}
                      </Button>
                    </Box>

                    {/* Mobile-specific CTA reminder */}
                    {isMobile && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 2,
                          textAlign: 'center',
                          color: 'text.secondary',
                          fontSize: '0.9rem',
                          fontStyle: 'italic',
                        }}
                      >
                        Required to complete your appointment
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
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                          <strong>Important:</strong> Complete the form below, then tap "Form
                          Complete ✓" above
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
