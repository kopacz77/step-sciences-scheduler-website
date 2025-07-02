import { Box, Typography, AppBar, Toolbar, IconButton, Tooltip } from '@mui/material';
import { ArrowBack, Phone, Info } from '@mui/icons-material';
import { memo } from 'react';

const Header = memo(({ companyConfig, showBackButton = false, onBackClick, currentStep = 0, totalSteps = 3 }) => {
  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar sx={{ 
        minHeight: { xs: 70, sm: 80 }, 
        py: 1,
        px: { xs: 2, sm: 3 }
      }}>
        {/* Back Button for Mobile Navigation */}
        {showBackButton && (
          <IconButton
            onClick={onBackClick}
            sx={{
              mr: 2,
              color: 'white',
              minWidth: 44,
              minHeight: 44,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
            aria-label="Go back to previous step"
          >
            <ArrowBack />
          </IconButton>
        )}

        {/* Company Logo - Hidden on mobile for space */}
        {companyConfig.logo && (
          <Box 
            component="img" 
            src={companyConfig.logo} 
            alt={`${companyConfig.name} logo`}
            sx={{ 
              height: { xs: 40, sm: 50 }, 
              mr: { xs: 1, sm: 2 }, 
              display: { xs: 'none', sm: 'block' } 
            }}
          />
        )}

        {/* Main Title - Responsive sizing */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.6rem' }, 
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {companyConfig.name} Scheduling
          </Typography>
          
          {/* Mobile Step Indicator */}
          {currentStep > 0 && (
            <Typography 
              variant="caption" 
              sx={{ 
                display: { xs: 'block', sm: 'none' },
                fontSize: '0.75rem',
                opacity: 0.9
              }}
            >
              Step {currentStep} of {totalSteps}
            </Typography>
          )}
        </Box>

        {/* Contact Info - Quick Access */}
        {companyConfig.contactEmail && (
          <Tooltip title={`Contact: ${companyConfig.contactEmail}`}>
            <IconButton
              component="a"
              href={`mailto:${companyConfig.contactEmail}`}
              sx={{
                color: 'white',
                minWidth: 44,
                minHeight: 44,
                mr: 1,
                display: { xs: 'none', sm: 'flex' },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
              aria-label={`Contact ${companyConfig.name}`}
            >
              <Phone fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        
        {/* Step Sciences Branding */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 1, sm: 2 } }}>
          <Box 
            component="img" 
            src="/favicon.ico" 
            alt="Step Sciences logo"
            sx={{ 
              height: { xs: 32, sm: 40, md: 50 }, 
              mr: { xs: 0.5, md: 1.5 }
            }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              display: { xs: 'none', md: 'block' }, 
              fontSize: '1.75rem',
              fontWeight: 500,
              color: '#F0B537'
            }}
          >
            Step Sciences
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
});

Header.displayName = 'Header';

export default Header;