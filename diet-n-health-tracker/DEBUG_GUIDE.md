# 🐛 Debug Guide - Android Studio

## Complete Debugging Guide for Diet-N-Health Tracker

---

## 🎯 Quick Debug Setup

### 1. Enable Web Debugging (Already Enabled!)
Your app already has `webContentsDebuggingEnabled: true` in `capacitor.config.ts`

### 2. Run App in Debug Mode
```bash
cd diet-n-health-tracker
npx cap run android
```

### 3. Open Chrome DevTools
1. Open Chrome browser
2. Go to: `chrome://inspect`
3. Wait for your app to appear
4. Click "inspect"
5. Debug JavaScript like a web app!

---

## 🔍 Method 1: Chrome DevTools (Best for JavaScript)

### Step-by-Step

**1. Run Your App**
```bash
npx cap run android
```

**2. Open Chrome**
- Open Google Chrome browser
- Navigate to: `chrome://inspect`

**3. Find Your App**
- You'll see "Remote Target" section
- Look for: "Diet-N-Health Tracker" or "com.dietnhealth.tracker"
- Click "inspect" button

**4. Debug!**
- **Console Tab**: See all console.log() output
- **Sources Tab**: Set breakpoints in JavaScript
- **Network Tab**: Monitor API calls
- **Elements Tab**: Inspect DOM
- **Application Tab**: Check LocalStorage

### What You Can Do
✅ Set breakpoints in JavaScript code  
✅ Step through code execution  
✅ Inspect variables  
✅ View console.log() output  
✅ Monitor network requests  
✅ Check LocalStorage data  
✅ Inspect React components  

### Example: Debug Login Issue
1. Open Chrome DevTools
2. Go to Sources tab
3. Find `Login.js` in file tree
4. Click line number to set breakpoint
5. Click "Continue Without Login" in app
6. Code pauses at breakpoint
7. Inspect variables, step through code

---

## 📊 Method 2: Android Studio Logcat

### View Logs in Android Studio

**1. Open Logcat**
- Bottom toolbar in Android Studio
- Click "Logcat" tab
- Or: View > Tool Windows > Logcat

**2. Filter Logs**
- Select your device from dropdown
- In filter box, type: `com.dietnhealth.tracker`
- Or filter by tag: `ReactNativeJS`, `Capacitor`, `Diet`

**3. Log Levels**
- **Verbose**: All logs (V)
- **Debug**: Debug messages (D)
- **Info**: Information (I)
- **Warn**: Warnings (W)
- **Error**: Errors only (E)

### Useful Filters
```
# Show only errors
*:E

# Show warnings and errors
*:W

# Show app logs only
package:com.dietnhealth.tracker

# Show specific tag
tag:ReactNativeJS

# Search for text
Diet
```

### What You'll See
```
I/Capacitor: Initializing app...
I/Diet: AuthContext: Initializing...
I/Diet: AuthContext: Setting guest user
I/Capacitor: Notifications initialized
I/Diet: App initialization complete
```

---

## 🔧 Method 3: Terminal Logcat

### Real-Time Logs in Terminal

**Basic Command**
```bash
adb logcat
```

**Filtered Commands**
```bash
# Filter by app package
adb logcat | grep "com.dietnhealth.tracker"

# Filter by keyword
adb logcat | grep "Diet"

# Show errors only
adb logcat *:E

# Show warnings and errors
adb logcat *:W

# Clear logs first
adb logcat -c && adb logcat

# Save to file
adb logcat > debug-logs.txt

# Filter by tag
adb logcat -s ReactNativeJS
adb logcat -s Capacitor
```

**Multiple Filters**
```bash
# Show multiple tags
adb logcat -s ReactNativeJS:V Capacitor:V

# Exclude noise
adb logcat | grep -v "chatty"
```

---

## 🎨 Method 4: React DevTools

### Install React DevTools

**1. Install Extension**
- Chrome: Install "React Developer Tools" extension
- Or standalone: `npm install -g react-devtools`

**2. Run Standalone (if needed)**
```bash
react-devtools
```

**3. Connect**
- Run your app
- React DevTools will auto-connect
- Inspect React component tree
- View props and state

