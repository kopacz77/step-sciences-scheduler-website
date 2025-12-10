import { CheckCircle, Error as ErrorIcon, Refresh, Schedule } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { memo, useEffect, useRef, useState } from 'react';

const GoogleCalendarButton = memo(
  ({ companyConfig, onAppointmentBooked, isMobile, isLoading, error, setError }) => {
    const calendarButtonRef = useRef(null);
    const [buttonLoaded, setButtonLoaded] = useState(false);
    const [showFallback, setShowFallback] = useState(false);
    const [loadingCalendar, setLoadingCalendar] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    const mobileCheck = useMediaQuery('(max-width:600px)');
    const isActuallyMobile = isMobile || mobileCheck;

    useEffect(() => {
      // Check if the URL is a Google Calendar appointment URL
      const isAppointmentUrl = companyConfig.calendarUrl?.includes('/appointments/schedules/');

      if (isAppointmentUrl) {
        // For appointment URLs, we'll embed them directly as an iframe
        setLoadingCalendar(false);
        setButtonLoaded(true);
        return;
      }

      const initializeButton = () => {
        if (window.calendar?.schedulingButton && calendarButtonRef.current) {
          try {
            window.calendar.schedulingButton.load({
              url: companyConfig.calendarUrl,
              color: companyConfig.primaryColor,
              label: isActuallyMobile ? 'Book Appointment' : 'Book Your Appointment',
              target: calendarButtonRef.current,
            });

            // THE KEY FIX: Use setTimeout to wait for Google to create the button
            setTimeout(() => {
              // Select the button adjacent to our target div
              const button = calendarButtonRef.current.nextElementSibling;

              if (button && button.tagName === 'BUTTON') {
                // Mobile-specific styling
                if (isActuallyMobile) {
                  button.style.fontSize = '1.2rem';
                  button.style.fontWeight = '700';
                  button.style.padding = '20px 32px';
                  button.style.minHeight = '64px';
                  button.style.minWidth = '280px';
                  button.style.maxWidth = '90vw';
                  button.style.height = '64px';
                  button.style.borderRadius = '12px';
                  button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                  button.style.transition = 'all 0.3s ease';
                  button.style.textTransform = 'none';
                  button.style.letterSpacing = '0.5px';
                  button.style.lineHeight = '1.2';
                  button.style.fontFamily = 'Roboto, sans-serif';
                  button.style.width = '100%';
                } else {
                  // Desktop styling
                  button.style.fontSize = '1.6rem';
                  button.style.fontWeight = '700';
                  button.style.padding = '24px 48px';
                  button.style.minHeight = '80px';
                  button.style.minWidth = '400px';
                  button.style.height = '80px';
                  button.style.borderRadius = '16px';
                  button.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                  button.style.transition = 'all 0.3s ease';
                  button.style.textTransform = 'none';
                  button.style.letterSpacing = '0.8px';
                  button.style.lineHeight = '1.2';
                  button.style.fontFamily = 'Roboto, sans-serif';
                }

                // Add hover effects
                button.addEventListener('mouseenter', () => {
                  button.style.transform = 'translateY(-4px)';
                  button.style.boxShadow = isActuallyMobile
                    ? '0 8px 25px rgba(0,0,0,0.25)'
                    : '0 12px 35px rgba(0,0,0,0.3)';
                });

                button.addEventListener('mouseleave', () => {
                  button.style.transform = 'translateY(0px)';
                  button.style.boxShadow = isActuallyMobile
                    ? '0 6px 20px rgba(0,0,0,0.15)'
                    : '0 8px 25px rgba(0,0,0,0.2)';
                });

                console.log(
                  'Successfully styled Google Calendar button for',
                  isActuallyMobile ? 'mobile' : 'desktop'
                );
                setButtonLoaded(true);
              } else {
                console.warn('Could not find Google Calendar button');
                setShowFallback(true);
              }
            }, 2000); // Wait 2 seconds for Google to create the button
          } catch (error) {
            console.error('Error loading Google Calendar button:', error);
            setShowFallback(true);
          }
        } else {
          setShowFallback(true);
        }
      };

      if (window.calendar?.schedulingButton) {
        initializeButton();
      } else {
        const timeout = setTimeout(() => {
          setShowFallback(true);
        }, 8000);

        const checkScript = setInterval(() => {
          if (window.calendar?.schedulingButton) {
            clearInterval(checkScript);
            clearTimeout(timeout);
            initializeButton();
          }
        }, 500);

        return () => {
          clearInterval(checkScript);
          clearTimeout(timeout);
        };
      }
    }, [companyConfig, isActuallyMobile]);

    const handleDirectBooking = () => {
      window.open(companyConfig.calendarUrl, '_blank');
    };

    const handleRetry = () => {
      setRetryCount((prev) => prev + 1);
      setShowFallback(false);
      setButtonLoaded(false);
      setLoadingCalendar(true);
      setError?.(null);
    };

    return (
      <Box sx={{ textAlign: 'center' }}>
        {/* Loading State */}
        {loadingCalendar && !showFallback && (
          <Box
            sx={{
              minHeight: { xs: '80px', sm: '100px' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              mb: { xs: 2, sm: 3 },
            }}
          >
            <CircularProgress size={isActuallyMobile ? 32 : 40} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading booking calendar...
            </Typography>
          </Box>
        )}

        {/* Google Calendar Embed or Button Container */}
        {!showFallback && !loadingCalendar && (
          <>
            {companyConfig.calendarUrl?.includes('/appointments/schedules/') ? (
              // Embedded Google Calendar for appointment URLs
              <Box
                sx={{
                  width: '100%',
                  mb: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0',
                }}
              >
                <iframe
                  src={companyConfig.calendarUrl}
                  width="100%"
                  height={isActuallyMobile ? '600' : '800'}
                  frameBorder="0"
                  scrolling="auto"
                  title="Book Your Appointment"
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  allow="fullscreen"
                />
              </Box>
            ) : (
              // Google Calendar Button for other URLs
              <Box
                ref={calendarButtonRef}
                sx={{
                  minHeight: { xs: '80px', sm: '100px' },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: { xs: 2, sm: 3 },
                  width: '100%',
                }}
              />
            )}

            {buttonLoaded && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  mb: { xs: 2, sm: 3 },
                  fontWeight: isActuallyMobile ? 500 : 400,
                }}
              >
                {companyConfig.calendarUrl?.includes('/appointments/schedules/')
                  ? isActuallyMobile
                    ? 'Use the calendar above to book your appointment'
                    : 'Use the calendar above to schedule your appointment'
                  : isActuallyMobile
                    ? 'Tap the button above to schedule'
                    : 'Click the button above to schedule your appointment'}
              </Typography>
            )}
          </>
        )}

        {/* Enhanced Fallback with Retry Option */}
        {showFallback && (
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            {retryCount < 2 && !companyConfig.calendarUrl?.includes('/appointments/schedules/') && (
              <Alert
                severity="warning"
                sx={{ mb: 2 }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleRetry}
                    startIcon={<Refresh />}
                  >
                    Retry
                  </Button>
                }
              >
                Calendar didn't load properly. You can retry or use the direct link below.
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleDirectBooking}
              startIcon={<Schedule />}
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.6rem' },
                py: { xs: 2.5, sm: 3 },
                px: { xs: 4, sm: 6 },
                minHeight: { xs: '64px', sm: '80px' },
                minWidth: { xs: '280px', sm: '400px' },
                maxWidth: { xs: '90vw', sm: 'none' },
                borderRadius: { xs: 3, sm: 4 },
                boxShadow: { xs: '0 6px 20px rgba(0,0,0,0.15)', sm: '0 8px 25px rgba(0,0,0,0.2)' },
                fontWeight: 700,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  boxShadow: {
                    xs: '0 8px 25px rgba(0,0,0,0.25)',
                    sm: '0 12px 35px rgba(0,0,0,0.3)',
                  },
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {isActuallyMobile ? '📅 Book Appointment' : '📅 Book Your Appointment'}
            </Button>
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', sm: '1rem' },
              }}
            >
              Opens booking calendar in a new tab
            </Typography>
          </Box>
        )}

        {/* Enhanced Confirmation Button with Sticky Footer on Mobile */}
        <Box
          sx={{
            mt: { xs: 3, sm: 4 },
            ...(isActuallyMobile && {
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'background.paper',
              borderTop: '3px solid',
              borderColor: 'success.main',
              p: 2,
              mx: -2,
              boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
            }),
          }}
        >
          {/* Instruction Alert - Always Visible */}
          <Alert
            severity="info"
            sx={{
              mb: 2,
              fontSize: { xs: '0.95rem', sm: '1rem' },
              fontWeight: 600,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {isActuallyMobile
                ? '✓ After booking your time slot above, tap the button below'
                : '✓ After booking your time slot in the calendar above, click the button below to continue'}
            </Typography>
          </Alert>

          <Tooltip
            title={
              isActuallyMobile
                ? "Tap this after you've finished booking your appointment"
                : "Click this after you've successfully booked your appointment in the calendar above"
            }
            placement="top"
          >
            <span>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={onAppointmentBooked}
                disabled={isLoading}
                fullWidth={isActuallyMobile}
                startIcon={
                  isLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />
                }
                sx={{
                  fontSize: { xs: '1.3rem', sm: '1.2rem' },
                  py: { xs: 2.5, sm: 2 },
                  px: { xs: 4, sm: 5 },
                  minHeight: { xs: '64px', sm: '60px' },
                  minWidth: { xs: '280px', sm: 'auto' },
                  maxWidth: { xs: '100%', sm: 'none' },
                  borderRadius: { xs: 3, sm: 3 },
                  boxShadow: {
                    xs: '0 6px 20px rgba(76, 175, 80, 0.4)',
                    sm: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                  fontWeight: 700,
                  width: { xs: '100%', sm: 'auto' },
                  animation: isLoading ? 'none' : 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)' },
                    '50%': { boxShadow: '0 8px 30px rgba(76, 175, 80, 0.6)' },
                    '100%': { boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)' },
                  },
                  '&:hover': {
                    boxShadow: {
                      xs: '0 8px 25px rgba(76, 175, 80, 0.5)',
                      sm: '0 6px 16px rgba(0,0,0,0.2)',
                    },
                    transform: 'translateY(-2px)',
                    animation: 'none',
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.400',
                    color: 'white',
                    boxShadow: 'none',
                    animation: 'none',
                  },
                }}
              >
                {isLoading
                  ? 'Processing...'
                  : isActuallyMobile
                    ? '✓ I\'ve Booked - Continue →'
                    : "✓ I've Successfully Booked My Appointment"}
              </Button>
            </span>
          </Tooltip>

          {!isActuallyMobile && (
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: 'text.secondary',
                fontSize: '1rem',
                fontWeight: 400,
                textAlign: 'center',
              }}
            >
              Click after completing your booking to continue
            </Typography>
          )}
        </Box>
      </Box>
    );
  }
);

GoogleCalendarButton.displayName = 'GoogleCalendarButton';

export default GoogleCalendarButton;
