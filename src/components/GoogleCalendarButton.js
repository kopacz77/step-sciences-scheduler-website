import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, useMediaQuery } from '@mui/material';
import { Schedule } from '@mui/icons-material';

const GoogleCalendarButton = ({ companyConfig, onAppointmentBooked, isMobile }) => {
  const calendarButtonRef = useRef(null);
  const [buttonLoaded, setButtonLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const mobileCheck = useMediaQuery('(max-width:600px)');
  const isActuallyMobile = isMobile || mobileCheck;

  useEffect(() => {
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
                button.style.boxShadow = isActuallyMobile ? 
                  '0 8px 25px rgba(0,0,0,0.25)' : 
                  '0 12px 35px rgba(0,0,0,0.3)';
              });
              
              button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0px)';
                button.style.boxShadow = isActuallyMobile ? 
                  '0 6px 20px rgba(0,0,0,0.15)' : 
                  '0 8px 25px rgba(0,0,0,0.2)';
              });

              console.log('Successfully styled Google Calendar button for', isActuallyMobile ? 'mobile' : 'desktop');
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

  return (
    <Box sx={{ textAlign: 'center' }}>
      {/* Google Calendar Button Container */}
      {!showFallback && (
        <>
          <Box 
            ref={calendarButtonRef}
            sx={{ 
              minHeight: { xs: '80px', sm: '100px' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: { xs: 2, sm: 3 },
              width: '100%'
            }}
          />
          
          {buttonLoaded && (
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              mb: { xs: 2, sm: 3 },
              fontWeight: isActuallyMobile ? 500 : 400
            }}>
              {isActuallyMobile ? 'Tap the button above to schedule' : 'Click the button above to schedule your appointment'}
            </Typography>
          )}
        </>
      )}

      {/* Fallback button if Google's button fails */}
      {showFallback && (
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
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
                boxShadow: { xs: '0 8px 25px rgba(0,0,0,0.25)', sm: '0 12px 35px rgba(0,0,0,0.3)' },
                transform: 'translateY(-4px)'
              }
            }}
          >
            {isActuallyMobile ? '📅 Book Appointment' : '📅 Book Your Appointment'}
          </Button>
          <Typography variant="body2" sx={{ 
            mt: 2, 
            color: 'text.secondary',
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}>
            Opens booking calendar in a new tab
          </Typography>
        </Box>
      )}

      {/* CRITICAL: Make the confirmation button super prominent on mobile */}
      <Box sx={{ mt: { xs: 3, sm: 4 } }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={onAppointmentBooked}
          sx={{ 
            fontSize: { xs: '1.1rem', sm: '1.2rem' }, 
            py: { xs: 2, sm: 2 }, 
            px: { xs: 4, sm: 5 },
            minHeight: { xs: '56px', sm: '60px' },
            minWidth: { xs: '260px', sm: 'auto' },
            maxWidth: { xs: '90vw', sm: 'none' },
            borderRadius: { xs: 3, sm: 3 },
            boxShadow: { xs: '0 6px 20px rgba(76, 175, 80, 0.3)', sm: '0 4px 12px rgba(0,0,0,0.15)' },
            fontWeight: 'bold',
            width: { xs: '100%', sm: 'auto' },
            '&:hover': {
              boxShadow: { xs: '0 8px 25px rgba(76, 175, 80, 0.4)', sm: '0 6px 16px rgba(0,0,0,0.2)' },
              transform: 'translateY(-2px)'
            }
          }}
        >
          ✓ {isActuallyMobile ? 'Appointment Booked!' : 'I\'ve Successfully Booked My Appointment'}
        </Button>
        
        <Typography variant="body2" sx={{ 
          mt: 2, 
          color: 'text.secondary',
          fontSize: { xs: '0.9rem', sm: '1rem' },
          fontWeight: isActuallyMobile ? 500 : 400,
          textAlign: 'center'
        }}>
          {isActuallyMobile ? 
            'Tap after booking to continue' : 
            'Click after completing your booking to continue to the intake form'
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default GoogleCalendarButton;