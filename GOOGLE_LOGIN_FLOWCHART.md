# Google Login Setup - Visual Flowchart

## 🎯 Setup Flow

```
START
  │
  ├─► Go to Google Cloud Console
  │   https://console.cloud.google.com/
  │
  ├─► Create New Project
  │   Name: "Diet-N-Health-Tracker"
  │
  ├─► Configure OAuth Consent Screen
  │   ├─► Choose "External"
  │   ├─► App name: "Diet-N-Health Tracker"
  │   ├─► Add your email
  │   ├─► Add scopes: email, profile, openid
  │   └─► Add test users (your email)
  │
  ├─► Create OAuth 2.0 Client ID
  │   ├─► Type: Web application
  │   ├─► Name: "Diet-N-Health Web Client"
  │   ├─► Authorized origins: http://localhost:3000
  │   └─► Copy Client ID
  │
  ├─► Update .env File
  │   REACT_APP_GOOGLE_CLIENT_ID=your-client-id
  │
  ├─► Restart Development Server
  │   npm start
  │
  └─► Test Login
      ├─► Open http://localhost:3000
      ├─► Click Google Sign-In button
      └─► SUCCESS! ✅
```

## 🔄 Login Flow (User Perspective)

```
User Opens App
  │
  ├─► Sees Login Screen
  │   ├─► Option 1: Google Sign-In Button
  │   └─► Option 2: Continue Without Login
  │
  ├─► Clicks Google Sign-In
  │   │
  │   ├─► Google Popup Opens
  │   │   ├─► Select Account
  │   │   ├─► Grant Permissions
  │   │   └─► Popup Closes
  │   │
  │   ├─► App Receives JWT Token
  │   │   ├─► Decodes user info (email, name)
  │   │   ├─► Saves to localStorage
  │   │   └─► Sets user state
  │   │
  │   └─► Redirects to Dashboard ✅
  │
  └─► OR Clicks Continue Without Login
      ├─► Creates guest user with device ID
      ├─► Saves to localStorage
      └─► Redirects to Dashboard ✅
```

## 🏗️ Technical Architecture

```
Frontend (React)
  │
  ├─► Login Component
  │   ├─► GoogleOAuthProvider
  │   │   └─► GoogleLogin Button
  │   │       ├─► onSuccess → handleGoogleSuccess()
  │   │       └─► onError → handleGoogleError()
  │   │
  │   └─► Skip Login Button
  │       └─► onClick → handleSkip()
  │
  ├─► AuthContext
  │   ├─► loginWithGoogle(credential)
  │   │   ├─► Decode JWT token
  │   │   ├─► Extract email & name
  │   │   ├─► Save to localStorage
  │   │   └─► Update user state
  │   │
  │   ├─► skipLogin()
  │   │   ├─► Generate device ID
  │   │   └─► Set guest user
  │   │
  │   └─► logout()
  │       ├─► Clear localStorage
  │       └─► Reset to guest user
  │
  └─► Protected Routes
      ├─► Check user state
      └─► Redirect if not authenticated
```

## 🔐 Security Flow

```
Google OAuth 2.0 Flow
  │
  ├─► User clicks Sign-In
  │
  ├─► Redirect to Google
  │   ├─► Client ID verification
  │   ├─► User authentication
  │   └─► Permission consent
  │
  ├─► Google returns JWT token
  │   ├─► Token contains:
  │   │   ├─► email
  │   │   ├─► name
  │   │   ├─► picture
  │   │   └─► sub (user ID)
  │   │
  │   └─► Token is signed by Google
  │
  ├─► App validates token
  │   ├─► Check JWT structure (3 parts)
  │   ├─► Decode payload
  │   └─► Extract user info
  │
  └─► Store user session
      ├─► localStorage (email, name)
      └─► React state (user object)
```

## 📊 Data Flow

```
User Login
  │
  ├─► Authentication
  │   ├─► Google OAuth → JWT Token
  │   └─► Local Storage → User Info
  │
  ├─► Data Storage
  │   ├─► Local Storage (Primary)
  │   │   ├─► Diet entries
  │   │   ├─► Health goals
  │   │   ├─► Test reports
  │   │   └─► Checklists
  │   │
  │   └─► Supabase (Optional Sync)
  │       ├─► Cloud backup
  │       └─► Cross-device sync
  │
  └─► User Experience
      ├─► Dashboard
      ├─► Diet Tracker
      ├─► Health Monitor
      └─► Reports
```

## 🚨 Error Handling Flow

```
Login Attempt
  │
  ├─► Success Path
  │   └─► Redirect to Dashboard ✅
  │
  └─► Error Paths
      │
      ├─► Invalid Credential
      │   ├─► Show error message
      │   └─► Suggest "Continue Without Login"
      │
      ├─► Network Error
      │   ├─► Show error message
      │   └─► Retry or skip login
      │
      ├─► Popup Blocked
      │   ├─► Show error message
      │   └─► Instructions to allow popups
      │
      └─► Configuration Error
          ├─► Show "Google login not configured"
          └─► Show "Continue Without Login" option
```

## 🎨 UI States

```
Login Screen States
  │
  ├─► Initial State
  │   ├─► Show Google Sign-In button
  │   └─► Show Continue Without Login button
  │
  ├─► Loading State
  │   ├─► Show spinner
  │   └─► Disable buttons
  │
  ├─► Error State
  │   ├─► Show error message
  │   └─► Enable retry
  │
  └─► Success State
      └─► Redirect to Dashboard
```

## 🔧 Configuration States

```
App Configuration
  │
  ├─► Google Login Configured
  │   ├─► .env has valid Client ID
  │   ├─► Show Google Sign-In button
  │   └─► Enable OAuth flow
  │
  └─► Google Login Not Configured
      ├─► .env has placeholder or missing
      ├─► Show "Not configured" message
      └─► Only show "Continue Without Login"
```

---

## 📝 Quick Reference

### Required Environment Variable
```env
REACT_APP_GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
```

### Required Google Cloud Settings
- **Project**: Created
- **OAuth Consent Screen**: Configured
- **OAuth Client ID**: Created (Web application)
- **Authorized Origins**: `http://localhost:3000`
- **Test Users**: Added

### Verification Command
```bash
node scripts/check-google-auth.js
```

---

**Need help?** See GOOGLE_LOGIN_SETUP.md for detailed instructions!
