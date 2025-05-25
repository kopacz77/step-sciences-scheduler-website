import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Schedule } from '@mui/icons-material';

const GoogleCalendarButton = ({ companyConfig, onAppointmentBooked }) => {
  const calendarButtonRef = useRef(null);
  const [buttonLoaded, setButtonLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const initializeButton = () => {
      setTimeout(() => {
        if (window.calendar?.schedulingButton && calendarButtonRef.current) {
          try {
            window.calendar.schedulingButton.load({
              url: companyConfig.calendarUrl,
              color: companyConfig.primaryColor,
              label: 'Book Your Appointment',
              target: calendarButtonRef.current,
            });
            setButtonLoaded(true);
          } catch (error) {
            console.error('Error loading Google Calendar button:', error);
            setShowFallback(true);
          }
        } else {
          setShowFallback(true);
        }
      }, 2000);
    };

    if (window.calendar?.schedulingButton) {
      initializeButton();
    } else {
      const timeout = setTimeout(() => {
        setShowFallback(true);
      }, 5000);

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
      {/* Only show ONE button - either Google's embedded button OR fallback */}
      {!showFallback ? (
        <>
          <Box 
            ref={calendarButtonRef}
            sx={{ 
              minHeight: '80px', // Increased height
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3,
              '& .calendar-scheduling-button': {
                fontSize: '1.3rem !important', // Larger button
                padding: '16px 32px !important',
                minHeight: '60px !important',
                minWidth: '300px !important'
              }
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
      ) : (
        // Fallback button - larger and more prominent
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleDirectBooking}
            sx={{ 
              fontSize: '1.3rem', 
              py: 2.5, 
              px: 6,
              minHeight: '70px',
              minWidth: '320px',
              borderRadius: 3,
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              '&:hover': {
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)'
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