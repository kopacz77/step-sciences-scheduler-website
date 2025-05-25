import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Schedule } from '@mui/icons-material';

const GoogleCalendarButton = ({ companyConfig, onAppointmentBooked }) => {
  const calendarButtonRef = useRef(null);
  const [buttonLoaded, setButtonLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const initializeButton = () => {
      if (window.calendar?.schedulingButton && calendarButtonRef.current) {
        try {
          window.calendar.schedulingButton.load({
            url: companyConfig.calendarUrl,
            color: companyConfig.primaryColor,
            label: 'Book Your Appointment',
            target: calendarButtonRef.current,
          });

          // THE KEY FIX: Use setTimeout to wait for Google to create the button
          setTimeout(() => {
            // Select the button adjacent to our target div
            const button = calendarButtonRef.current.nextElementSibling;
            
            if (button && button.tagName === 'BUTTON') {
              // Apply inline styles directly (this is the only way to override Google's styles)
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
              
              // Add hover effects
              button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-4px)';
                button.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
              });
              
              button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0px)';
                button.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
              });

              console.log('Successfully styled Google Calendar button!');
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
  }, [companyConfig]);

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
              minHeight: '100px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3
            }}
          />
          
          {buttonLoaded && (
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              fontSize: '1rem',
              mb: 3
            }}>
              Click the button above to schedule your appointment
            </Typography>
          )}
        </>
      )}

      {/* Fallback button if Google's button fails */}
      {showFallback && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleDirectBooking}
            sx={{ 
              fontSize: '1.6rem', 
              py: 3, 
              px: 6,
              minHeight: '80px',
              minWidth: '400px',
              borderRadius: 4,
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              fontWeight: 700,
              '&:hover': {
                boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                transform: 'translateY(-4px)'
              }
            }}
          >
            📅 Book Your Appointment
          </Button>
          <Typography variant="body2" sx={{ 
            mt: 2, 
            color: 'text.secondary',
            fontSize: '1rem'
          }}>
            Opens booking calendar in a new tab
          </Typography>
        </Box>
      )}

      {/* Confirmation button */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={onAppointmentBooked}
          sx={{ 
            fontSize: '1.2rem', 
            py: 2, 
            px: 5,
            minHeight: '60px',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          ✓ I've Successfully Booked My Appointment
        </Button>
        <Typography variant="body2" sx={{ 
          mt: 2, 
          color: 'text.secondary',
          fontSize: '1rem'
        }}>
          Click after completing your booking to continue to the intake form
        </Typography>
      </Box>
    </Box>
  );
};

export default GoogleCalendarButton;