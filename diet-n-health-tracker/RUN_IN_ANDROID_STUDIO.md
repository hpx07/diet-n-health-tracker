# 🚀 Run App in Android Studio

## Quick Start

### Method 1: Using npm Command (Easiest)
```bash
npm run android:run
```

### Method 2: Using Capacitor CLI
```bash
npx cap run android
```

### Method 3: Open in Android Studio
```bash
npx cap open android
```
Then click the green "Run" button (▶️) in Android Studio.

---

## Detailed Instructions

### Step 1: Open Android Studio

**Option A: From Command Line**
```bash
cd diet-n-health-tracker
npx cap open android
```

**Option B: Manually**
1. Open Android Studio
2. Click "Open"
3. Navigate to: `diet-n-health-tracker/android`
4. Click "OK"

### Step 2: Wait for Gradle Sync
- Android Studio will automatically sync Gradle
- Wait for "Gradle sync finished" message
- First time takes 2-5 minutes

### Step 3: Setup Device/Emulator

**Option A: Use Physical Device**
1. Enable Developer Options on your phone
2. Enable USB Debugging
3. Connect phone via USB
4. Allow USB debugging on phone
5. Device will appear in Android Studio toolbar

**Option B: Use Emulator**
1. Click "Device Manager" in Android Studio
2. Click "Create Device"
3. Select device (e.g., Pixel 5)
4. Download system image (API 33 recommended)
5. Click "Finish"
6. Start emulator

### Step 4: Run the App

**In Android Studio:**
1. Select your device/emulator from dropdown
2. Click green "Run" button (▶️)
3. Or press `Shift + F10`

**From Terminal:**
```bash
# Make sure you're in the project root
cd diet-n-health-tracker

# Run on connected device/emulator
npx cap run android
```

---

## 📱 Running on Physical Device

### Enable USB Debugging

**Android 11+:**
1. Settings > About Phone
2. Tap "Build Number" 7 times
3. Go back to Settings
4. Settings > System > Developer Options
5. Enable "USB Debugging"

**Android 10 and below:**
1. Settings > About Phone
2. Tap "Build Number" 7 times
3. Settings > Developer Options
4. Enable "USB Debugging"

### Connect Device
1. Connect phone via USB
2. On phone, allow USB debugging
3. Check "Always allow from this computer"
4. Tap "OK"

### Verify Connection
```bash
# Check if device is connected
adb devices

# Should show:
# List of devices attached
# XXXXXXXXXX    device
```

---

## 🖥️ Running on Emulator

### Create Emulator (First Time)

**In Android Studio:**
1. Tools > Device Manager
2. Click "Create Device"
3. Select "Phone" category
4. Choose device (Pixel 5 recommended)
5. Click "Next"
6. Select system image:
   - API Level 33 (Android 13) recommended
   - Click "Download" if not installed
7. Click "Next"
8. Name your emulator
9. Click "Finish"

### Start Emulator
1. Device Manager > Your Emulator
2. Click ▶️ (Play button)
3. Wait for emulator to boot (1-2 minutes)

### Run App on Emulator
```bash
npx cap run android
```

Or click Run button in Android Studio.

---

## 🔧 Terminal Commands

### From Project Root
```bash
# Navigate to project
cd diet-n-health-tracker

# Build React app
npm run build

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on device/emulator
npx cap run android

# Run with live reload (development)
npx cap run android -l --external
```

### From Android Folder
```bash
# Navigate to android folder
cd diet-n-health-tracker/android

# Build debug APK
gradlew assembleDebug

# Build release APK
gradlew assembleRelease

# Install on connected device
gradlew installDebug

# Run app
gradlew installDebug
adb shell am start -n com.dietnhealth.tracker/.MainActivity
```

---

## 📊 View Logs in Real-Time

### In Android Studio
1. Click "Logcat" tab at bottom
2. Select your device
3. Filter by package: `com.dietnhealth.tracker`
4. See all app logs in real-time

### In Terminal
```bash
# View all logs
adb logcat

# Filter by app
adb logcat | grep "Diet"

# Filter by tag
adb logcat -s ReactNativeJS

# Clear logs
adb logcat -c

# Save logs to file
adb logcat > app-logs.txt
```

---

## 🐛 Debugging

### Enable Chrome DevTools
1. Run app on device/emulator
2. Open Chrome browser
3. Go to: `chrome://inspect`
4. Click "inspect" under your app
5. Use Chrome DevTools to debug JavaScript

### View Console Logs
The app now has console.log statements:
- "Initializing app..."
- "Notifications initialized"
- "AuthContext: Initializing..."
- "App initialization complete"

### Check for Errors
```bash
# View errors only
adb logcat *:E

# View warnings and errors
adb logcat *:W
```

---

## 🔄 Live Reload (Development)

### Setup Live Reload
```bash
# Run with live reload
npx cap run android -l --external

# Or manually:
# 1. Get your computer's IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# 2. Update capacitor.config.ts
# Add server configuration

# 3. Run React dev server
npm start

# 4. Run app
npx cap run android
```

---

## 📱 Quick Commands Reference

### Essential Commands
```bash
# Open Android Studio
npx cap open android

# Run on device
npx cap run android

# View logs
adb logcat | grep "Diet"

# List devices
adb devices

# Install APK
adb install app-debug.apk

# Uninstall app
adb uninstall com.dietnhealth.tracker

# Clear app data
adb shell pm clear com.dietnhealth.tracker

# Restart app
adb shell am force-stop com.dietnhealth.tracker
adb shell am start -n com.dietnhealth.tracker/.MainActivity
```

### Build Commands
```bash
# Full rebuild
npm run build
npx cap sync android
cd android
gradlew clean assembleDebug

# Quick rebuild
npm run build
npx cap sync android
```

---

## 🎯 Troubleshooting

### "No devices found"
```bash
# Check ADB
adb devices

# Restart ADB
adb kill-server
adb start-server

# Check USB debugging enabled on phone
```

### "Gradle sync failed"
```bash
cd android
gradlew clean
gradlew build
```

### "App not installing"
```bash
# Uninstall old version
adb uninstall com.dietnhealth.tracker

# Install new version
adb install app-debug.apk
```

### "White screen in emulator"
- Wait 30 seconds for app to load
- Check Logcat for errors
- Restart emulator
- Clear app data

### "Build failed"
```bash
# Clean everything
cd android
gradlew clean
cd ..
rm -rf node_modules
npm install
npm run build
npx cap sync android
```

---

## 🚀 Quick Start Script

Create a file `run-android.bat`:
```batch
@echo off
echo Building React app...
call npm run build

echo Syncing to Android...
call npx cap sync android

echo Running on device...
call npx cap run android

pause
```

Then just double-click `run-android.bat` to run!

---

## 📝 Notes

### Performance
- **Emulator**: Slower, good for testing
- **Physical Device**: Faster, better for development

### Debugging
- Use Chrome DevTools for JavaScript debugging
- Use Logcat for native Android logs
- Use React DevTools for component inspection

### Hot Reload
- Changes to JavaScript require rebuild
- Changes to native code require full rebuild
- Use live reload for faster development

---

## ✅ Success Checklist

- [ ] Android Studio installed
- [ ] Device/emulator ready
- [ ] USB debugging enabled (for device)
- [ ] ADB working (`adb devices` shows device)
- [ ] Gradle sync completed
- [ ] App runs successfully
- [ ] Can see logs in Logcat
- [ ] Can debug with Chrome DevTools

---

**Ready to run!** 🎉

**Quick command**: `npx cap run android`
