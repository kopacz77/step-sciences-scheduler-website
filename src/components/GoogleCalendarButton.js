import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Schedule } from '@mui/icons-material';

const GoogleCalendarButton = ({ companyConfig, onAppointmentBooked }) => {
  const calendarButtonRef = useRef(null);
  const [buttonLoaded, setButtonLoaded] = useState(false);

  useEffect(() => {
    const initializeButton = () => {
      if (window.calendar?.schedulingButton && calendarButtonRef.current) {
        try {
          window.calendar.schedulingButton.load({
            url: `${companyConfig.calendarUrl}?gv=true`,
            color: companyConfig.primaryColor,
            label: 'Book Your Appointment',
            target: calendarButtonRef.current,
          });
          setButtonLoaded(true);
        } catch (error) {
          console.error('Error loading Google Calendar button:', error);
        }
      }
    };

    if (window.calendar) {
      initializeButton();
    } else {
      const checkScript = setInterval(() => {
        if (window.calendar) {
          clearInterval(checkScript);
          initializeButton();
        }
      }, 100);
      setTimeout(() => clearInterval(checkScript), 10000);
    }
  }, [companyConfig]);

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
      
      {!buttonLoaded && (
        <Box sx={{ 
          p: 3, 
          border: '2px dashed', 
          borderColor: 'grey.300',
          borderRadius: 2,
          bgcolor: 'grey.50'
        }}>
          <Schedule sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading appointment scheduler...
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