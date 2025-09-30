# MVP Fresh - AI Assistant Context

## 🚀 Project Overview

**Project**: MVP Fresh - React Native Mobile App
**Type**: Cross-platform (iOS & Android)
**Status**: Active Development - Working State
**Architecture**: React Native New Architecture (Fabric/TurboModules enabled)
**Last Updated**: September 30, 2024

### Tech Stack
- **React Native**: 0.81.4 (Latest stable)
- **React**: 19.1.0
- **TypeScript**: 5.8.3
- **Firebase**: v23.4.0 (Auth, Analytics, Crashlytics)
- **Navigation**: React Navigation 6.x
- **State Management**: React Context API
- **Package Manager**: npm

### Important Architecture Decisions
- **UI Components**: Using native TextInput directly (no custom wrappers)
- **Styling**: Simple, flat design with white backgrounds
- **Forms**: No KeyboardAvoidingView or ScrollView on auth screens (causes focus issues)
- **Colors**: Primary white/black theme, no gradients or complex colors

## 📱 Features

### Current Implementation
- ✅ Firebase Authentication (Email/Password, Google, Apple)
- ✅ Navigation structure with auth flow
- ✅ Splash screen (simplified - no logo/branding)
- ✅ User authentication context
- ✅ Firebase Analytics integration
- ✅ Crashlytics for error reporting
- ✅ Login/Signup screens with working text inputs
- ✅ Home screen with sign out
- ✅ Profile screen placeholder

### Planned Features
- [ ] User profile management
- [ ] Push notifications
- [ ] Data persistence with MMKV
- [ ] Offline support
- [ ] Social features

## 🏗️ Project Structure

```
mvp_fresh/
├── src/
│   ├── screens/           # Screen components
│   │   ├── auth/          # Authentication screens
│   │   ├── onboarding/    # Onboarding flow
│   │   └── main/          # Main app screens
│   ├── navigation/        # Navigation setup
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript types
├── ios/                  # iOS native code
│   ├── Podfile          # CocoaPods dependencies
│   ├── mvp_fresh.xcworkspace
│   └── mvp_fresh/
│       ├── AppDelegate.swift
│       ├── Info.plist
│       └── GoogleService-Info.plist
├── android/              # Android native code
│   ├── app/
│   │   ├── build.gradle
│   │   ├── google-services.json
│   │   └── src/main/
│   └── build.gradle
├── package.json          # Node dependencies
├── tsconfig.json         # TypeScript config
├── .eslintrc.js         # ESLint config
└── CLAUDE.md            # This file
```

## 🔥 Firebase Configuration

### Setup Status
- ✅ Firebase SDK v23.4.0 (Latest)
- ✅ iOS: GoogleService-Info.plist configured
- ✅ Android: google-services.json configured
- ✅ Native initialization configured

### iOS Firebase Setup
- **Location**: `/ios/mvp_fresh/AppDelegate.swift`
- **Method**: Manual initialization with `Firebase.configure()`
- **SDK Version**: Firebase iOS SDK 12.3.0

### Android Firebase Setup
- **Location**: `/android/app/build.gradle`
- **Method**: Auto-initialization via Google Services plugin
- **Plugin**: `com.google.gms.google-services`

### Firebase Services
```typescript
// Available Firebase services
import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
```

## 🛠️ Development Commands

### Installation & Setup
```bash
# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Clean install (when dependencies change)
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

### Running the App
```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios
# Or specific simulator
npx react-native run-ios --simulator="iPhone 17 Pro"

