// src/config/companyConfigs.js
const companyConfigs = {
  'gm-oshawa': {
  name: 'GM Oshawa',
  fullName: 'General Motors Oshawa Assembly',
  primaryColor: '#000000', 
  secondaryColor: '#D4AF37',
  logo: '/logos/gm-logo.png',
  calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ13iuKCFJo-LEdLYI0xL61iPO3DA4XB5di_P9b7NQ05dR2qYKjYKjCu9hzYaBn3G2-p8o2qDoE9',
  intakeFormUrl: 'https://step-sciences.web.app/intake/gm/oshawa', // NEW URL
  contactEmail: 'info@stepsciences.com',
  showBranding: true,
  // Remove the single meetingLocation and replace with dual locations
  scanDayLocations: {
    monday: 'Building C - Medical Offices next to SUD Office',
    friday: 'Building D - TFT Boardrooms (east end of building D)'
  },
  specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.',
  domain: 'gmoshawa.stepsciences.com',
  // Add scan day feature flag
  hasScanDays: true
},
  
  'gm-cami': {
    name: 'GM CAMI',
    fullName: 'General Motors CAMI Assembly',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/gm-logo.png',  // Can use same logo for both GM plants
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1Qf9K1O090x0jfhUtHXSjuqYWoMPt-qnoOprYgAFZ6t4YTono4Vu2wzhrZyCzP4VaPsQe8z7oW',
    intakeFormUrl: 'https://step-sciences.web.app/intake/gm/cami',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Unifor local 88 hall',
    specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.',
    domain: 'gmcami.stepsciences.com'
  },
  
  'stellantis-windsor': {
    name: 'Stellantis Windsor',
    fullName: 'Stellantis Windsor Assembly Plant',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/stellantis-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1kC5ubA-6Nc_ZIYopLxcxhZf27MKHL2DKtEWo12EK8jJ3Bs-mUJiDlFSNPht7VZjW0I24hyLcX',
    intakeFormUrl: 'https://step-sciences.web.app/intake/stellantis/windsor',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Health Services Wing, Second Floor',
    specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.',
    domain: 'stellantiswindsor.stepsciences.com'
  },
  
  'ford-windsor': {
    name: 'Ford Windsor',
    fullName: 'Ford Windsor Engine Plant',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/ford-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/YOUR_FORD_WINDSOR_CALENDAR_ID_HERE',
    intakeFormUrl: 'https://step-sciences.web.app/intake/ford/ford-windsor',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Medical Office, Building C',
    specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.',
    domain: 'fordwindsor.stepsciences.com'
  },

  'windsor-unifor-200-444': {
    name: 'Unifor 200/444',
    fullName: 'Unifor Windsor Local 200/444',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/unifor-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2voIAfvaNtU0C0SdpmkJSv9vpM_fEjYXYab4XVbAwAiNA2J5OCRVNmHvfSIvbFSMItsNzMr8Vs',
    intakeFormUrl: 'https://step-sciences.web.app/intake/stellantis/windsor',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Basement of the Unifor Hall',
    specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.',
    domain: 'uniforwindsor.stepsciences.com'
  },
  
  'stellantis-brampton': {
    name: 'Stellantis Brampton',
    fullName: 'Stellantis Brampton Assembly Plant',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/stellantis-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ352MeLCrtbXyHXmoAj_vQQMaF1Kc7xnGw6ozocHElXDtmxIUVHCad0CEPuXfY9u6JzDFXDcryD',
    intakeFormUrl: 'https://step-sciences.web.app/intake/stellantis/brampton',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Health Services Department, Main Administration Building',
    specialInstructions: 'Check in at security desk before proceeding to appointment. Please Bring Health Card and Greenshield Card to the appointment.',
    domain: 'stellantisbrampton.stepsciences.com'
  },
  
  'ford-oakville': {
    name: 'Ford Oakville',
    fullName: 'Ford Oakville Assembly Complex',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/ford-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/YOUR_FORD_OAKVILLE_CALENDAR_ID_HERE',
    intakeFormUrl: 'https://step-sciences.web.app/intake/ford/oakville',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Medical Center, First Floor',
    specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.',
    domain: 'fordoakville.stepsciences.com'
  },

  'copernicus-lodge': {
  name: 'Copernicus Lodge',
  fullName: 'Copernicus Lodge Toronto',
  primaryColor: '#000000', // Standard black (same as other clients)
  secondaryColor: '#D4AF37', // Standard gold (same as other clients)
  logo: '/logos/copernicus-lodge.png',
  calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0f5-nJpsx_uNkfZjXbvtQ1sQRCtWNEV64db7YUkMM1i-_sgf9hjajZB6z-a0iCKU7qbnsNNWaK',
  intakeFormUrl: 'https://step-sciences.web.app/intake/not-applicable/not-applicable',
  contactEmail: 'info@stepsciences.com',
  showBranding: true,
  meetingLocation: 'Copernicus Lodge, 66 Roncesvalles Ave, Toronto, ON',
  specialInstructions: 'Please bring valid ID and any relevant documentation to your appointment.',
  domain: 'copernicus-lodge.stepsciences.com'
}

};

// Domain detection helper
export const getCompanyIdFromDomain = () => {
  const hostname = window.location.hostname.toLowerCase();
  
  // Automotive clients
  if (hostname.includes('gmoshawa.stepsciences.com')) return 'gm-oshawa';
  if (hostname.includes('gmcami.stepsciences.com')) return 'gm-cami';
  if (hostname.includes('stellantiswindsor.stepsciences.com')) return 'stellantis-windsor';
  if (hostname.includes('fordwindsor.stepsciences.com')) return 'ford-windsor';
  if (hostname.includes('uniforwindsor.stepsciences.com')) return 'windsor-unifor-200-444';
  if (hostname.includes('stellantisbrampton.stepsciences.com')) return 'stellantis-brampton';
  if (hostname.includes('fordoakville.stepsciences.com')) return 'ford-oakville';
  
  // Lodge/hospitality clients
  if (hostname.includes('copernicus-lodge.stepsciences.com')) return 'copernicus-lodge';
  
  // Main domain with parameters (fallback)
  if (hostname.includes('appointments.stepsciences.com') || 
      hostname.includes('localhost') || 
      hostname.includes('127.0.0.1')) {
    const urlParams = new URLSearchParams(window.location.search);
    const companyParam = urlParams.get('company');
    if (companyParam) return companyParam;
  }
  
  return 'gm-oshawa'; // Default
};

export const getCompanyConfig = (companyId) => {
  // Default to gm-oshawa if no company is specified or not found
  if (!companyId || !companyConfigs[companyId]) {
    return companyConfigs['gm-oshawa'];
  }
  return companyConfigs[companyId];
};

export default companyConfigs;