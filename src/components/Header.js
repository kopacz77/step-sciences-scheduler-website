import { ArrowBack, Info, Phone } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { memo } from 'react';

const Header = memo(
  ({ companyConfig, showBackButton = false, onBackClick, currentStep = 0, totalSteps = 3 }) => {
    return (
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: '2px solid',
          borderColor: 'grey.200',
          color: 'text.primary',
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, sm: 64 },
            py: { xs: 0.5, sm: 1 },
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* Back Button for Mobile Navigation */}
          {showBackButton && (
            <IconButton
              onClick={onBackClick}
              sx={{
                mr: 2,
                color: 'primary.main',
                minWidth: 44,
                minHeight: 44,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.dark',
                },
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
                display: { xs: 'none', sm: 'block' },
              }}
            />
          )}

          {/* Main Title - Responsive sizing */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'text.primary',
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
                  fontSize: '0.7rem',
                  color: 'text.secondary',
                  opacity: 0.8,
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
                  color: 'primary.main',
                  minWidth: 44,
                  minHeight: 44,
                  mr: 1,
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.dark',
                  },
                }}
                aria-label={`Contact ${companyConfig.name}`}
              >
                <Phone fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Step Sciences Branding - Minimized */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 1, sm: 2 } }}>
            <Box
              component="img"
              src="/favicon.ico"
              alt="Step Sciences logo"
              sx={{
                height: { xs: 28, sm: 32, md: 36 },
                mr: { xs: 0.5, md: 1 },
                opacity: 0.7,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                display: { xs: 'none', md: 'block' },
                fontSize: '1.1rem',
                fontWeight: 500,
                color: 'text.secondary',
              }}
            >
              Step Sciences
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
);

Header.displayName = 'Header';

export default Header;
