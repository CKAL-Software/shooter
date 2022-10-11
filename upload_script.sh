#!/bin/bash

FIRST="export const version = \""
SECOND="\"; // DONT TOUCH THIS LINE. BEING USED BY UPLOAD SCRIPT"
FILE_TO_VERSION="src/lib/version.ts"

read line CURRENT_VERSION < $FILE_TO_VERSION
CURRENT_VERSION=$(echo $CURRENT_VERSION | sed 's/[^0-9.]*\([0-9.]*\).*/\1/')
read -p "Current version: $CURRENT_VERSION. New version: " NEW_VERSION

REPLACEMENT="$FIRST$NEW_VERSION$SECOND"

sed -e "1s|.*|$REPLACEMENT|" -i ".bak" $FILE_TO_VERSION

node ~/Code/TypeScript/version-uploader/uploadVersion.js tower-defense $NEW_VERSION

git add .
git commit -m "$NEW_VERSION"
git push