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
          : `linear-gradient(135deg, ${companyConfig.primaryColor}15 0%, ${companyConfig.secondaryColor}15 100%)`,
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
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                background: `linear-gradient(45deg, ${companyConfig.primaryColor}, ${companyConfig.secondaryColor})`,
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
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: companyConfig.primaryColor,
                      fontSize: { xs: '1.3rem', sm: '1.5rem' },
                    }}
                  >
                    About Our Services
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      lineHeight: 1.7,
                      color: 'text.primary',
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
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: companyConfig.primaryColor,
                      fontSize: { xs: '1.3rem', sm: '1.5rem' },
                    }}
                  >
                    What We Offer
                  </Typography>
                  <List dense sx={{ pt: 0 }}>
                    {companyConfig.landingPageFeatures?.map((feature) => (
                      <ListItem key={feature} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle
                            sx={{
                              color: companyConfig.secondaryColor,
                              fontSize: { xs: 20, sm: 22 },
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            fontSize: { xs: '0.95rem', sm: '1rem' },
                            fontWeight: 500,
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
          <Grid item xs={12} md={7}>
            <Fade in timeout={1200} style={{ transitionDelay: '600ms' }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: { xs: 2, sm: 3 },
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background Gradient Circle */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '70%',
                    height: '70%',
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
                    width: '100%',
                    maxWidth: '500px',
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
                    top: '10%',
                    right: '10%',
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${companyConfig.secondaryColor}30, transparent)`,
                    animation: 'pulse 4s ease-in-out infinite',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '15%',
                    left: '8%',
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
              py: { xs: 4, sm: 5 },
              px: { xs: 3, sm: 4 },
              backgroundColor: `${companyConfig.primaryColor}08`,
              border: '2px solid',
              borderColor: `${companyConfig.primaryColor}20`,
              borderRadius: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h3"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem' },
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
                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                mb: { xs: 3, sm: 4 },
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
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
              startIcon={<Launch sx={{ fontSize: { xs: 22, sm: 26 } }} />}
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                py: { xs: 1.5, sm: 2 },
                px: { xs: 3, sm: 5 },
                fontWeight: 600,
                borderRadius: 3,
                backgroundColor: companyConfig.secondaryColor,
                '&:hover': {
                  backgroundColor: companyConfig.primaryColor,
                  transform: 'translateY(-1px)',
                },
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
          py: { xs: 2, sm: 3 },
          px: 2,
          backgroundColor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid',
          borderColor: 'grey.200',
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
                sx={{ height: { xs: 30, sm: 40 } }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                &copy; {new Date().getFullYear()} Step Sciences
              </Typography>
            </Box>
            {companyConfig.showBranding && !isMobile && (
              <Typography variant="body2" color="text.secondary">
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
