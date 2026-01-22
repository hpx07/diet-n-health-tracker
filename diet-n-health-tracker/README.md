# Diet-N-Health Tracker

A comprehensive, production-ready health and diet tracking application built with React. Track your daily diet, monitor health test results, set goals, and get personalized nutrition recommendations.

## Features

### 🍽️ Diet Tracking
- Search and log food items using OpenFoodFacts API
- Track calories, protein, carbs, and fat
- Meal categorization (breakfast, lunch, dinner, snacks)
- Daily nutrition progress tracking
- Visual progress bars for macro targets

### 🩺 Health Test Reports
- Search from 24+ common health tests
- Record test results with dates
- Automatic analysis against normal ranges
- Status indicators (normal, low, high)
- Test history tracking
- Categories: Blood, Diabetes, Lipid Profile, Thyroid, Kidney, Liver, Vitamins, Minerals, Vital Signs

### 🎯 Health Goals
- Set custom health goals (weight, fitness, nutrition, health, habits)
- Track progress with visual indicators
- Update progress values
- Target dates and completion tracking
- Multiple goal categories

### ✅ Daily Checklist
- Create daily task lists
- Track completion rates
- Generate daily reports
- Download reports as text files
- Visual progress tracking

### 📊 Reports & Analytics
- Nutrition trend charts
- Macro distribution pie charts
- Test result trends over time
- Goals progress visualization
- Customizable date ranges (7, 14, 30, 90 days)
- Downloadable comprehensive reports

### 👤 User Profile
- Personal information management
- BMI calculation
- BMR (Basal Metabolic Rate) calculation
- TDEE (Total Daily Energy Expenditure) calculation
- Personalized macro targets
- Activity level customization
- Goal-based recommendations

### 🔐 Authentication
- Google OAuth login
- Guest mode (device-based storage)
- Optional login for flexibility

### 💾 Smart Storage
- **Dual Storage System**: Online (Supabase) + Offline (LocalStorage)
- Automatic sync when online
- Offline-first architecture
- Background sync every 5 minutes
- Sync queue for offline changes
- No interruption during offline mode
- Unique storage per user (Gmail or Device ID)

### 🔔 Notifications
- Goal achievement notifications
- Calorie intake reminders
- Water intake reminders
- Meal time reminders
- Test result alerts

## Technology Stack

- **Frontend**: React 18
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Authentication**: Google OAuth
- **Online Storage**: Supabase (SQLite/PostgreSQL)
- **Offline Storage**: LocalStorage
- **APIs**: 
  - OpenFoodFacts API (nutrition data)
  - Built-in health tests database
- **Date Handling**: date-fns
- **Styling**: Custom CSS

## Installation

### Prerequisites
- Node.js 14+ and npm
- Supabase account (optional, for online sync)
- Google Cloud Console project (optional, for Google login)

### Setup Steps

1. **Clone and Install**
```bash
cd diet-n-health-tracker
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

3. **Database Setup (Optional - for online sync)**

For Supabase:
- Create a new Supabase project
- Run the SQL from `database/supabase-schema.sql` in the SQL editor
- Copy your project URL and anon key to `.env`

For MySQL:
```bash
mysql -u username -p < database/mysql-schema.sql
```

4. **Start Development Server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## Usage

### First Time Setup

1. **Login or Skip**: Choose to login with Google or continue as guest
2. **Complete Profile**: Fill in your personal information (age, height, weight, activity level, goal)
3. **Get Recommendations**: Receive personalized diet plan with macro targets

### Daily Workflow

1. **Track Meals**: Search and log your food intake throughout the day
2. **Monitor Progress**: Check your daily nutrition progress
3. **Complete Checklist**: Mark off daily health tasks
4. **Review Goals**: Update progress on your health goals

### Adding Test Results

1. Go to "Test Reports" tab
2. Search for the test name (e.g., "Hemoglobin", "Blood Sugar")
3. Select the test from results
4. Enter your test value and date
5. View automatic analysis against normal ranges

### Viewing Reports

1. Go to "Reports" tab
2. Select report type (Nutrition, Tests, Goals)
3. Choose date range
4. View interactive charts
5. Download comprehensive report

## Storage Architecture

### Offline-First Design
- All data is saved to LocalStorage immediately
- Online sync happens in the background
- App works fully offline
- Automatic sync when connection is restored

### Sync Process
1. User makes changes → Saved to LocalStorage
2. If online → Attempt to sync to Supabase
3. If offline → Add to sync queue
4. When online → Process sync queue
5. Merge online and offline data intelligently

### Data Uniqueness
- **With Google Login**: Data stored by email address
- **Guest Mode**: Data stored by unique device ID
- Both identifiers saved for data recovery

## Database Migration

The app supports easy migration from SQLite to MySQL/PostgreSQL:

1. Export data from Supabase
2. Transform data format (see `database/migration-guide.md`)
3. Import to MySQL using provided schema
4. Update connection settings

Detailed migration guide: `database/migration-guide.md`

## Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Set these in your hosting platform:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_GOOGLE_CLIENT_ID`

### Hosting Options
- **Vercel**: Connect GitHub repo, auto-deploy
- **Netlify**: Drag & drop build folder
- **AWS S3 + CloudFront**: Static hosting
- **Firebase Hosting**: `firebase deploy`

### Security Considerations
- Never commit `.env` file
- Use environment variables for secrets
- Enable Row Level Security in Supabase
- Implement rate limiting for API calls
- Validate all user inputs

## API Integration

### OpenFoodFacts API
- No API key required
- Rate limit: Reasonable use
- Endpoint: `https://world.openfoodfacts.org/api/v2`

### Health Tests Database
- Built-in database with 24+ tests
- No external API required
- Includes normal ranges by gender
- Automatic result analysis

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Features Roadmap

- [ ] Barcode scanner for food items
- [ ] Meal planning and recipes
- [ ] Exercise tracking
- [ ] Water intake tracker
- [ ] Sleep tracking
- [ ] Integration with fitness devices
- [ ] Social features (share progress)
- [ ] AI-powered meal suggestions
- [ ] Export data to PDF
- [ ] Multi-language support

## Troubleshooting

### App not syncing online
- Check internet connection
- Verify Supabase credentials in `.env`
- Check browser console for errors
- Clear browser cache and reload

### Food search not working
- Check internet connection (OpenFoodFacts API requires online access)
- Try different search terms
- Check browser console for API errors

### Notifications not showing
- Grant notification permissions in browser
- Check browser notification settings
- Ensure HTTPS (required for notifications)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

## Acknowledgments

- OpenFoodFacts for nutrition data
- Recharts for beautiful charts
- Supabase for backend infrastructure
- React community for excellent tools

---

Built with ❤️ for health-conscious individuals
