import { Box, Typography, Card, CardContent, Alert, Button } from '@mui/material';
import { EventAvailable, NoteAdd, Check, Info, ArrowBack } from '@mui/icons-material';
import GoogleCalendarButton from './GoogleCalendarButton';

const StepContent = ({ 
  activeStep, 
  steps, 
  companyConfig, 
  showIntakeForm,
  onAppointmentBooked,
  onIntakeForm,
  onIntakeFormComplete,
  onBackToForm
}) => {
  return (
    <Card variant="outlined" sx={{ mb: 4, overflow: 'hidden' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Step Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          bgcolor: 'grey.50'
        }}>
          <Box sx={{ 
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mr: 2,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            {steps[activeStep].icon}
          </Box>
          <Typography variant="h5" component="h2">
            {steps[activeStep].label}
          </Typography>
        </Box>

        {/* Step Content */}
        <Box sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ mb: 3, fontSize: '1.2rem' }}>
            {steps[activeStep].description}
          </Typography>

          {activeStep === 0 && (
            <Box>
              <Typography variant="body2" sx={{ mb: 3, fontSize: '1.1rem', textAlign: 'center' }}>
                Click the booking button below to schedule your appointment:
              </Typography>
              
              <GoogleCalendarButton 
                companyConfig={companyConfig}
                onAppointmentBooked={onAppointmentBooked}
              />

              {companyConfig.specialInstructions && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  mt: 4, 
                  p: 3, 
                  bgcolor: 'info.light', 
                  borderRadius: 2 
                }}>
                  <Info color="info" sx={{ mr: 1, mt: 0.3, fontSize: 24 }} />
                  <Typography variant="body2" color="info.dark" sx={{ fontSize: '1.1rem' }}>
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
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                      ✓ Great! Your appointment has been booked.
                    </Typography>
                  </Alert>
                  
                  <Typography variant="body1" sx={{ mb: 3, fontSize: '1.2rem' }}>
                    Now please complete the intake form below. This form will help us prepare for your visit.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<NoteAdd sx={{ fontSize: 24 }} />}
                      onClick={onIntakeForm}
                      sx={{ fontSize: '1.2rem', py: 1.5, px: 4 }}
                    >
                      Complete Intake Form
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ 
                    mb: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2
                  }}>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={onBackToForm}
                      startIcon={<ArrowBack />}
                      sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                    >
                      Back to Instructions
                    </Button>
                    <Button 
                      variant="contained" 
                      color="success"
                      size="large" 
                      onClick={onIntakeFormComplete}
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        alignSelf: { xs: 'flex-end', sm: 'center' }
                      }}
                    >
                      I've Completed the Form
                    </Button>
                  </Box>
                  <Box sx={{ 
                    height: { xs: '600px', md: '700px' }, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    mt: 2
                  }}>
                    <iframe
                      title="Intake Form"
                      src={companyConfig.intakeFormUrl}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                    />
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="body1" sx={{ mb: 3, fontSize: '1.2rem' }}>
                Thank you for completing both steps! Your appointment is now fully confirmed.
              </Typography>
              <Box sx={{ 
                p: 3, 
                backgroundColor: 'success.light', 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                mb: 4
              }}>
                <Check color="success" sx={{ mr: 2, fontSize: 32 }} />
                <Typography variant="h6" color="success.dark" sx={{ fontWeight: 500 }}>
                  You're all set! We look forward to seeing you at your scheduled time.
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StepContent;