### What You Can Do
✅ Inspect component hierarchy  
✅ View component props  
✅ View component state  
✅ Edit props/state in real-time  
✅ Profile performance  

---

## 🔍 Method 5: Network Debugging

### Monitor API Calls

**In Chrome DevTools:**
1. Open DevTools (chrome://inspect)
2. Go to "Network" tab
3. Use app (search for food, etc.)
4. See all network requests
5. Click request to see details

**What You'll See:**
- OpenFoodFacts API calls
- Supabase requests (if configured)
- Response data
- Request headers
- Timing information

### Debug API Issues
```javascript
// In your code, add:
console.log('API Request:', url);
console.log('API Response:', response);
```

---

## 🐛 Method 6: Debug Specific Issues

### Debug White Screen

**1. Check Logcat**
```bash
adb logcat | grep -E "Error|Exception"
```

**2. Check Chrome Console**
- Open chrome://inspect
- Look for JavaScript errors
- Check if app is loading

**3. Add Debug Logs**
In `src/App.js`:
```javascript
console.log('App component mounted');
console.log('App ready:', appReady);
```

### Debug Crash on Startup

**1. View Crash Logs**
```bash
adb logcat *:E
```

**2. Check for Errors**
Look for:
- `FATAL EXCEPTION`
- `AndroidRuntime`
- `java.lang.Exception`

**3. Common Issues**
- Missing permissions
- Invalid configuration
- JavaScript errors

### Debug Notifications Not Working

**1. Check Permissions**
```bash
adb shell dumpsys package com.dietnhealth.tracker | grep permission
```

**2. Test Notification**
```bash
# Send test notification via ADB
adb shell am broadcast -a android.intent.action.BOOT_COMPLETED
```

**3. Check Logs**
```bash
adb logcat | grep -i "notification"
```

### Debug Data Not Saving

**1. Check LocalStorage**
- Chrome DevTools > Application tab
- LocalStorage > file://
- See all stored data

**2. Add Debug Logs**
```javascript
console.log('Saving data:', data);
localStorage.setItem('test', 'value');
console.log('Retrieved:', localStorage.getItem('test'));
```

---

## 🎯 Method 7: Breakpoint Debugging

### Set Breakpoints in Chrome DevTools

**1. Open Sources Tab**
- Chrome DevTools > Sources
- Navigate to your file (e.g., Login.js)

**2. Set Breakpoint**
- Click line number
- Blue marker appears

**3. Trigger Code**
- Use app to trigger that code
- Execution pauses at breakpoint

**4. Debug Controls**
- **Resume** (F8): Continue execution
- **Step Over** (F10): Next line
- **Step Into** (F11): Enter function
- **Step Out** (Shift+F11): Exit function

**5. Inspect**
- Hover over variables
- Check "Scope" panel
- View call stack
- Watch expressions

### Example: Debug Login Flow
```javascript
// In Login.js, set breakpoint here:
const handleSkip = () => {
  debugger; // Or set breakpoint in DevTools
  try {
    skipLogin();
    navigate('/dashboard');
  } catch (err) {
    console.error('Skip login error:', err);
  }
};
```

---

## 📱 Method 8: Device-Specific Debugging

### Debug on Physical Device

**1. Enable Developer Options**
- Settings > About Phone
- Tap "Build Number" 7 times

**2. Enable USB Debugging**
- Settings > Developer Options
- Enable "USB Debugging"

**3. Connect & Verify**
```bash
adb devices
# Should show: XXXXXXXXXX    device
```

**4. View Device Logs**
```bash
adb logcat
```

### Debug on Emulator

**1. Start Emulator**
- Android Studio > Device Manager
- Start emulator

**2. Run App**
```bash
npx cap run android
```

**3. View Logs**
- Logcat in Android Studio
- Or: `adb logcat`

---

## 🔧 Advanced Debugging

### Enable Verbose Logging

**In capacitor.config.ts:**
```typescript
android: {
  webContentsDebuggingEnabled: true,
  loggingBehavior: 'debug'
}
```

### Add Custom Logging

**Create debug utility:**
```javascript
// src/utils/debug.js
export const debug = {
  log: (tag, message, data) => {
    console.log(`[${tag}]`, message, data);
  },
  error: (tag, message, error) => {
    console.error(`[${tag}]`, message, error);
  }
};

// Usage:
import { debug } from './utils/debug';
debug.log('Login', 'User clicked skip', { timestamp: Date.now() });
```

### Performance Profiling

**In Chrome DevTools:**
1. Performance tab
2. Click "Record"
3. Use app
4. Stop recording
5. Analyze performance

---

## 🎯 Common Debugging Scenarios

### Scenario 1: App Crashes on Startup

**Steps:**
1. Run: `adb logcat *:E`
2. Look for `FATAL EXCEPTION`
3. Check JavaScript errors in Chrome DevTools
4. Add try-catch in App.js initialization

**Debug Code:**
```javascript
try {
  await mobileNotificationService.initialize();
} catch (error) {
  console.error('Init error:', error);
  alert('Initialization failed: ' + error.message);
}
```

### Scenario 2: White Screen

**Steps:**
1. Open chrome://inspect
2. Check Console for errors
3. Check Network tab for failed requests
4. Add console.log in App.js render

**Debug Code:**
```javascript
console.log('Rendering App, ready:', appReady);
console.log('Auth loading:', loading);
console.log('User:', user);
```

### Scenario 3: Feature Not Working

**Steps:**
1. Add console.log before and after
2. Check if function is called
3. Check parameters
4. Check return value

**Debug Code:**
```javascript
const handleSave = async () => {
  console.log('handleSave called');
  console.log('Data:', data);
  
  try {
    const result = await saveData(data);
    console.log('Save result:', result);
  } catch (error) {
    console.error('Save error:', error);
  }
};
```

---

## 📊 Debugging Checklist

### Before Debugging
- [ ] App builds successfully
- [ ] Device/emulator connected
- [ ] USB debugging enabled
- [ ] `adb devices` shows device
- [ ] Chrome DevTools accessible

### During Debugging
- [ ] Check Logcat for errors
- [ ] Check Chrome Console
- [ ] Set breakpoints
- [ ] Add console.log statements
- [ ] Check Network tab
- [ ] Inspect LocalStorage

### After Finding Issue
- [ ] Document the issue
- [ ] Fix the code
- [ ] Test the fix
- [ ] Remove debug logs
- [ ] Rebuild and test

---

## 🚀 Quick Debug Commands

```bash
# View all logs
adb logcat

# View errors only
adb logcat *:E

# View app logs
adb logcat | grep "Diet"

# Clear logs
adb logcat -c

# Save logs
adb logcat > logs.txt

# Check device
adb devices

# Restart app
adb shell am force-stop com.dietnhealth.tracker
adb shell am start -n com.dietnhealth.tracker/.MainActivity

# Clear app data
adb shell pm clear com.dietnhealth.tracker

# Uninstall app
adb uninstall com.dietnhealth.tracker

# Install app
adb install app-debug.apk
```

---

## 💡 Pro Tips

### Tip 1: Use Console Strategically
```javascript
console.log('🔵 Function called:', functionName);
console.log('🟢 Success:', result);
console.log('🔴 Error:', error);
console.log('🟡 Warning:', warning);
```

### Tip 2: Debug Object
```javascript
console.log('User object:', JSON.stringify(user, null, 2));
```

### Tip 3: Conditional Logging
```javascript
const DEBUG = true;
if (DEBUG) console.log('Debug info:', data);
```

### Tip 4: Performance Timing
```javascript
console.time('API Call');
await fetchData();
console.timeEnd('API Call');
```

### Tip 5: Stack Trace
```javascript
console.trace('How did we get here?');
```

---

## 🎉 You're Ready to Debug!

### Quick Start
1. Run: `npx cap run android`
2. Open: `chrome://inspect`
3. Click: "inspect"
4. Debug in Chrome DevTools!

### Most Useful
- **Chrome DevTools**: JavaScript debugging
- **Logcat**: Native Android logs
- **Console.log**: Quick debugging

---

**Happy Debugging!** 🐛🔧
