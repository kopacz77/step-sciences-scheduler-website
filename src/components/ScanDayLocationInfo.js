import { Box, Typography, Paper, Grid, Card, CardContent, useMediaQuery, Chip } from '@mui/material';
import { CalendarToday, LocationOn, Schedule } from '@mui/icons-material';
import { memo } from 'react';

const ScanDayLocationInfo = memo(({ companyConfig }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <CalendarToday color="primary" sx={{ mr: 1, fontSize: { xs: 24, sm: 28 } }} />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          {isMobile ? 'Locations by Day' : 'Scan Day Locations'}
        </Typography>
        <Chip 
          label="Different Locations" 
          size="small" 
          color="warning" 
          sx={{ 
            display: { xs: 'none', sm: 'flex' },
            ml: 1 
          }} 
        />
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            border: '2px solid', 
            borderColor: 'success.main',
            bgcolor: 'success.50',
            '&:hover': { 
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            minHeight: { xs: 'auto', sm: '120px' },
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 2 } }}>
                <LocationOn sx={{ 
                  mr: 1, 
                  color: 'success.dark',
                  fontSize: { xs: 20, sm: 24 }
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: 'success.dark',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  Monday Appointments
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ 
                fontSize: { xs: '0.95rem', sm: '1.1rem' }, 
                color: 'success.dark',
                fontWeight: 500,
                lineHeight: 1.4
              }}>
                {companyConfig.scanDayLocations.monday}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            border: '2px solid', 
            borderColor: 'info.main',
            bgcolor: 'info.50',
            '&:hover': { 
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            minHeight: { xs: 'auto', sm: '120px' },
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 2 } }}>
                <LocationOn sx={{ 
                  mr: 1, 
                  color: 'info.dark',
                  fontSize: { xs: 20, sm: 24 }
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: 'info.dark',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  Friday Appointments
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ 
                fontSize: { xs: '0.95rem', sm: '1.1rem' }, 
                color: 'info.dark',
                fontWeight: 500,
                lineHeight: 1.4
              }}>
                {companyConfig.scanDayLocations.friday}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ 
        mt: { xs: 2, sm: 3 }, 
        p: { xs: 2, sm: 2.5 }, 
        bgcolor: 'warning.50',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'warning.main'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Schedule 
            color="warning" 
            sx={{ 
              fontSize: { xs: 20, sm: 24 },
              mt: 0.25,
              flexShrink: 0
            }} 
          />
          <Typography variant="body2" sx={{ 
            fontWeight: 'medium', 
            color: 'warning.dark',
            textAlign: { xs: 'left', sm: 'center' },
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            lineHeight: 1.4,
            flexGrow: 1
          }}>
            <strong>Important:</strong> {isMobile ? 
              'Different locations for Monday vs Friday appointments' : 
              'Please note the different locations for Monday and Friday appointments when booking your time slot'
            }
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
});

ScanDayLocationInfo.displayName = 'ScanDayLocationInfo';

export default ScanDayLocationInfo;