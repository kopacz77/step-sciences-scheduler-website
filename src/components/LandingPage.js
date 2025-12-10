import { ArrowForward, CheckCircle, Launch, Schedule } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { memo } from 'react';

const LandingPage = memo(({ companyConfig, onNavigateToScheduler }) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  if (!companyConfig || !companyConfig.landingPageEnabled) {
    // If landing page is disabled, go straight to scheduler
    onNavigateToScheduler();
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: companyConfig.landingPageBackgroundImage
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${companyConfig.landingPageBackgroundImage})`
          : `linear-gradient(135deg, ${companyConfig.primaryColor}08 0%, ${companyConfig.primaryColor}15 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 }, flexGrow: 1 }}>
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}>
            {/* Company Logo */}
            {companyConfig.landingPageShowCompanyLogo && companyConfig.logo && (
              <Box
                component="img"
                src={companyConfig.logo}
                alt={`${companyConfig.name} logo`}
                sx={{
                  height: { xs: 60, sm: 80, md: 100 },
                  mb: { xs: 3, sm: 4 },
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                }}
              />
            )}

            {/* Main Title */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 700,
                color: 'text.primary',
                mb: { xs: 2, sm: 3 },
                lineHeight: 1.2,
                textShadow: companyConfig.landingPageBackgroundImage
                  ? '2px 2px 4px rgba(0,0,0,0.3)'
                  : 'none',
              }}
            >
              {companyConfig.landingPageTitle}
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: '1.3rem', sm: '1.6rem', md: '1.8rem' },
                fontWeight: 500,
                color: 'text.secondary',
                mb: { xs: 3, sm: 4 },
                maxWidth: '800px',
                mx: 'auto',
                textShadow: companyConfig.landingPageBackgroundImage
                  ? '1px 1px 2px rgba(0,0,0,0.3)'
                  : 'none',
              }}
            >
              {companyConfig.landingPageSubtitle}
            </Typography>

            {/* Primary CTA Button */}
            <Button
              variant="contained"
              size="large"
              onClick={onNavigateToScheduler}
              startIcon={<Schedule sx={{ fontSize: { xs: 24, sm: 28 } }} />}
              endIcon={<ArrowForward sx={{ fontSize: { xs: 20, sm: 24 } }} />}
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                py: { xs: 2, sm: 2.5 },
                px: { xs: 4, sm: 6 },
                fontWeight: 700,
                borderRadius: 4,
                boxShadow: `0 8px 25px ${companyConfig.primaryColor}40`,
                backgroundColor: companyConfig.primaryColor,
                '&:hover': {
                  boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                  transform: 'translateY(-2px)',
                },
                animation: 'pulse 3s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              {companyConfig.landingPageCtaText}
            </Button>
          </Box>
        </Fade>

        {/* Content Section */}
        <Grid container spacing={{ xs: 3, sm: 4 }} sx={{ mb: { xs: 4, sm: 6 } }}>
          {/* Description Card - Full Width */}
          <Grid item xs={12}>
            <Fade in timeout={1000} style={{ transitionDelay: '200ms' }}>
              <Card
                elevation={0}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: `${companyConfig.primaryColor}30`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: companyConfig.primaryColor,
                      fontSize: { xs: '1.4rem', sm: '1.6rem' },
                    }}
                  >
                    About Our Services
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '1.05rem', sm: '1.15rem' },
                      lineHeight: 1.8,
                      color: 'text.primary',
                      fontWeight: 500,
                    }}
                  >
                    {companyConfig.landingPageDescription}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Features Card - Left Side */}
          <Grid item xs={12} md={5}>
            <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: `${companyConfig.primaryColor}25`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: companyConfig.primaryColor,
                      fontSize: { xs: '1.4rem', sm: '1.6rem' },
                    }}
                  >
                    What We Offer
                  </Typography>
                  <List dense sx={{ pt: 1 }}>
                    {companyConfig.landingPageFeatures?.map((feature) => (
                      <ListItem key={feature} sx={{ px: 0, py: { xs: 0.75, sm: 1 } }}>
                        <ListItemIcon sx={{ minWidth: { xs: 36, sm: 40 } }}>
                          <CheckCircle
                            sx={{
                              color: companyConfig.primaryColor,
                              fontSize: { xs: 24, sm: 28 },
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            fontWeight: 600,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Product Showcase - Right Side */}
          <Grid item xs={12} md={7} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Fade in timeout={1200} style={{ transitionDelay: '600ms', width: '100%' }}>
              <Card
                elevation={0}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: `${companyConfig.primaryColor}20`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: { xs: 1.5, sm: 2 },
                  position: 'relative',
                  overflow: 'hidden',
                  width: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  },
                }}
              >
                {/* Background Gradient Circle */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '70%',
                    height: '80%',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${companyConfig.primaryColor}10 0%, transparent 70%)`,
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                    },
                  }}
                />

                {/* Insole Image */}
                <Box
                  component="img"
                  src="/insole-showcase.png"
                  alt="3D Printed Custom Insole Technology"
                  sx={{
                    position: 'relative',
                    width: '98%',
                    maxWidth: '700px',
                    height: 'auto',
                    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.15))',
                    animation: 'floatImage 6s ease-in-out infinite',
                    '@keyframes floatImage': {
                      '0%, 100%': { transform: 'translateY(0px) rotate(-3deg)' },
                      '50%': { transform: 'translateY(-15px) rotate(-3deg)' },
                    },
                  }}
                />

                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '8%',
                    right: '8%',
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${companyConfig.primaryColor}20, transparent)`,
                    animation: 'pulse 4s ease-in-out infinite',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '12%',
                    left: '6%',
                    width: 35,
                    height: 35,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${companyConfig.primaryColor}30, transparent)`,
                    animation: 'pulse 5s ease-in-out infinite',
                  }}
                />
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Call to Action Section */}
        <Fade in timeout={1200} style={{ transitionDelay: '600ms' }}>
          <Card
            elevation={0}
            sx={{
              textAlign: 'center',
              py: { xs: 4, sm: 6 },
              px: { xs: 3, sm: 5 },
              backgroundColor: `${companyConfig.primaryColor}08`,
              border: '3px solid',
              borderColor: `${companyConfig.primaryColor}30`,
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                borderColor: `${companyConfig.primaryColor}50`,
              },
            }}
          >
            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontSize: { xs: '1.6rem', sm: '2.2rem' },
                fontWeight: 700,
                color: companyConfig.primaryColor,
                mb: { xs: 2, sm: 3 },
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                mb: { xs: 3, sm: 4 },
                color: 'text.secondary',
                maxWidth: '650px',
                mx: 'auto',
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              {isMobile
                ? 'Book your assessment in just 2 steps.'
                : 'Schedule your professional health assessment today. The process takes just a few minutes and both booking and intake form are required.'}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={onNavigateToScheduler}
              startIcon={<Launch sx={{ fontSize: { xs: 24, sm: 28 } }} />}
              sx={{
                fontSize: { xs: '1.15rem', sm: '1.3rem' },
                py: { xs: 2, sm: 2.5 },
                px: { xs: 4, sm: 6 },
                fontWeight: 700,
                borderRadius: 3,
                backgroundColor: companyConfig.primaryColor,
                boxShadow: `0 6px 20px ${companyConfig.primaryColor}40`,
                textTransform: 'none',
                '&:hover': {
                  filter: 'brightness(1.1)',
                  transform: 'translateY(-3px)',
                  boxShadow: `0 8px 25px ${companyConfig.primaryColor}50`,
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {isMobile ? 'Start Booking' : 'Begin Scheduling Process'}
            </Button>
          </Card>
        </Fade>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: { xs: 2.5, sm: 3 },
          px: 2,
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '2px solid',
          borderColor: `${companyConfig.primaryColor}20`,
          boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: { xs: 'center', sm: 'left' },
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src="/favicon.ico"
                alt="Step Sciences logo"
                sx={{
                  height: { xs: 32, sm: 40 },
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                  fontWeight: 500,
                }}
              >
                &copy; {new Date().getFullYear()} Step Sciences
              </Typography>
            </Box>
            {companyConfig.showBranding && !isMobile && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Professional Health & Performance Solutions
              </Typography>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
});

LandingPage.displayName = 'LandingPage';

export default LandingPage;
