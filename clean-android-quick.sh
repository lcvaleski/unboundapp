#!/bin/bash

echo "🧹 Quick Android Clean..."

# Clean gradle build cache
echo "→ Cleaning Android build folders..."
cd android
./gradlew clean
cd ..

# Clear React Native build folder
echo "→ Cleaning React Native Android build cache..."
rm -rf android/app/build

echo "✅ Quick Android clean complete!"
echo ""
echo "Run with: npx react-native run-android"