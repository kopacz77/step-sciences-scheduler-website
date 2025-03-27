// src/config/companyConfigs.js
const companyConfigs = {
  'gm-oshawa': {
    name: 'GM Oshawa',
    fullName: 'General Motors Oshawa Assembly',
    primaryColor: '#000000', 
    secondaryColor: '#D4AF37',
    logo: '/logos/gm-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ13iuKCFJo-LEdLYI0xL61iPO3DA4XB5di_P9b7NQ05dR2qYKjYKjCu9hzYaBn3G2-p8o2qDoE9',
    intakeFormUrl: 'https://step-sciences-project-1.web.app/',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Building A, Room 101 - Enter through south entrance',
    specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.'
  },
  
  'gm-cami': {
    name: 'GM CAMI',
    fullName: 'General Motors CAMI Assembly',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/gm-logo.png',  // Can use same logo for both GM plants
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1Qf9K1O090x0jfhUtHXSjuqYWoMPt-qnoOprYgAFZ6t4YTono4Vu2wzhrZyCzP4VaPsQe8z7oW',
    intakeFormUrl: 'https://step-sciences-project-1.web.app/',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Unifor local 88 hall',
    specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.'
  },
  
  'stellantis-windsor': {
    name: 'Stellantis Windsor',
    fullName: 'Stellantis Windsor Assembly Plant',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/stellantis-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1kC5ubA-6Nc_ZIYopLxcxhZf27MKHL2DKtEWo12EK8jJ3Bs-mUJiDlFSNPht7VZjW0I24hyLcX',
    intakeFormUrl: 'https://step-sciences-project-1.web.app/',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Health Services Wing, Second Floor',
    specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.'
  },
  
  'ford-windsor': {
    name: 'Ford Windsor',
    fullName: 'Ford Windsor Engine Plant',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/ford-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/YOUR_FORD_WINDSOR_CALENDAR_ID_HERE',
    intakeFormUrl: 'https://step-sciences-project-1.web.app/',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Medical Office, Building C',
    specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.'
  },

  'windsor-unifor-200/444': {
    name: 'Unifor 200/444',
    fullName: 'Unifor Windsor Local 200/444',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/unifor-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2voIAfvaNtU0C0SdpmkJSv9vpM_fEjYXYab4XVbAwAiNA2J5OCRVNmHvfSIvbFSMItsNzMr8Vs',
    intakeFormUrl: 'https://step-sciences-project-1.web.app/',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Basement of the Unifor Hall',
    specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.'
  },
  
  'stellantis-brampton': {
    name: 'Stellantis Brampton',
    fullName: 'Stellantis Brampton Assembly Plant',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/stellantis-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ352MeLCrtbXyHXmoAj_vQQMaF1Kc7xnGw6ozocHElXDtmxIUVHCad0CEPuXfY9u6JzDFXDcryD',
    intakeFormUrl: 'https://step-sciences-project-1.web.app/',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Health Services Department, Main Administration Building',
    specialInstructions: 'Check in at security desk before proceeding to appointment. Please Bring Health Card and Greenshield Card to the appointment.'
  },
  
  'ford-oakville': {
    name: 'Ford Oakville',
    fullName: 'Ford Oakville Assembly Complex',
    primaryColor: '#000000',
    secondaryColor: '#D4AF37',
    logo: '/logos/ford-logo.png',
    calendarUrl: 'https://calendar.google.com/calendar/u/0/appointments/schedules/YOUR_FORD_OAKVILLE_CALENDAR_ID_HERE',
    intakeFormUrl: 'https://step-sciences-project-1.web.app/',
    contactEmail: 'info@stepsciences.com',
    showBranding: true,
    meetingLocation: 'Medical Center, First Floor',
    specialInstructions: 'Please Bring Health Card and Greenshield Card to the appointment.'
  }
};

// Domain detection helper
export const getCompanyIdFromDomain = () => {
  const hostname = window.location.hostname.toLowerCase();
  
  if (hostname.includes('gmoshawa')) return 'gm-oshawa';
  if (hostname.includes('gmcami')) return 'gm-cami';
  if (hostname.includes('stellantiswindsor')) return 'stellantis-windsor';
  if (hostname.includes('fordwindsor')) return 'ford-windsor';
  if (hostname.includes('unifor222/444')) return 'windsor-unifor-200/444';
  if (hostname.includes('stellantisbrampton')) return 'stellantis-brampton';
  if (hostname.includes('fordoakville')) return 'ford-oakville';
  
  // Default fallback
  return 'gm-oshawa';
};

export const getCompanyConfig = (companyId) => {
  // Default to gm-oshawa if no company is specified or not found
  if (!companyId || !companyConfigs[companyId]) {
    return companyConfigs['gm-oshawa'];
  }
  return companyConfigs[companyId];
};

export default companyConfigs;