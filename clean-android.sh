#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🤖 Starting Android Deep Clean...${NC}"
echo ""

# Save current directory
ROOT_DIR=$(pwd)

# Step 1: Kill any Java/Gradle processes
echo -e "${YELLOW}1. Killing Java/Gradle processes...${NC}"
pkill -f gradle 2>/dev/null || true
pkill -f java.*gradle 2>/dev/null || true
pkill -f kotlin 2>/dev/null || true
echo "   ✓ Gradle processes terminated"

# Step 2: Clean Android build folders
echo -e "${YELLOW}2. Cleaning Android build folders...${NC}"
cd android
rm -rf build/
rm -rf app/build/
rm -rf .gradle/
echo "   ✓ Build folders removed"

# Step 3: Clean Gradle cache
echo -e "${YELLOW}3. Cleaning Gradle cache...${NC}"
rm -rf ~/.gradle/caches/
echo "   ✓ Gradle cache cleared"

# Step 4: Clean Android build cache
echo -e "${YELLOW}4. Cleaning Android build cache...${NC}"
if [ -d "$HOME/.android/build-cache" ]; then
    rm -rf ~/.android/build-cache/
    echo "   ✓ Android build cache cleared"
else
    echo "   ✓ No Android build cache found"
fi

# Step 5: Clean Gradle daemon
echo -e "${YELLOW}5. Stopping Gradle daemon...${NC}"
./gradlew --stop 2>/dev/null || true
echo "   ✓ Gradle daemon stopped"

# Step 6: Clean generated files
echo -e "${YELLOW}6. Cleaning generated files...${NC}"
find . -type f -name "*.iml" -delete 2>/dev/null || true
rm -rf .idea/ 2>/dev/null || true
rm -f local.properties 2>/dev/null || true
echo "   ✓ Generated files removed"

# Step 7: Clean React Native Android cache
echo -e "${YELLOW}7. Cleaning React Native Android cache...${NC}"
cd "$ROOT_DIR"
rm -rf android/.hermesversion
rm -rf android/app/src/main/assets/
rm -rf android/app/src/debug/assets/
rm -rf android/app/src/release/assets/
echo "   ✓ React Native Android cache cleared"

# Step 8: Clean Metro bundler cache
echo -e "${YELLOW}8. Cleaning Metro bundler cache...${NC}"
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/haste-*
echo "   ✓ Metro cache cleared"

# Step 9: Clean watchman
echo -e "${YELLOW}9. Cleaning Watchman...${NC}"
watchman watch-del-all 2>/dev/null || true
echo "   ✓ Watchman watches cleared"

# Step 10: Invalidate Android Studio caches (if exists)
echo -e "${YELLOW}10. Checking for Android Studio caches...${NC}"
AS_CACHE_DIRS=(
    ~/Library/Caches/AndroidStudio*
    ~/Library/Caches/Google/AndroidStudio*
    ~/.AndroidStudio*/system/caches
)
for dir in "${AS_CACHE_DIRS[@]}"; do
    if ls $dir 2>/dev/null 1>&2; then
        rm -rf $dir
        echo "   ✓ Cleared: $dir"
    fi
done

# Step 11: Clean node_modules (optional)
read -p "Do you want to clean node_modules as well? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${YELLOW}11. Cleaning node_modules...${NC}"
    rm -rf node_modules/
    rm -f yarn.lock package-lock.json
    echo "   ✓ node_modules removed"

    echo -e "${YELLOW}12. Reinstalling dependencies...${NC}"
    if [ -f "yarn.lock.bak" ] || command -v yarn &> /dev/null; then
        yarn install
    else
        npm install
    fi
    echo "   ✓ Dependencies reinstalled"
fi

# Step 12: Rebuild Android project
echo -e "${YELLOW}13. Rebuilding Android project...${NC}"
cd android

# Clean using gradlew
echo "   Running gradlew clean..."
./gradlew clean

# Generate debug.keystore if missing
if [ ! -f ~/.android/debug.keystore ]; then
    echo -e "${YELLOW}14. Generating debug keystore...${NC}"
    keytool -genkey -v -keystore ~/.android/debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US" 2>/dev/null || true
    echo "   ✓ Debug keystore generated"
fi

cd "$ROOT_DIR"

echo ""
echo -e "${GREEN}✨ Android cleaning complete!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Run the app: npx react-native run-android"
echo "2. Or build manually:"
echo "   cd android && ./gradlew assembleDebug"
echo ""
echo "If you still have issues, try:"
echo "  • Ensure Android emulator/device is running"
echo "  • Check adb devices"
echo "  • Restart Metro: npx react-native start --reset-cache"