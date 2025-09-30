#!/bin/bash

echo "🧹 Quick iOS Clean..."

# Clean Xcode build folder
echo "→ Cleaning iOS build folder..."
rm -rf ios/build

# Clean Xcode derived data for this project only
echo "→ Cleaning derived data..."
rm -rf ~/Library/Developer/Xcode/DerivedData/mvp_fresh-*

# Kill any stuck Xcode processes
echo "→ Killing stuck Xcode processes..."
killall Xcode 2>/dev/null || true
killall xcodebuild 2>/dev/null || true
killall XCBBuildService 2>/dev/null || true

echo "✅ Quick iOS clean complete!"
echo ""
echo "Run with: npx react-native run-ios"