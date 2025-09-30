#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🧹 Starting iOS Deep Clean...${NC}"
echo ""

# Save current directory
ROOT_DIR=$(pwd)

# Step 1: Kill any Xcode related processes
echo -e "${YELLOW}1. Killing Xcode processes...${NC}"
killall Xcode 2>/dev/null || true
killall xcodebuild 2>/dev/null || true
killall XCBBuildService 2>/dev/null || true
killall IBAgent-iOS 2>/dev/null || true
echo "   ✓ Xcode processes terminated"

# Step 2: Clean Xcode DerivedData
echo -e "${YELLOW}2. Cleaning Xcode DerivedData...${NC}"
rm -rf ~/Library/Developer/Xcode/DerivedData/*
echo "   ✓ DerivedData cleared"

# Step 3: Clean Xcode caches
echo -e "${YELLOW}3. Cleaning Xcode caches...${NC}"
rm -rf ~/Library/Caches/com.apple.dt.Xcode
echo "   ✓ Xcode caches cleared"

# Step 4: Clean iOS build folder
echo -e "${YELLOW}4. Cleaning iOS build folder...${NC}"
cd ios
rm -rf build/
echo "   ✓ iOS build folder removed"

# Step 5: Clean Pods
echo -e "${YELLOW}5. Cleaning CocoaPods...${NC}"
rm -rf Pods/
rm -f Podfile.lock
echo "   ✓ Pods removed"

# Step 6: Clean Pod cache
echo -e "${YELLOW}6. Cleaning Pod cache...${NC}"
pod cache clean --all 2>/dev/null || true
echo "   ✓ Pod cache cleared"

# Step 7: Clean .xcode.env.local if it exists
echo -e "${YELLOW}7. Cleaning .xcode.env files...${NC}"
rm -f .xcode.env.local
echo "   ✓ .xcode.env.local removed"

# Step 8: Clean Metro bundler cache
echo -e "${YELLOW}8. Cleaning Metro bundler cache...${NC}"
cd "$ROOT_DIR"
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/haste-*
echo "   ✓ Metro cache cleared"

# Step 9: Clean watchman
echo -e "${YELLOW}9. Cleaning Watchman...${NC}"
watchman watch-del-all 2>/dev/null || true
echo "   ✓ Watchman watches cleared"

# Step 10: Clean node_modules (optional)
read -p "Do you want to clean node_modules as well? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${YELLOW}10. Cleaning node_modules...${NC}"
    rm -rf node_modules/
    rm -f yarn.lock package-lock.json
    echo "   ✓ node_modules removed"

    echo -e "${YELLOW}11. Reinstalling dependencies...${NC}"
    if [ -f "yarn.lock.bak" ] || command -v yarn &> /dev/null; then
        yarn install
    else
        npm install
    fi
    echo "   ✓ Dependencies reinstalled"
fi

# Step 11: Reinstall Pods
echo -e "${YELLOW}12. Reinstalling Pods...${NC}"
cd ios
pod install
cd "$ROOT_DIR"
echo "   ✓ Pods reinstalled"

echo ""
echo -e "${GREEN}✨ iOS cleaning complete!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Open Xcode: open ios/mvp_fresh.xcworkspace"
echo "2. Select your simulator/device"
echo "3. Press Cmd+B to build"
echo ""
echo "Or run: npx react-native run-ios"