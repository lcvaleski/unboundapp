# MVP Fresh - React Native Authentication Starter

A production-ready React Native (0.81.4) starter template with Firebase authentication, including Email/Password, Google Sign-In, and Apple Sign-In.

## 🚀 Features

- ✅ React Native 0.81.4 with New Architecture/Fabric enabled
- ✅ Firebase Authentication (Email/Password)
- ✅ Google Sign-In
- ✅ Apple Sign-In (iOS)
- ✅ Firebase Analytics & Crashlytics
- ✅ React Navigation
- ✅ TypeScript
- ✅ Clean authentication UI with gradients
- ✅ Proper error handling
- ✅ Platform-specific configurations

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Ruby 2.6.10+ (for iOS)
- Xcode 15+ (for iOS development)
- Android Studio (for Android development)
- CocoaPods (`sudo gem install cocoapods`)
- Firebase account
- Apple Developer account (for Apple Sign-In)

## 🔧 Initial Setup

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/mvp_fresh.git
cd mvp_fresh
```

### 2. Install Dependencies

```bash
# Install Node modules
npm install
# or
yarn install

# iOS only: Install pods
cd ios && pod install && cd ..
```

## 🔥 Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Authentication in the Firebase Console:
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google Sign-In
   - Enable Apple Sign-In (if using)

### Step 2: iOS Configuration

1. **Add iOS App in Firebase:**
   - Click "Add app" → iOS
   - Bundle ID: `org.reactjs.native.example.mvp-fresh` (or your custom bundle ID)
   - Register the app

2. **Download Configuration:**
   - Download `GoogleService-Info.plist`
   - Place it in `ios/mvp_fresh/` directory

3. **Update Bundle Identifier (if using custom):**
   ```bash
   # In Xcode:
   1. Open ios/mvp_fresh.xcworkspace
   2. Select the project in navigator
   3. Update Bundle Identifier in General tab
   4. Ensure it matches your Firebase configuration
   ```

4. **Add URL Schemes:**
   - Already configured in Info.plist, but if using custom:
   - Open `ios/mvp_fresh/Info.plist`
   - Update the REVERSED_CLIENT_ID in CFBundleURLSchemes
   - Get this value from your GoogleService-Info.plist

### Step 3: Android Configuration

1. **Add Android App in Firebase:**
   - Click "Add app" → Android
   - Package name: `com.mvpfresh`
   - SHA-1 certificate fingerprint (see below)
   - Register the app

2. **Generate SHA-1 Fingerprint:**
   ```bash
   # For debug builds
   keytool -list -v -keystore ~/.android/debug.keystore -storepass android -keypass android

   # Copy the SHA1 fingerprint and add it to Firebase Console
   ```

3. **Download Configuration:**
   - Download `google-services.json`
   - Place it in `android/app/` directory

4. **Verify Package Name:**
   - Check `android/app/build.gradle`
   - Ensure `applicationId` matches Firebase: `com.mvpfresh`

## 🔑 Google Sign-In Setup

### iOS

1. **Get OAuth Client ID:**
   - In Firebase Console → Project Settings → General
   - Under "Your apps" → iOS app
   - Copy the "Client ID" (starts with numbers.apps.googleusercontent.com)

2. **Configure in Code:**
   - Already configured in `src/contexts/AuthContext.tsx`
   - Update if using different client ID

### Android

1. **Web Client ID Required:**
   - Firebase automatically creates a Web OAuth client
   - Find it in: Firebase Console → Authentication → Sign-in method → Google → Web SDK configuration
   - Or check `android/app/google-services.json` for the web client ID

2. **Update AuthContext:**
   ```typescript
   GoogleSignin.configure({
     webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
     offlineAccess: true,
   });
   ```

## 🍎 Apple Sign-In Setup (iOS Only)

### Configure in Apple Developer Console

1. **Enable Sign in with Apple:**
   - Go to [Apple Developer](https://developer.apple.com/)
   - Certificates, Identifiers & Profiles → Identifiers
   - Select your app identifier
   - Enable "Sign in with Apple" capability

2. **Create Service ID (for Android/Web):**
   - Create new Service ID
   - Enable "Sign in with Apple"
   - Add Firebase callback URL: `https://YOUR-PROJECT.firebaseapp.com/__/auth/handler`

### Configure in Xcode

1. Open `ios/mvp_fresh.xcworkspace`
2. Select project → Signing & Capabilities
3. Add capability: "Sign in with Apple"
4. Ensure automatic signing is enabled

## 🏗️ Build & Run

### iOS

