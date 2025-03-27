const companyConfigs = {
  'gm-oshawa': {
    name: 'GM Oshawa',
    fullName: 'General Motors Oshawa Assembly',
    primaryColor: '#000000', // Black
    secondaryColor: '#D4AF37', // Gold
    logo: '/logos/gm-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ13iuKCFJo-LEdLYI0xL61iPO3DA4XB5di_P9b7NQ05dR2qYKjYKjCu9hzYaBn3G2-p8o2qDoE9',
    intakeFormUrl: 'https://step-sciences-project-1.web.app/',
    contactEmail: 'support@stepsciences.com',
    showBranding: true,
  },
  // Example of another company config
  'sample-company': {
    name: 'Sample Company',
    fullName: 'Sample Manufacturing Plant',
    primaryColor: '#000000', // Black
    secondaryColor: '#D4AF37', // Gold
    logo: '/logos/sample-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/embed?src=sample',
    intakeFormUrl: 'https://step-sciences-project-1.web.app/?company=sample',
    contactEmail: 'support@stepsciences.com',
    showBranding: true,
  }
};

export const getCompanyConfig = (companyId) => {
  // Default to gm-oshawa if no company is specified or not found
  if (!companyId || !companyConfigs[companyId]) {
    return companyConfigs['gm-oshawa'];
  }
  return companyConfigs[companyId];
};

export default companyConfigs;
