# 🚀 Remote Content Management Setup

## Overview
Your app now supports remote content management via Firebase Firestore! Your copywriter can update challenges, change button text, and modify content without app updates.

## What's New

### ✅ Implemented Features
1. **Firebase Firestore Integration** - Real-time content updates
2. **Configurable Button Text** - Change "Start Challenge" to "Let's Do This" or anything else
3. **Offline Support** - Content cached locally with AsyncStorage
4. **Real-time Updates** - Changes appear instantly without app restart
5. **Admin Panel** - Simple HTML interface for content editing

### 📁 New Files Created
- `src/types/content.types.ts` - TypeScript types for content
- `src/services/contentService.ts` - Firebase service layer
- `src/hooks/useRemoteContent.ts` - React hook for content
- `scripts/migrateContentToFirestore.js` - Initial data migration
- `scripts/admin-panel.html` - Simple content editor

## Setup Instructions

### 1. Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (unboundapp)
3. Navigate to **Firestore Database**
4. Click **Create Database** (if not already created)
5. Choose **Start in production mode**
6. Select your region

### 2. Create Collections
In Firestore, create two collections:

#### Collection: `challenges`
Document ID format: `day1`, `day2`, `day3`, etc.

Example document structure:
```json
{
  "day": 1,
  "title": "Labeling the phone as object",
  "description": "Today, you'll learn to see your phone...",
  "enabled": true,
  "order": 1,
  "finalButtonText": "Start Challenge",  // ← Customizable!
  "cards": [
    {
      "id": 1,
      "type": "intro",
      "title": "Labeling the phone as object",
      "content": "Today, you'll learn...",
      "imageUrl": "https://your-cdn.com/image.png"  // Optional
    },
    // ... more cards
  ]
}
```

#### Collection: `courseContent`
Document ID format: `day1`, `day2`, `day3`, etc.

Example document structure:
```json
{
  "day": 1,
  "title": "Labeling the phone as object",
  "description": "Reframe how you see the phone...",
  "enabled": true,
  "order": 1
}
```

### 3. Run Migration Script

#### Option A: Using Node.js
1. Download service account key:
   - Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `service-account-key.json` in `scripts/`

2. Install Firebase Admin:
```bash
cd scripts
npm init -y
npm install firebase-admin
```

3. Update the script path:
```javascript
// In migrateContentToFirestore.js, update this line:
const serviceAccount = require('./service-account-key.json');
```

4. Run migration:
```bash
node migrateContentToFirestore.js
```

#### Option B: Manual Entry in Firebase Console
1. Go to Firestore in Firebase Console
2. Create `challenges` collection
3. Add documents manually with the structure above

### 4. Enable Authentication (for Admin Panel)
1. In Firebase Console → Authentication
2. Click "Get started"
3. Enable **Email/Password** provider
4. Add user: Click "Add user" and create admin credentials

## Using the Admin Panel

### Option 1: Web-based Admin Panel
1. Open `scripts/admin-panel.html` in a browser
2. Enter your Firebase config:
   - Find config in Firebase Console → Project Settings → General
   - Look for "Your apps" → Web app configuration
3. Enter admin email/password
4. Edit content directly in the interface

### Option 2: Firebase Console
1. Navigate to Firestore Database
2. Click on any document to edit
3. Modify fields directly
4. Changes appear in real-time in the app

### Option 3: Your Website Integration
Since you mentioned having a website, you can:
1. Create an admin section on your site
2. Use Firebase Admin SDK on your backend
3. Build a custom CMS interface
4. Your copywriter updates through your website

## Customizable Features

### 🎯 Button Text
Change the final button text for each challenge:
```json
"finalButtonText": "Let's Do This"  // Default: "Start Challenge"
```

Examples:
- Day 1: "Start Challenge"
- Day 2: "Let's Do This"
- Day 3: "Begin Practice"
- Day 4: "I'm Ready"

### 🖼️ Images
Host images on a CDN and add URLs:
```json
"imageUrl": "https://your-cdn.com/day1-image.png"
```

### 📝 Content Updates
All text is editable:
- Challenge titles
- Descriptions
- Card content
- Button labels
- Instruction text

### 🔄 Enable/Disable Challenges
Set `enabled: false` to hide a challenge temporarily

### 📊 Reorder Content
Change the `order` field to rearrange challenges

## Testing Changes

1. **iOS**: Run the app
```bash
npx react-native run-ios
```

2. **Android**: Run the app
```bash
npx react-native run-android
```

3. Make changes in Firebase Console or Admin Panel
4. Changes appear instantly in the app!

## Website Integration Ideas

Since you have a website where you're putting challenges:

### Option 1: Shared Firebase
- Website and app use same Firebase project
- Updates on website reflect in app instantly

### Option 2: Website API → Firebase
- Your website has an API endpoint
- Set up Cloud Function to sync data
- Webhook triggers Firebase update

### Option 3: Google Sheets Integration
- Copywriter updates Google Sheet
- Zapier/Make.com syncs to Firebase
- Non-technical friendly

### Option 4: Custom Admin on Your Site
```javascript
// On your website backend
const admin = require('firebase-admin');

app.post('/api/challenges/:day', async (req, res) => {
  const { title, description, cards, finalButtonText } = req.body;

  await admin.firestore()
    .collection('challenges')
    .doc(`day${req.params.day}`)
    .set({
      day: parseInt(req.params.day),
      title,
      description,
      cards,
      finalButtonText,
      enabled: true,
      order: parseInt(req.params.day)
    });

  res.json({ success: true });
});
```

## Troubleshooting

### Changes not appearing?
1. Check Firestore rules allow read access
2. Verify `enabled: true` on documents
3. Check network connection
4. Look for errors in Metro bundler console

### App crashes on launch?
1. Ensure Firestore is initialized in Firebase Console
2. Check collection names match exactly
3. Verify document structure matches types

### Offline not working?
1. AsyncStorage must be installed
2. Content loads once online first
3. Cache expires after 1 hour (configurable)

## Next Steps

1. **Set up Firestore** with initial content
2. **Test editing** via Firebase Console
3. **Share admin access** with your copywriter
4. **Consider website integration** for seamless updates

## Support

The app will always fall back to default content if:
- No internet connection on first launch
- Firestore is unavailable
- Documents are missing

This ensures the app never breaks, even if remote content fails.

---

Your copywriter can now update content remotely! 🎉