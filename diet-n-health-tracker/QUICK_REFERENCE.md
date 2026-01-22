# 🚀 Quick Reference Card

## Build APK in 3 Steps

### Windows (Easiest)
```
1. Double-click BUILD_APK.bat
2. Wait for Android Studio to open
3. Build > Build APK(s)
```

### Command Line
```bash
npm run android:open
# Then in Android Studio: Build > Build APK(s)
```

## Essential Commands

```bash
# Open Android Studio
npm run android:open

# Build debug APK
npm run android:build

# Run on device
npm run android:run

# Sync changes
npm run android:sync
```

## APK Location
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Notification Features

| Feature | Default | Customizable |
|---------|---------|--------------|
| Water Reminders | Every 2 hours (8 AM - 10 PM) | ✅ On/Off |
| Breakfast | 8:00 AM | ✅ Time |
| Lunch | 1:00 PM | ✅ Time |
| Dinner | 7:00 PM | ✅ Time |
| Goal Alerts | Enabled | ✅ On/Off |
| Test Alerts | Enabled | ✅ On/Off |

## Testing Notifications

1. Open app
2. Go to 🔔 Notifications tab
3. Click "Test Notification"
4. Configure settings
5. Click "Save Settings"

## Troubleshooting

### Build fails?
```bash
cd android
gradlew clean
cd ..
npm run build
npx cap sync android
```

### Notifications not working?
- Check device notification permissions
- Disable battery optimization
- Grant "Exact Alarms" permission

## App Details

- **Name**: Diet-N-Health Tracker
- **Package**: com.dietnhealth.tracker
- **Version**: 0.1.0

## Documentation

- `ANDROID_BUILD_GUIDE.md` - Complete build guide
- `MOBILE_FEATURES.md` - Feature documentation
- `ANDROID_SETUP_COMPLETE.md` - Setup summary

## Prerequisites

- ✅ Node.js installed
- ⚠️ Android Studio (download if needed)
- ⚠️ Java JDK (comes with Android Studio)

## Quick Start

```bash
# 1. Install Android Studio
# Download: https://developer.android.com/studio

# 2. Open project
npm run android:open

# 3. Build APK
# In Android Studio: Build > Build APK(s)

# Done! 🎉
```

---

**Need help?** Check `ANDROID_BUILD_GUIDE.md`
