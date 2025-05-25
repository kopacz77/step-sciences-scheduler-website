import { Box, Typography, AppBar, Toolbar } from '@mui/material';

const Header = ({ companyConfig }) => {
  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar sx={{ minHeight: { xs: 70, sm: 80 }, py: 1 }}>
        {companyConfig.logo && (
          <Box 
            component="img" 
            src={companyConfig.logo} 
            alt={`${companyConfig.name} logo`}
            sx={{ height: 50, mr: 2, display: { xs: 'none', sm: 'block' } }}
          />
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: { xs: '1.3rem', sm: '1.6rem' }, fontWeight: 500 }}>
          {companyConfig.name} Appointment Scheduling
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Box 
            component="img" 
            src="/favicon.ico" 
            alt="Step Sciences logo"
            sx={{ 
              height: 75, 
              mr: 1.5,
              display: { xs: 'none', md: 'block' }
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
};

export default Header;