# Mobile Features Documentation

## Overview
Your Diet-N-Health Tracker app is now fully mobile-ready with native Android support and comprehensive notification features.

## 🚀 What's New

### Native Android App
- ✅ Full Capacitor integration
- ✅ Android Studio project ready
- ✅ Native app performance
- ✅ Offline-first architecture
- ✅ Custom app icon and splash screen

### 📱 Mobile Notifications

#### Local Notifications
- **Water Reminders**: Every 2 hours (8 AM - 10 PM)
- **Meal Reminders**: Breakfast, Lunch, Dinner (customizable times)
- **Goal Alerts**: When you achieve daily goals
- **Calorie Tracking**: Alerts when under/over target
- **Health Test Alerts**: Abnormal test result notifications

#### Notification Features
- 🔔 Scheduled notifications (repeating daily)
- 🎨 Custom icons and colors
- 🔊 Sound and vibration
- 📊 Rich notification content
- ⚙️ User-configurable settings

### 🎨 Mobile UI Enhancements
- Responsive design for all screen sizes
- Touch-optimized controls
- Native status bar styling
- Custom splash screen
- Back button handling

## 📦 Installed Packages

```json
{
  "@capacitor/core": "Latest",
  "@capacitor/cli": "Latest",
  "@capacitor/android": "Latest",
  "@capacitor/app": "Latest",
  "@capacitor/splash-screen": "Latest",
  "@capacitor/status-bar": "Latest",
  "@capacitor/local-notifications": "Latest",
  "@capacitor/push-notifications": "Latest"
}
```

## 🔧 Configuration Files

### capacitor.config.ts
- App ID: `com.dietnhealth.tracker`
- App Name: `Diet-N-Health Tracker`
- Splash screen configuration
- Notification settings
- Android-specific options

### AndroidManifest.xml
Added permissions:
- `POST_NOTIFICATIONS` - For Android 13+
- `SCHEDULE_EXACT_ALARM` - For precise timing
- `RECEIVE_BOOT_COMPLETED` - Persist notifications after reboot
- `VIBRATE` - Notification vibration
- `WAKE_LOCK` - Wake device for notifications

## 📱 Using Notifications

### In the App

1. **Enable Notifications**
   - Open app
   - Grant notification permissions when prompted
   - Go to Notifications tab in dashboard

2. **Configure Settings**
   - Toggle water reminders on/off
   - Toggle meal reminders on/off
   - Set custom meal times
   - Enable/disable goal and test alerts

3. **Save Settings**
   - Click "Save Settings" button
   - Notifications are scheduled automatically
   - Click "Test Notification" to verify

### Notification Types

#### Water Reminders 💧
- Frequency: Every 2 hours
- Time Range: 8 AM - 10 PM
- Repeats: Daily
- Can be disabled in settings

#### Meal Reminders 🍴
- Breakfast: Default 8:00 AM (customizable)
- Lunch: Default 1:00 PM (customizable)
- Dinner: Default 7:00 PM (customizable)
- Repeats: Daily
- Can be disabled in settings

#### Goal Alerts 🎯
- Triggered when daily calorie goal is reached
- Alerts if under 50% of goal
- Alerts if over 110% of goal
- Congratulations when within 90-110%

#### Health Test Alerts 🩺
- Triggered when test results are abnormal
- Shows number of abnormal tests
- High priority notification

## 🛠️ Development Commands

```bash
# Build and sync
npm run android:sync

# Build debug APK
npm run android:build

# Build release APK
npm run android:release

# Open in Android Studio
npm run android:open

# Run on device/emulator
npm run android:run
```

## 📲 Building APK

### Quick Method (Windows)
Double-click `BUILD_APK.bat` in the project folder

### Manual Method
1. `npm run build` - Build React app
2. `npx cap sync android` - Sync to Android
3. `npx cap open android` - Open Android Studio
4. Build > Build APK(s)

### APK Location
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## 🧪 Testing Notifications

