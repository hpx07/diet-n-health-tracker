# Quick Start Guide

Get up and running in 5 minutes!

## Option 1: Guest Mode (Fastest - 2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start the app
npm start
```

That's it! The app will open at `http://localhost:3000`

- Click "Continue Without Login"
- Complete your profile
- Start tracking your health!

**Note**: Guest mode stores data locally on your device only.

---

## Option 2: With Google Login (5 minutes)

### Prerequisites
- Google account
- Google Cloud Console access

### Steps

1. **Get Google Client ID**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create project → Enable Google+ API
   - Create OAuth credentials
   - Add `http://localhost:3000` to authorized origins
   - Copy Client ID

2. **Configure Environment**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env and add:
   REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here
   ```

3. **Run the App**
   ```bash
   npm install
   npm start
   ```

4. **Login**
   - Click "Sign in with Google"
   - Select your account
   - Start tracking!

---

## Option 3: Full Setup with Online Sync (15 minutes)

Follow the complete [SETUP_GUIDE.md](./SETUP_GUIDE.md) for:
- Supabase configuration
- Google OAuth setup
- Online data sync
- Production deployment

---

## First Steps After Setup

### 1. Complete Your Profile
- Go to "Profile" tab
- Fill in your details:
  - Name, age, gender
  - Height and weight
  - Activity level
  - Weight goal
- Click "Save Profile"
- View your personalized diet plan!

### 2. Add Your First Meal
- Go to "Diet Tracker" tab
- Search for a food (e.g., "banana")
- Click on a result
- Select meal type and quantity
- Click "Add to Diary"
- Watch your progress bars update!

### 3. Record a Test Result
- Go to "Test Reports" tab
- Search for a test (e.g., "blood sugar")
- Select the test
- Enter your value and date
- Click "Save Test Result"
- See automatic analysis!

### 4. Set a Health Goal
- Go to "Health Goals" tab
- Click "+ Add Goal"
- Fill in goal details
- Click "Create Goal"
- Update progress anytime!

### 5. Create Daily Checklist
- Go to "Daily Checklist" tab
- Click "Create Checklist"
- Click "+ Add Item"
- Type your task and press Enter
- Check off items as you complete them!

### 6. View Your Reports
- Go to "Reports" tab
- Select report type
- Choose date range
- View beautiful charts!
- Download comprehensive report

---

## Common Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Install new dependency
npm install package-name
```

---

## Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### App not loading
- Check console for errors
- Verify Node.js version (14+)
- Clear browser cache
- Try incognito mode

---

## What's Next?

- ✅ Track your meals daily
- ✅ Record test results regularly
- ✅ Set and achieve health goals
- ✅ Complete daily checklists
- ✅ Review weekly reports
- ✅ Adjust your diet plan as needed

---

## Need Help?

- 📖 Read [README.md](./README.md) for full documentation
- 🔧 Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
- 🎯 See [FEATURES.md](./FEATURES.md) for complete feature list
- 🐛 Open an issue on GitHub

---

## Tips for Success

1. **Be Consistent**: Log meals daily for best results
2. **Set Realistic Goals**: Start small and build up
3. **Review Weekly**: Check reports every week
4. **Stay Hydrated**: Use water reminders
5. **Track Tests**: Record all health tests
6. **Update Profile**: Keep weight updated
7. **Use Checklists**: Build healthy habits

---

Happy tracking! 🎉
