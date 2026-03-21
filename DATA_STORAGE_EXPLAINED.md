# Data Storage with Gmail Login - Explained

## 📊 How Your Data is Stored

### Storage Locations

Your app uses a **two-tier storage system**:

1. **Local Storage (Browser)** - Primary storage, always used
2. **Supabase (Cloud)** - Optional, for cross-device sync

---

## 🔑 User Identification

### Without Gmail Login (Guest Mode):
```javascript
userId = "abc-123-device-uuid"
```
- Random UUID generated for your device
- Stored in browser localStorage
- Unique to this device only

### With Gmail Login:
```javascript
userId = "sanifyhealthc@gmail.com"
```
- Your Gmail address becomes your userId
- All data is associated with your email
- Can sync across devices

---

## 🔄 What Happens When You Login

### Step-by-Step Process:

1. **Before Login**:
   ```
   Device ID: abc-123-xyz
   Data: 
   - diet_entries: [{ userId: "abc-123-xyz", ... }]
   - health_goals: [{ userId: "abc-123-xyz", ... }]
   ```

2. **You Click "Sign in with Google"**:
   - Google authenticates you
   - Returns your email and name
   - App receives: `sanifyhealthc@gmail.com`

3. **Data Migration Happens Automatically** ✨:
   ```javascript
   // Old data with device ID
   { userId: "abc-123-xyz", foodName: "Apple", calories: 95 }
   
   // Automatically updated to
   { userId: "sanifyhealthc@gmail.com", foodName: "Apple", calories: 95 }
   ```

4. **After Login**:
   ```
   User ID: sanifyhealthc@gmail.com
   Data:
   - diet_entries: [{ userId: "sanifyhealthc@gmail.com", ... }]
   - health_goals: [{ userId: "sanifyhealthc@gmail.com", ... }]
   ```

---

## 💾 Database Schema

All tables have a `userId` column:

```sql
CREATE TABLE diet_entries (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,  -- This is your Gmail or device ID
    date DATE NOT NULL,
    foodName TEXT NOT NULL,
    nutrition JSONB NOT NULL,
    ...
);
```

### Example Records:

**Guest User:**
```json
{
  "id": "entry-1",
  "userId": "abc-123-device-uuid",
  "foodName": "Chicken Breast",
  "nutrition": { "calories": 165, "protein": 31 }
}
```

**Gmail User:**
```json
{
  "id": "entry-1",
  "userId": "sanifyhealthc@gmail.com",
  "foodName": "Chicken Breast",
  "nutrition": { "calories": 165, "protein": 31 }
}
```

---

## 🌐 Cross-Device Sync (with Supabase)

### Scenario: You have 2 devices

**Device 1 (Phone):**
```
Login: sanifyhealthc@gmail.com
Local Data: 10 diet entries
Supabase: Syncs to cloud
```

**Device 2 (Laptop):**
```
Login: sanifyhealthc@gmail.com
Local Data: Empty initially
Supabase: Downloads 10 diet entries from cloud
Result: Both devices have same data ✅
```

### How Sync Works:

1. **Save Data**:
   ```javascript
   // Saves locally first
   localStorage.setItem('diet_entries', data)
   
   // Then syncs to Supabase (if configured)
   supabase.from('diet_entries').insert({ userId: email, ...data })
   ```

2. **Load Data**:
   ```javascript
   // Loads from local storage
   const localData = localStorage.getItem('diet_entries')
   
   // Merges with Supabase data (if configured)
   const cloudData = await supabase
     .from('diet_entries')
     .select('*')
     .eq('userId', email)
   
   // Merge and keep most recent
   const mergedData = merge(localData, cloudData)
   ```

---

## 🔐 Privacy & Security

### What's Stored:

**Local Storage (Browser):**
- ✅ Your email (if logged in)
- ✅ Your name (if logged in)
- ✅ Device ID
- ✅ All your health data
- ✅ Diet entries
- ✅ Health goals
- ✅ Test reports

**Supabase (Cloud) - Optional:**
- ✅ Same data as local storage
- ✅ Associated with your email
- ✅ Encrypted in transit (HTTPS)
- ✅ Row Level Security enabled