# Run on Android
npm run android
# Or specific device
npx react-native run-android --deviceId="emulator-5554"
```

### Cleaning & Troubleshooting
```bash
# Clean iOS build
cd ios && rm -rf build ~/Library/Developer/Xcode/DerivedData/* && cd ..

# Clean Android build
cd android && ./gradlew clean && cd ..

# Reset Metro cache
npx react-native start --reset-cache

# Clear all caches (nuclear option)
watchman watch-del-all
rm -rf node_modules
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
npm install
cd ios && pod install && cd ..
```

### Build Commands
```bash
# iOS Debug build
cd ios && xcodebuild -workspace mvp_fresh.xcworkspace -scheme mvp_fresh -configuration Debug -sdk iphonesimulator

# iOS Release build
cd ios && xcodebuild -workspace mvp_fresh.xcworkspace -scheme mvp_fresh -configuration Release -sdk iphoneos

# Android Debug build
cd android && ./gradlew assembleDebug

# Android Release build
cd android && ./gradlew assembleRelease
```

## 🐛 Known Issues & Solutions

### Text Input Focus Issues (RESOLVED)
**Problem**: TextInput components were losing focus or jumping between fields
**Solution**:
- Removed KeyboardAvoidingView and ScrollView from auth screens
- Use native TextInput directly without custom wrappers
- Removed animated labels and complex focus management
- Added `react-native-gesture-handler` import to index.js

### iOS Build Issues
1. **Pod Installation Failures**
   ```bash
   cd ios && pod cache clean --all && pod deintegrate && pod install
   ```

2. **Xcode Build Failures**
   - Check Report Navigator for detailed errors
   - Ensure minimum iOS deployment target: 15.1
   - Verify Firebase configuration files are added to Xcode project

3. **Ruby Version Warning**
   - Ignore "Unknown ruby interpreter version" - it's harmless
   - System ruby works fine for CocoaPods

4. **Simulator Warnings**
   - Haptic feedback errors are normal in simulator
   - RTIInputSystemClient warnings can be ignored
   - Network sleep warnings are simulator-specific

### Android Build Issues
1. **Gradle Build Failures**
   ```bash
   cd android && ./gradlew clean && ./gradlew --stop
   ```

2. **JDK Version Issues**
   - Ensure JDK 17+ is installed
   - Set JAVA_HOME environment variable

### React Native Issues
1. **Metro Bundler Issues**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Module Resolution Issues**
   ```bash
   rm -rf node_modules && npm install
   ```

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "19.1.0",
  "react-native": "0.81.4",
  "@react-native-firebase/app": "^23.4.0",
  "@react-native-firebase/auth": "^23.4.0",
  "@react-native-firebase/analytics": "^23.4.0",
  "@react-native-firebase/crashlytics": "^23.4.0"
}
```

### Navigation & UI
```json
{
  "@react-navigation/native": "6.1.9",
  "@react-navigation/stack": "6.3.20",
  "react-native-screens": "^4.16.0",
  "react-native-safe-area-context": "^5.6.1",
  "react-native-gesture-handler": "^2.28.0"
}
```

### Authentication
```json
{
  "@react-native-google-signin/google-signin": "^11.0.0",
  "@invertase/react-native-apple-authentication": "^2.4.1"
}
```

## 🎯 Development Guidelines

### Code Style
- TypeScript for all new files
- Functional components with hooks
- Async/await for asynchronous operations
- Proper error handling with try-catch

### File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types: PascalCase with `.types.ts` extension
- Hooks: camelCase starting with 'use' (e.g., `useAuth.ts`)

### Git Workflow
- Feature branches from `main`
- Descriptive commit messages
- PR reviews before merging
- Keep `CLAUDE.md` updated with major changes

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- UserProfile.test.tsx
```

## 🔄 Version Compatibility

### React Native Firebase Compatibility
| RN Firebase | React Native | Firebase iOS SDK | Firebase Android SDK |
|-------------|--------------|------------------|---------------------|
| 23.4.0      | 0.73.0+      | 12.3.0          | 33.5.1             |
| 18.x        | 0.69.0+      | 10.x            | 32.x               |

### iOS Requirements
- Xcode: 16.2+
- iOS Deployment Target: 15.1+
- CocoaPods: 1.12+
- macOS: 14.5+ (Sequoia)

### Android Requirements
- Android SDK: 23+ (minSdkVersion)
- Gradle: 8.10.2
- Kotlin: 1.9.24
- JDK: 17+

## 📝 Quick Reference

### Common Tasks
- **Add new screen**: Create in `src/screens/`, add to navigation
- **Add Firebase service**: Install package, update native configs
- **Update dependencies**: `npm update`, then `cd ios && pod update`
- **Debug network**: Use Flipper or React Native Debugger
- **Profile performance**: Use React DevTools Profiler

### Environment Variables
```bash
# .env file (create if needed)
API_BASE_URL=https://api.example.com
ENVIRONMENT=development
```

### Useful Links
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Native Firebase](https://rnfirebase.io/)
- [React Navigation](https://reactnavigation.org/)
- [Firebase Console](https://console.firebase.google.com/)

## 🚨 Important Notes

1. **Firebase Config Files**: The `GoogleService-Info.plist` and `google-services.json` files are safe to commit to git as they only contain public identifiers
2. **iOS Build**: Always use `.xcworkspace` file, not `.xcodeproj`
3. **Pods**: Run `pod install` after any native dependency changes
4. **Metro**: Keep Metro bundler terminal open while developing
5. **Type Safety**: Leverage TypeScript for all new code
6. **Text Inputs**: Use native TextInput directly - avoid complex wrappers or animated labels
7. **Auth Screens**: Don't use KeyboardAvoidingView or ScrollView - they cause focus issues
8. **Gesture Handler**: Must import 'react-native-gesture-handler' at top of index.js
9. **Design System**: Keep it simple - white backgrounds, black text, minimal styling

## 🔮 Future Improvements

- [ ] Implement CI/CD pipeline
- [ ] Add comprehensive testing suite
- [ ] Set up code coverage requirements
- [ ] Implement error boundaries
- [ ] Add performance monitoring
- [ ] Configure deep linking
- [ ] Add localization support
- [ ] Implement app versioning strategy

---

*Last Updated: September 30, 2024 - Working State Achieved*
*Maintained for AI assistants to provide optimal development support*

## 🚀 FORKING GUIDE - Creating a New App from This Template

### Prerequisites
1. Firebase account (https://console.firebase.google.com)
2. Apple Developer account (for iOS)
3. Google Play Console account (for Android production)
4. Xcode 16.2+ installed
5. Android Studio installed

### Step 1: Clone and Rename Project

```bash
# Clone the template
git clone <your-repo-url> my_new_app
cd my_new_app

# Remove git history and start fresh
rm -rf .git
git init
git add .
git commit -m "Initial commit from MVP Fresh template"
```

### Step 2: Change App Name and Bundle Identifiers

#### 2.1 Update package.json
```json
{
  "name": "my_new_app",  // Change from mvp_fresh
  "displayName": "My New App"  // Your app's display name
}
```

#### 2.2 Update app.json
```json
{
  "name": "my_new_app",  // Must match package.json name
  "displayName": "My New App"
}
```

#### 2.3 iOS Bundle Identifier
1. Open `/ios/mvp_fresh.xcworkspace` in Xcode
2. Select the project in navigator
3. Select the target
4. Change Bundle Identifier from `com.mvpfresh` to `com.yourcompany.mynewapp`
5. Change Display Name to "My New App"
6. Rename the scheme: Product → Scheme → Manage Schemes → Rename to "my_new_app"

#### 2.4 Android Package Name
1. Change package name in these files:
   - `/android/app/build.gradle`:
     ```gradle
     applicationId "com.yourcompany.mynewapp"  // Change from com.mvpfresh
     ```
   - `/android/app/src/main/AndroidManifest.xml`:
     ```xml
     package="com.yourcompany.mynewapp"
     ```

2. Move Java/Kotlin files to new package structure:
   ```bash
   cd android/app/src/main/java
   mkdir -p com/yourcompany/mynewapp
   mv com/mvpfresh/* com/yourcompany/mynewapp/
   rm -rf com/mvpfresh
   ```

3. Update package declarations in:
   - `/android/app/src/main/java/com/yourcompany/mynewapp/MainActivity.kt`
   - `/android/app/src/main/java/com/yourcompany/mynewapp/MainApplication.kt`
   ```kotlin
   package com.yourcompany.mynewapp  // Change from com.mvpfresh
   ```

### Step 3: Firebase Setup

#### 3.1 Create New Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it (e.g., "My New App")
4. Enable Google Analytics (optional)
5. Create project

#### 3.2 Add iOS App
1. In Firebase Console → Project Settings → Add app → iOS
2. iOS bundle ID: `com.yourcompany.mynewapp` (must match Xcode)
3. App nickname: "My New App iOS"
4. Download `GoogleService-Info.plist`
5. Replace `/ios/mvp_fresh/GoogleService-Info.plist` with your new file
6. Open Xcode, remove old plist from project, drag new one in

#### 3.3 Add Android App
1. In Firebase Console → Project Settings → Add app → Android
2. Package name: `com.yourcompany.mynewapp` (must match build.gradle)
3. App nickname: "My New App Android"
4. SHA-1: Get from `cd android && ./gradlew signingReport`
5. Download `google-services.json`
6. Replace `/android/app/google-services.json` with your new file

#### 3.4 Enable Firebase Services
In Firebase Console, enable:
1. Authentication → Sign-in methods:
   - Email/Password
   - Google (configure with support email)
   - Apple (for iOS)
2. Analytics (if desired)
3. Crashlytics (if desired)

### Step 4: Rename iOS Project Files

```bash
cd ios

# Rename xcworkspace
mv mvp_fresh.xcworkspace my_new_app.xcworkspace

# Rename xcodeproj
mv mvp_fresh.xcodeproj my_new_app.xcodeproj

# Rename scheme files
cd my_new_app.xcodeproj/xcshareddata/xcschemes
mv mvp_fresh.xcscheme my_new_app.xcscheme
cd ../../..

# Rename main folder
mv mvp_fresh my_new_app

# Update Podfile
sed -i '' 's/mvp_fresh/my_new_app/g' Podfile

# Clean and reinstall pods
rm -rf Pods Podfile.lock
pod install
```

### Step 5: Update iOS Files

#### 5.1 Update AppDelegate.swift
`/ios/my_new_app/AppDelegate.swift`:
- Change any references from mvp_fresh to my_new_app

#### 5.2 Update Info.plist
`/ios/my_new_app/Info.plist`:
```xml
<key>CFBundleDisplayName</key>
<string>My New App</string>
<key>CFBundleName</key>
<string>my_new_app</string>
```

### Step 6: Clean and Rebuild

```bash
# Clean everything
cd ios && rm -rf build ~/Library/Developer/Xcode/DerivedData/* && cd ..
cd android && ./gradlew clean && cd ..
rm -rf node_modules
npm install

# iOS setup
cd ios && pod install && cd ..

# Start Metro
npx react-native start --reset-cache

# Run on iOS (new terminal)
npx react-native run-ios

# Run on Android (new terminal)
npx react-native run-android
```

### Step 7: App Icons and Splash Screen

#### 7.1 iOS App Icons
1. Create icon set (1024x1024 base image)
2. Use tool like https://appicon.co to generate all sizes
3. In Xcode: Select Assets.xcassets → AppIcon
4. Replace all icon sizes

#### 7.2 Android App Icons
1. In Android Studio: Right-click app → New → Image Asset
2. Configure icon (adaptive and legacy)
3. Generate and replace

#### 7.3 Splash Screen (Optional)
- iOS: Modify LaunchScreen.storyboard in Xcode
- Android: Modify `/android/app/src/main/res/layout/launch_screen.xml`

### Step 8: Google Sign-In Configuration

#### 8.1 iOS
1. In Firebase Console → Authentication → Sign-in method → Google → Web SDK configuration
2. Copy the Web client ID
3. In Xcode → Info.plist, update:
   ```xml
   <key>GIDClientID</key>
   <string>YOUR_IOS_CLIENT_ID</string>
   ```
4. Add URL Scheme (reversed client ID) in Info.plist

#### 8.2 Android
Google Sign-In should work automatically with `google-services.json`

### Step 9: Apple Sign-In (iOS Only)
1. In Xcode → Signing & Capabilities → + Capability → Sign in with Apple
2. In Apple Developer account → Identifiers → Your App ID → Sign in with Apple (enable)

### Step 10: Production Setup

#### 10.1 iOS
1. In Apple Developer account:
   - Create App ID with your bundle identifier
   - Create provisioning profiles (development & distribution)
2. In Xcode:
   - Select your team
   - Configure signing certificates

#### 10.2 Android
1. Generate release keystore:
   ```bash
   cd android/app
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Configure `/android/gradle.properties`:
   ```
   MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=my-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=your_password
   MYAPP_RELEASE_KEY_PASSWORD=your_password
   ```
3. Update `/android/app/build.gradle` signing config

### Step 11: Final Checklist

- [ ] All references to `mvp_fresh` replaced with `my_new_app`
- [ ] All references to `com.mvpfresh` replaced with `com.yourcompany.mynewapp`
- [ ] Firebase config files replaced (iOS and Android)
- [ ] Firebase services enabled (Auth, Analytics, Crashlytics)
- [ ] App icons updated
- [ ] Bundle/package identifiers updated
- [ ] App builds and runs on both platforms
- [ ] Authentication works (email, Google, Apple)
- [ ] No console errors about missing configuration

### Common Issues When Forking

1. **Build fails after renaming**: Clean everything and rebuild
2. **Firebase auth not working**: Check bundle IDs match exactly in Firebase Console
3. **Google Sign-In fails**: Ensure SHA-1 is added to Firebase Android app
4. **Apple Sign-In fails**: Check entitlements and capabilities in Xcode
5. **Metro bundler errors**: Kill all node processes and restart

### Quick Reference Commands

```bash
# Full clean and rebuild
./clean-both-quick.sh
npm install
cd ios && pod install && cd ..
npx react-native run-ios
npx react-native run-android

# Check bundle identifier (iOS)
grep -r "com.mvpfresh" ios/

# Check package name (Android)
grep -r "com.mvpfresh" android/
```

---

## 📋 Recent Changes Log

### September 30, 2024
- Fixed text input focus jumping issues by removing KeyboardAvoidingView
- Simplified all input components to use native TextInput
- Removed animated labels and complex wrappers
- Changed color scheme from black to white backgrounds
- Removed all logo/branding elements per user preference
- Added gesture-handler import to index.js
- Achieved stable working state for iOS and Android
- Added comprehensive forking guide for creating new apps