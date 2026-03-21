# Diet-N-Health Tracker

A comprehensive mobile health and nutrition tracking application built with React and Capacitor.

## Features

- **Diet Tracking**: Log meals, track calories, protein, carbs, and fat
- **Health Monitoring**: Record and track health test results
- **Goal Setting**: Set and monitor health and fitness goals
- **Daily Checklists**: Create and manage daily health tasks
- **Reports & Analytics**: Visualize your health data with charts
- **Offline Support**: Works offline with local storage
- **Mobile Optimized**: Native mobile app experience

## Installation

### Android APK
Install the pre-built APK file:
```bash
# Install the APK on your Android device
adb install diet-n-health-tracker-v1.0.0.apk
```

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Build Android APK
npx cap sync
cd android && ./gradlew assembleRelease
```

### Google Login Setup (Optional)
To enable Google authentication:
1. **Quick Setup**: See [QUICK_START_GOOGLE_LOGIN.md](QUICK_START_GOOGLE_LOGIN.md)
2. **Detailed Guide**: See [GOOGLE_LOGIN_SETUP.md](GOOGLE_LOGIN_SETUP.md)
3. **Verify Setup**: Run `node scripts/check-google-auth.js`

Or simply click "Continue Without Login" to use the app with local storage only.

## Tech Stack

- **Frontend**: React 19.2.3
- **Mobile**: Capacitor 6.2.0
- **Routing**: React Router v7
- **Charts**: Recharts
- **Storage**: LocalStorage + Optional Supabase sync
- **Notifications**: Capacitor Local Notifications
- **Build**: Create React App

## Project Structure

```
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React contexts (Auth, App)
│   ├── services/           # API and utility services
│   ├── utils/              # Helper utilities
│   └── App.js              # Main app component
├── android/                # Android Capacitor project
├── public/                 # Static assets
├── database/               # Database schemas
└── diet-n-health-tracker-v1.0.0.apk  # Ready-to-install APK
```

## Usage

1. **Setup Profile**: Complete your user profile for personalized recommendations
2. **Track Diet**: Add meals and monitor your daily nutrition intake
3. **Log Health Data**: Record test results and health metrics
4. **Set Goals**: Create health and fitness goals to track progress
5. **View Reports**: Analyze your data with interactive charts

## Privacy & Data

- **Local First**: All data stored locally on your device
- **Optional Cloud Sync**: Enable Supabase for cross-device sync
- **No Tracking**: No analytics or user tracking
- **Offline Capable**: Works completely offline

## Building & Deployment

### Android APK
```bash
# Build React app
npm run build

# Sync with Capacitor
npx cap sync

# Build APK
cd android && ./gradlew assembleRelease
```

The APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions, please create an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Minimum Android Version**: 7.0 (API 24)