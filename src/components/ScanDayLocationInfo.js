import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { CalendarToday, LocationOn } from '@mui/icons-material';

const ScanDayLocationInfo = ({ companyConfig }) => {
  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 3, 
        mb: 4, 
        borderColor: 'primary.main',
        borderWidth: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CalendarToday color="primary" sx={{ mr: 2, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Scan Day Locations
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            border: '2px solid', 
            borderColor: 'success.main',
            bgcolor: 'success.light',
            '&:hover': { boxShadow: '0 6px 16px rgba(0,0,0,0.15)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                  Monday Appointments
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'success.dark' }}>
                {companyConfig.scanDayLocations.monday}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            border: '2px solid', 
            borderColor: 'info.main',
            bgcolor: 'info.light',
            '&:hover': { boxShadow: '0 6px 16px rgba(0,0,0,0.15)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'info.dark' }}>
                  Friday Appointments
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'info.dark' }}>
                {companyConfig.scanDayLocations.friday}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ 
        mt: 3, 
        p: 2, 
        bgcolor: 'warning.light', 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'warning.main'
      }}>
        <Typography variant="body2" sx={{ 
          fontWeight: 'medium', 
          color: 'warning.dark',
          textAlign: 'center',
          fontSize: '1.05rem'
        }}>
          <strong>Important:</strong> Please note the different locations for Monday and Friday appointments when booking your time slot.
        </Typography>
      </Box>
    </Paper>
  );
};

export default ScanDayLocationInfo;