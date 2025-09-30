#!/bin/bash

# Fork and Rename Script for MVP Fresh
# Usage: ./fork-rename.sh <new_app_name> <bundle_id>
# Example: ./fork-rename.sh my_awesome_app com.yourcompany.myawesomeapp

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <new_app_name> <bundle_id>"
    echo "Example: $0 my_awesome_app com.yourcompany.myawesomeapp"
    exit 1
fi

NEW_NAME=$1
BUNDLE_ID=$2
DISPLAY_NAME=$(echo "$NEW_NAME" | sed 's/_/ /g' | sed 's/\b\(.\)/\u\1/g')

echo "🚀 Forking MVP Fresh to: $NEW_NAME"
echo "📦 Bundle ID: $BUNDLE_ID"
echo "📱 Display Name: $DISPLAY_NAME"
echo ""

# Update package.json
echo "✅ Updating package.json..."
sed -i '' "s/\"name\": \"mvp_fresh\"/\"name\": \"$NEW_NAME\"/" package.json
sed -i '' "s/\"displayName\": \"mvp_fresh\"/\"displayName\": \"$DISPLAY_NAME\"/" package.json

# Update app.json
echo "✅ Updating app.json..."
sed -i '' "s/\"name\": \"mvp_fresh\"/\"name\": \"$NEW_NAME\"/" app.json
sed -i '' "s/\"displayName\": \"mvp_fresh\"/\"displayName\": \"$DISPLAY_NAME\"/" app.json

# Android: Update applicationId
echo "✅ Updating Android application ID..."
sed -i '' "s/applicationId \"com.mvpfresh\"/applicationId \"$BUNDLE_ID\"/" android/app/build.gradle
sed -i '' "s/package=\"com.mvpfresh\"/package=\"$BUNDLE_ID\"/" android/app/src/main/AndroidManifest.xml

# Android: Create new package directory structure
echo "✅ Restructuring Android package folders..."
PACKAGE_PATH=$(echo $BUNDLE_ID | sed 's/\./\//g')
mkdir -p "android/app/src/main/java/$PACKAGE_PATH"

# Move Kotlin files to new package
mv android/app/src/main/java/com/mvpfresh/*.kt "android/app/src/main/java/$PACKAGE_PATH/" 2>/dev/null || true

# Update package declarations in Kotlin files
echo "✅ Updating Android Kotlin package declarations..."
for file in android/app/src/main/java/$PACKAGE_PATH/*.kt; do
    if [ -f "$file" ]; then
        sed -i '' "s/package com.mvpfresh/package $BUNDLE_ID/" "$file"
    fi
done

# Remove old package directory
rm -rf android/app/src/main/java/com/mvpfresh

# iOS: Rename workspace and project files
echo "✅ Renaming iOS project files..."
cd ios

# Rename workspace
if [ -f "mvp_fresh.xcworkspace" ]; then
    mv mvp_fresh.xcworkspace "$NEW_NAME.xcworkspace"
fi

# Rename xcodeproj
if [ -d "mvp_fresh.xcodeproj" ]; then
    mv mvp_fresh.xcodeproj "$NEW_NAME.xcodeproj"

    # Rename scheme file
    if [ -f "$NEW_NAME.xcodeproj/xcshareddata/xcschemes/mvp_fresh.xcscheme" ]; then
        mv "$NEW_NAME.xcodeproj/xcshareddata/xcschemes/mvp_fresh.xcscheme" \
           "$NEW_NAME.xcodeproj/xcshareddata/xcschemes/$NEW_NAME.xcscheme"

        # Update scheme file contents
        sed -i '' "s/mvp_fresh/$NEW_NAME/g" "$NEW_NAME.xcodeproj/xcshareddata/xcschemes/$NEW_NAME.xcscheme"
    fi
fi

# Rename main app folder
if [ -d "mvp_fresh" ]; then
    mv mvp_fresh "$NEW_NAME"
fi

# Update Podfile
echo "✅ Updating Podfile..."
sed -i '' "s/mvp_fresh/$NEW_NAME/g" Podfile

# Update project.pbxproj for bundle identifier
echo "✅ Updating iOS bundle identifier..."
sed -i '' "s/com.mvpfresh/$BUNDLE_ID/g" "$NEW_NAME.xcodeproj/project.pbxproj"
sed -i '' "s/mvp_fresh/$NEW_NAME/g" "$NEW_NAME.xcodeproj/project.pbxproj"

# Update Info.plist
if [ -f "$NEW_NAME/Info.plist" ]; then
    plutil -replace CFBundleDisplayName -string "$DISPLAY_NAME" "$NEW_NAME/Info.plist"
    plutil -replace CFBundleName -string "$NEW_NAME" "$NEW_NAME/Info.plist"
fi

cd ..

echo ""
echo "✅ Renaming complete!"
echo ""
echo "📋 Next steps:"
echo "1. Ensure your Firebase config files are in place:"
echo "   - iOS: ios/$NEW_NAME/GoogleService-Info.plist"
echo "   - Android: android/app/google-services.json"
echo ""
echo "2. Clean and rebuild:"
echo "   ./clean-both-quick.sh"
echo "   npm install"
echo "   cd ios && pod install && cd .."
echo ""
echo "3. Open Xcode and update:"
echo "   - Open ios/$NEW_NAME.xcworkspace"
echo "   - Select project → Target → General"
echo "   - Verify Bundle Identifier is: $BUNDLE_ID"
echo "   - Verify Display Name is: $DISPLAY_NAME"
echo "   - Add signing team if needed"
echo ""
echo "4. Run the app:"
echo "   npx react-native run-ios"
echo "   npx react-native run-android"
echo ""
echo "🎉 Your new app '$DISPLAY_NAME' is ready!"