```bash
# Clean build (if needed)
./clean-ios-quick.sh

# Run on simulator
npx react-native run-ios

# Run on specific device
npx react-native run-ios --device "iPhone 15"
```

### Android

```bash
# Clean build (if needed)
./clean-android-quick.sh

# Run on emulator/device
npx react-native run-android
```

### Metro Bundler

```bash
# Start Metro with cache reset
npx react-native start --reset-cache
```

## 🛠️ Utility Scripts

The project includes helpful cleaning scripts:

```bash
# Quick clean (build artifacts only)
./clean-ios-quick.sh      # iOS only
./clean-android-quick.sh  # Android only
./clean-both-quick.sh     # Both platforms

# Deep clean (includes dependencies)
./clean-ios.sh           # iOS deep clean
./clean-android.sh       # Android deep clean
```

## 📱 Customization

### Change App Name

1. **iOS:**
   - Open `ios/mvp_fresh/Info.plist`
   - Update `CFBundleDisplayName`

2. **Android:**
   - Open `android/app/src/main/res/values/strings.xml`
   - Update `app_name`

### Change Bundle/Package ID

1. **iOS:**
   - Update in Xcode project settings
   - Update in `GoogleService-Info.plist`
   - Update Firebase iOS app configuration

2. **Android:**
   - Update `applicationId` in `android/app/build.gradle`
   - Update package name in Java/Kotlin files
   - Update in `google-services.json`
   - Update Firebase Android app configuration

### Update Authentication Providers

Edit `src/contexts/AuthContext.tsx` to:
- Add/remove authentication methods
- Customize error handling
- Add user profile management

## 🐛 Troubleshooting

### iOS Build Issues

1. **"No Firebase App has been created"**
   - Ensure `GoogleService-Info.plist` is in `ios/mvp_fresh/`
   - Check that it's added to Xcode project (should appear in file navigator)
   - Verify bundle ID matches

2. **"Missing URL scheme"**
   - Check `ios/mvp_fresh/Info.plist` has CFBundleURLSchemes
   - Verify REVERSED_CLIENT_ID matches GoogleService-Info.plist

3. **Build fails without clear error**
   ```bash
   # Clean everything
   cd ios
   rm -rf Pods build ~/Library/Developer/Xcode/DerivedData/*
   pod cache clean --all
   pod install
   ```

### Android Build Issues

1. **"Default FirebaseApp is not initialized"**
   - Ensure `google-services.json` is in `android/app/`
   - Check package name matches in all locations
   - Verify SHA-1 fingerprint is added to Firebase

2. **Google Sign-In not working**
   - Ensure Web OAuth client ID is used (not Android client)
   - Check SHA-1 fingerprint is correct
   - Rebuild after adding configuration files

### General Issues

1. **Blank white screen on launch**
   ```bash
   # Reset Metro cache
   npx react-native start --reset-cache
   ```

2. **Module not found errors**
   ```bash
   # Clear all caches
   watchman watch-del-all
   rm -rf node_modules
   npm install
   cd ios && pod install
   ```

## 📂 Project Structure

```
mvp_fresh/
├── ios/                    # iOS native code
│   ├── mvp_fresh/
│   │   ├── AppDelegate.swift
│   │   ├── Info.plist
│   │   └── GoogleService-Info.plist
│   └── Podfile
├── android/                # Android native code
│   ├── app/
│   │   ├── build.gradle
│   │   ├── google-services.json
│   │   └── src/main/java/com/mvpfresh/
│   └── build.gradle
├── src/                    # React Native source
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication logic
│   ├── screens/
│   │   ├── auth/           # Login, Signup, etc.
│   │   └── main/           # Authenticated screens
│   └── navigation/         # Navigation setup
├── package.json
├── app.json
└── README.md
```

## 🚢 Production Deployment

### iOS

1. **Configure signing:**
   - Set up provisioning profiles
   - Configure push notification certificates (if using)

2. **Update version:**
   - Increment version in Xcode
   - Archive and upload to App Store Connect

### Android

1. **Generate signed APK/AAB:**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. **Configure ProGuard:**
   - Update `android/app/proguard-rules.pro` if needed

## 🔒 Security Notes

- Never commit `GoogleService-Info.plist` or `google-services.json` to public repos
- Use environment variables for sensitive data
- Enable Firebase App Check for production
- Implement rate limiting on authentication endpoints
- Use Firebase Security Rules for Firestore/Storage

## 📚 Additional Resources

- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com/)
- [Apple Developer Portal](https://developer.apple.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

## 🤝 Contributing

Feel free to submit issues and pull requests.

## 📄 License

MIT License - feel free to use this template for your projects.

---

Built with ❤️ using React Native and Firebase