**NOT Stored:**
- ❌ Your Google password
- ❌ Google account access
- ❌ Any other Google data

### Google OAuth:
- Only receives: email, name, profile picture URL
- No access to: Gmail, Drive, Calendar, etc.
- Token expires after use
- Can revoke access anytime at: https://myaccount.google.com/permissions

---

## 📱 Data Persistence

### Guest Mode (No Login):
```
✅ Data persists in browser
❌ Lost if you clear browser data
❌ Not accessible on other devices
❌ Not backed up to cloud
```

### Gmail Login (No Supabase):
```
✅ Data persists in browser
✅ Associated with your email
❌ Lost if you clear browser data
❌ Not accessible on other devices
❌ Not backed up to cloud
```

### Gmail Login + Supabase:
```
✅ Data persists in browser
✅ Associated with your email
✅ Backed up to cloud
✅ Accessible on other devices
✅ Survives browser data clearing
```

---

## 🔄 Data Migration Examples

### Example 1: Guest → Gmail Login

**Before:**
```javascript
// Guest user data
{
  userId: "device-abc-123",
  entries: [
    { date: "2025-03-20", calories: 2000 },
    { date: "2025-03-21", calories: 1800 }
  ]
}
```

**After Login:**
```javascript
// Automatically migrated
{
  userId: "sanifyhealthc@gmail.com",
  entries: [
    { date: "2025-03-20", calories: 2000 },
    { date: "2025-03-21", calories: 1800 }
  ]
}
```

### Example 2: Multiple Devices

**Device 1 (First Login):**
```javascript
// Creates data with email
{
  userId: "sanifyhealthc@gmail.com",
  entries: [
    { date: "2025-03-20", calories: 2000 }
  ]
}
// Syncs to Supabase ☁️
```

**Device 2 (Login with same email):**
```javascript
// Downloads from Supabase
{
  userId: "sanifyhealthc@gmail.com",
  entries: [
    { date: "2025-03-20", calories: 2000 }  // Same data!
  ]
}
```

---

## 🎯 Key Takeaways

1. **Gmail = Your User ID**: Your email becomes your unique identifier
2. **Data Migration**: Old device data automatically transfers to your Gmail account
3. **Local First**: Data always saves locally first (fast & offline-capable)
4. **Cloud Sync**: Optional Supabase sync for cross-device access
5. **Privacy**: Only email and name are stored, no Google account access
6. **Secure**: All data encrypted in transit, Row Level Security in Supabase

---

## 🔧 Technical Details

### getUserIdentifier() Function:
```javascript
export const getUserIdentifier = () => {
  const userEmail = localStorage.getItem('userEmail');
  return userEmail || getDeviceId();
  // Returns email if logged in, otherwise device ID
};
```

### Data Save Flow:
```javascript
// 1. Get user identifier
const userId = getUserIdentifier();  // "sanifyhealthc@gmail.com"

// 2. Add to data
const dataWithMeta = { 
  ...data, 
  userId,  // Your email
  timestamp: new Date().toISOString(),
  synced: false 
};

// 3. Save locally
localStorage.setItem('diet_entries', JSON.stringify(dataWithMeta));

// 4. Sync to Supabase (if configured)
await supabase.from('diet_entries').insert(dataWithMeta);
```

---

## ❓ FAQ

**Q: Can I switch between Gmail accounts?**
A: Yes, logout and login with different account. Data is separate per email.

**Q: What if I clear browser data?**
A: Without Supabase: Data is lost. With Supabase: Data is restored from cloud.

**Q: Can others see my data?**
A: No. Data is private to your email. Supabase has Row Level Security.

**Q: Do I need Supabase?**
A: No. App works perfectly with local storage only. Supabase is optional for sync.

**Q: What happens if I logout?**
A: Data stays in local storage but reverts to device ID. Login again to access.

---

## 🚀 Next Steps

1. **Login with Gmail** - Your data is now tied to your email ✅
2. **Optional: Configure Supabase** - Enable cross-device sync
3. **Use the app** - All data automatically saves with your email

Your data is now properly identified with your Gmail account! 🎉
