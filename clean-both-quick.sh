#!/bin/bash

echo "🧹 Quick Clean for iOS & Android..."
echo ""

# iOS Clean
echo "📱 iOS:"
echo "→ Cleaning iOS build folder..."
rm -rf ios/build
echo "→ Cleaning derived data..."
rm -rf ~/Library/Developer/Xcode/DerivedData/mvp_fresh-*
killall Xcode 2>/dev/null || true
killall xcodebuild 2>/dev/null || true
killall XCBBuildService 2>/dev/null || true

# Android Clean
echo ""
echo "🤖 Android:"
echo "→ Cleaning Android build..."
cd android && ./gradlew clean 2>/dev/null && cd ..
rm -rf android/app/build

# Metro bundler
echo ""
echo "📦 Metro:"
echo "→ Resetting Metro cache..."
npx react-native start --reset-cache &
METRO_PID=$!
sleep 3
kill $METRO_PID 2>/dev/null || true

echo ""
echo "✅ Quick clean complete for both platforms!"
echo ""
echo "Next steps:"
echo "  iOS:     npx react-native run-ios"
echo "  Android: npx react-native run-android"