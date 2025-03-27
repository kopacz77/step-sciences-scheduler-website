# GM Oshawa Scheduler Deployment Guide

This guide will help you deploy the GM Oshawa Scheduler (or any company-specific scheduler) to a custom domain using Firebase Hosting.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [pnpm](https://pnpm.io/installation) for package management
- [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli)
- A Google Workspace account for managing custom domains

## Project Setup

1. Clone the repository:
```bash
git clone <your-repository-url>
cd gm-oshawa-scheduler
```

2. Install dependencies:
```bash
pnpm install
```

3. Add your company configuration:
   - Open `src/config/companyConfigs.js`
   - Add or modify company configurations as needed
   - Ensure you have the correct Google Calendar URL and intake form URL

4. Prepare company assets:
   - Add company logos to the `public/logos/` directory
   - Update favicon and manifest.json in the public directory if needed

## Testing Locally

1. Start the development server:
```bash
pnpm dev
```

2. Test different company configurations by using URL parameters:
```
http://localhost:3000/?company=gm-oshawa
```

## Building for Production

1. Build the project:
```bash
pnpm build
```

This will create a production-ready build in the `build` directory.

## Firebase Deployment

1. Initialize Firebase (if not already done):
```bash
firebase login
firebase init
```

2. Select "Hosting" when prompted for features
3. Select or create a Firebase project
4. Specify "build" as your public directory
5. Configure as a single-page app (yes)
6. Set up automatic deploys (optional)

7. Deploy to Firebase:
```bash
firebase deploy
```

## Custom Domain Setup

1. Log in to your Google Workspace Admin Console
2. Go to Domains > Manage Domains
3. Add your custom domain (e.g., appointments.gmoshawa.com)
4. Verify domain ownership
5. Configure DNS settings as instructed by Firebase Hosting
6. Set up the necessary CNAME or A records

7. Connect your custom domain to Firebase:
```bash
firebase hosting:channel:deploy production
firebase hosting:sites:add your-custom-domain
firebase hosting:sites:update your-custom-domain
```

8. Configure custom domain in Firebase console:
   - Go to Firebase Console > Hosting
   - Click "Add custom domain"
   - Follow the prompts to complete the setup

## Updating the Deployment

When you need to update the website:

1. Make your changes
2. Test locally
3. Build:
```bash
pnpm build
```

4. Deploy:
```bash
firebase deploy
```

## Maintenance

- Regularly check that the Google Calendar appointment links are working
- Update the company configurations as needed
- Monitor Firebase Analytics for usage patterns

## Troubleshooting

- If the calendar doesn't load, check the Google Calendar sharing settings
- If the intake form link doesn't work, verify the URL in the company config
- For deployment issues, check the Firebase deployment logs:
```bash
firebase deploy --debug
```

## Security Considerations

- The application uses localStorage to keep track of a user's progress
- No sensitive information is stored in the browser
- All user data collection happens in the secure intake form