### On Emulator
1. Start Android emulator
2. Run `npm run android:run`
3. Grant notification permissions
4. Go to Notifications tab
5. Click "Test Notification"

### On Physical Device
1. Enable USB debugging
2. Connect device via USB
3. Run `npm run android:run`
4. Test all notification types

## 🔐 Permissions

### Required Permissions
- **Notifications**: For all notification features
- **Exact Alarms**: For precise scheduling
- **Boot Completed**: To restore notifications after restart
- **Internet**: For API calls and data sync
- **Vibrate**: For notification vibration
- **Wake Lock**: To wake device for notifications

### Requesting Permissions
Permissions are requested automatically:
- On first app launch
- When accessing notification settings
- When scheduling first notification

## 📊 Notification Service API

### Basic Usage
```javascript
import { mobileNotificationService } from './services/mobileNotificationService';

// Initialize (done automatically in App.js)
await mobileNotificationService.initialize();

// Send immediate notification
await mobileNotificationService.sendNotification(
  'Title',
  'Body text',
  { /* options */ }
);

// Schedule notification
await mobileNotificationService.scheduleNotification(
  'Title',
  'Body',
  new Date('2024-01-22T15:00:00'),
  12345 // unique ID
);

// Schedule all reminders
await mobileNotificationService.scheduleAllReminders({
  waterReminder: true,
  mealReminders: true,
  breakfastTime: '08:00',
  lunchTime: '13:00',
  dinnerTime: '19:00'
});

// Cancel all notifications
await mobileNotificationService.cancelAllNotifications();
```

### Advanced Features
```javascript
// Check daily goals
await mobileNotificationService.checkDailyGoals(
  dailyIntake,
  targetMacros
);

// Check test results
await mobileNotificationService.checkTestResults(
  testResults
);

// Water reminder
await mobileNotificationService.remindWaterIntake();

// Meal reminder
await mobileNotificationService.remindMealTime('Breakfast');
```

## 🎨 Customization

### Notification Icons
- Default icon: `ic_stat_icon_config_sample`
- Color: `#4CAF50` (green)
- Located in: `android/app/src/main/res/drawable/`

### Notification Sounds
- Default: System notification sound
- Custom sounds: Place in `android/app/src/main/res/raw/`
- Update in `capacitor.config.ts`

### Splash Screen
- Image: Your logo (`diet-n-health-logo.png`)
- Background: `#4CAF50`
- Duration: 2 seconds
- Spinner: White, large

## 🐛 Troubleshooting

### Notifications Not Showing
1. Check permissions in device settings
2. Verify notification settings in app
3. Check Android version (13+ requires explicit permission)
4. Test with "Test Notification" button

### Notifications Not Repeating
1. Check battery optimization settings
2. Disable battery saver for the app
3. Allow background activity
4. Check "Exact Alarms" permission

### Build Errors
1. Clean project: `cd android && gradlew clean`
2. Sync Capacitor: `npx cap sync android --force`
3. Rebuild: `npm run build && npx cap sync android`

## 📚 Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Local Notifications Plugin](https://capacitorjs.com/docs/apis/local-notifications)
- [Push Notifications Plugin](https://capacitorjs.com/docs/apis/push-notifications)
- [Android Developer Guide](https://developer.android.com/guide)

## 🎉 What's Working

✅ Native Android app
✅ Local notifications with scheduling
✅ Repeating daily reminders
✅ Custom notification times
✅ Water intake reminders
✅ Meal time reminders
✅ Goal achievement alerts
✅ Health test alerts
✅ Notification settings UI
✅ Test notification feature
✅ Offline support
✅ Background notifications
✅ Boot persistence
✅ Custom app icon
✅ Splash screen
✅ Status bar styling

## 🚀 Next Steps

1. **Build APK**: Use `BUILD_APK.bat` or Android Studio
2. **Test on Device**: Install and test all features
3. **Customize**: Adjust notification times and preferences
4. **Deploy**: Sign and publish to Google Play Store

---

**Your mobile app is ready! 📱🎉**

Start building: `npm run android:open`
