# Android APK Build Guide

## Prerequisites

### Required Software
1. **Node.js** (v14+) - Already installed ✅
2. **Android Studio** - Download from https://developer.android.com/studio
3. **Java JDK** (v11 or v17) - Comes with Android Studio
4. **Android SDK** - Installed via Android Studio

### Android Studio Setup
1. Download and install Android Studio
2. Open Android Studio
3. Go to **Tools > SDK Manager**
4. Install:
   - Android SDK Platform 33 (or latest)
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android Emulator (optional, for testing)

## Project Setup

### 1. Environment Variables
Add to your system environment variables:
```
ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

### 2. Verify Installation
```bash
# Check Java
java -version

# Check Android SDK
adb --version
```

## Building the APK

### Method 1: Using Android Studio (Recommended)

1. **Open Project in Android Studio**
   ```bash
   cd diet-n-health-tracker
   npx cap open android
   ```

2. **Wait for Gradle Sync**
   - Android Studio will automatically sync Gradle
   - This may take 5-10 minutes the first time

3. **Build APK**
   - Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**
   - Wait for build to complete
   - Click "locate" in the notification to find your APK

4. **APK Location**
   ```
   diet-n-health-tracker/android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Method 2: Using Command Line

1. **Sync Capacitor**
   ```bash
   npm run build
   npx cap sync android
   ```

2. **Build Debug APK**
   ```bash
   cd android
   gradlew assembleDebug
   ```

3. **Build Release APK (Signed)**
   ```bash
   cd android
   gradlew assembleRelease
   ```

## Quick Build Scripts

### For Development (Debug APK)
```bash
npm run android:build
```

### For Production (Release APK)
```bash
npm run android:release
```

## Installing APK on Device

### Via USB
1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging**
3. Connect device via USB
4. Run:
   ```bash
   npx cap run android
   ```

### Via APK File
1. Transfer the APK to your device
2. Open the APK file on your device
3. Allow installation from unknown sources if prompted
4. Install the app

## Notification Features

### Implemented Notifications
✅ **Local Notifications** - Scheduled reminders
✅ **Water Intake Reminders** - Every 2 hours (8 AM - 10 PM)
✅ **Meal Reminders** - Breakfast, Lunch, Dinner
✅ **Goal Achievement Alerts**
✅ **Calorie Tracking Alerts**
✅ **Health Test Alerts**

### Testing Notifications
1. Open the app
2. Grant notification permissions when prompted
3. Go to Profile > Settings
4. Enable notification preferences
5. Notifications will be scheduled automatically

## Customization

### App Icon
- Your logo is already set as the app icon
- Located at: `android/app/src/main/res/mipmap-*/ic_launcher.png`

### Splash Screen
- Your logo is set as splash screen
- Located at: `android/app/src/main/res/drawable/splash.png`
- Background color: #4CAF50 (green)

### App Name
- Current: "Diet-N-Health Tracker"
- To change: Edit `android/app/src/main/res/values/strings.xml`

### Package Name
- Current: `com.dietnhealth.tracker`
- To change: Edit `capacitor.config.ts` and rebuild

## Signing the APK (For Release)

### 1. Generate Keystore
```bash
keytool -genkey -v -keystore diet-n-health.keystore -alias diet-n-health -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing
Create `android/key.properties`:
```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=diet-n-health
storeFile=../diet-n-health.keystore
```

### 3. Update build.gradle
Edit `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            def keystorePropertiesFile = rootProject.file("key.properties")
            def keystoreProperties = new Properties()
            keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 4. Build Signed APK
```bash
cd android
gradlew assembleRelease
```

Signed APK location:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting

### Gradle Build Failed
```bash
cd android
gradlew clean
gradlew build
```

### Capacitor Sync Issues
```bash
npx cap sync android --force
```

### Clear Cache
```bash
cd android
gradlew clean
cd ..
rm -rf node_modules
npm install
npm run build
npx cap sync android
```

### Permission Denied
- Make sure USB debugging is enabled
- Check device is authorized (check device screen)
- Try different USB cable/port

### App Crashes on Launch
- Check Android Studio Logcat for errors
- Verify all permissions in AndroidManifest.xml
- Rebuild the app: `npm run build && npx cap sync android`

## Testing on Emulator

### Create Emulator
1. Open Android Studio
2. Go to **Tools > Device Manager**
3. Click **Create Device**
4. Select a device (e.g., Pixel 5)
5. Download a system image (API 33 recommended)
6. Finish setup

### Run on Emulator
```bash
npx cap run android
```

## Publishing to Google Play Store

### 1. Prepare Release
- Build signed release APK
- Test thoroughly on multiple devices
- Prepare screenshots and descriptions

### 2. Create Developer Account
- Go to https://play.google.com/console
- Pay one-time $25 registration fee

### 3. Create App Listing
- Upload APK
- Add screenshots (phone, tablet)
- Write description
- Set content rating
- Add privacy policy URL

### 4. Submit for Review
- Complete all required fields
- Submit for review
- Wait for approval (usually 1-3 days)

## Performance Optimization

### Reduce APK Size
```bash
# Enable ProGuard/R8 in build.gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
        }
    }
}
```

### Enable App Bundle (AAB)
```bash
cd android
gradlew bundleRelease
```

App Bundle location:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Useful Commands

```bash
# Sync web assets to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on device/emulator
npx cap run android

# Check Capacitor doctor
npx cap doctor

# List connected devices
adb devices

# Install APK via ADB
adb install app-debug.apk

# View logs
adb logcat
```

## Support

For issues:
- Check Capacitor docs: https://capacitorjs.com/docs
- Android Studio docs: https://developer.android.com/docs
- Stack Overflow: Tag with `capacitor` and `android`

---

**Your app is ready to build! 🚀**

Start with: `npx cap open android`
