import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Schedule } from '@mui/icons-material';

const GoogleCalendarButton = ({ companyConfig, onAppointmentBooked }) => {
  const calendarButtonRef = useRef(null);
  const [buttonLoaded, setButtonLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    const initializeButton = () => {
      // Add timeout to ensure scripts are fully loaded
      setTimeout(() => {
        if (window.calendar?.schedulingButton && calendarButtonRef.current) {
          try {
            console.log('Loading Google Calendar button with URL:', companyConfig.calendarUrl);
            
            window.calendar.schedulingButton.load({
              url: companyConfig.calendarUrl, // Remove ?gv=true as it might cause issues
              color: companyConfig.primaryColor,
              label: 'Book Your Appointment',
              target: calendarButtonRef.current,
            });
            setButtonLoaded(true);
          } catch (error) {
            console.error('Error loading Google Calendar button:', error);
            setScriptError(true);
          }
        } else {
          console.error('Google Calendar scheduling script not loaded');
          setScriptError(true);
        }
      }, 1000);
    };

    // Check if script is already loaded
    if (window.calendar?.schedulingButton) {
      initializeButton();
    } else {
      // Wait for script to load with longer timeout
      const checkScript = setInterval(() => {
        if (window.calendar?.schedulingButton) {
          clearInterval(checkScript);
          initializeButton();
        }
      }, 500);

      // Longer cleanup timeout
      setTimeout(() => {
        clearInterval(checkScript);
        if (!buttonLoaded) {
          setScriptError(true);
        }
      }, 15000);
    }
  }, [companyConfig, buttonLoaded]);

  // Fallback to direct link if button fails
  const handleDirectBooking = () => {
    window.open(companyConfig.calendarUrl, '_blank');
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box 
        ref={calendarButtonRef}
        sx={{ 
          minHeight: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3
        }}
      />
      
      {buttonLoaded && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ 
            fontStyle: 'italic', 
            color: 'text.secondary',
            fontSize: '1rem'
          }}>
            Click the button above to open the appointment scheduler
          </Typography>
        </Box>
      )}
      
      {/* Fallback button if Google Calendar button fails */}
      {(scriptError || !buttonLoaded) && (
        <Box sx={{ 
          p: 3, 
          border: '2px solid', 
          borderColor: 'primary.main',
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}>
          <Schedule sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Book Your Appointment
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleDirectBooking}
            sx={{ 
              fontSize: '1.1rem', 
              py: 1.5, 
              px: 4,
              mb: 2
            }}
          >
            Open Scheduling Calendar
          </Button>
          <Typography variant="body2" color="text.secondary">
            Click above to open the booking calendar in a new tab
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={onAppointmentBooked}
          sx={{ 
            fontSize: '1.1rem', 
            py: 1.5, 
            px: 4,
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
          Click this button after you've completed your booking to continue
        </Typography>
      </Box>
    </Box>
  );
};

export default GoogleCalendarButton;