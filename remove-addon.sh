#!/usr/bin/env bash
set -e

# Ensure script is run as root
if [ "$(id -u)" -ne 0 ]; then
  echo "ERROR: This script must be run as root. Use sudo."
  exit 1
fi

# Dry-run mode
DRY_RUN=false
if [ "$1" == "--dry-run" ]; then
  DRY_RUN=true
  echo "INFO: Running in dry-run mode. No files will be modified."
fi

# AUTO-DETECT CARBONIO UI PATH
CARBONIO_UI_PATH=$(find /opt /usr -type d -name "carbonio-admin-ui" 2>/dev/null | head -n 1)

if [ -z "$CARBONIO_UI_PATH" ]; then
  echo "ERROR: Could not auto-detect carbonio-admin-ui path."
  echo "Please set CARBONIO_UI_PATH manually in this script."
  exit 1
fi

echo "INFO: Detected Carbonio UI path at: $CARBONIO_UI_PATH"

# CONFIGURATION
ADDON_NAME="delegated-admin"
VERSION_FILE="$CARBONIO_UI_PATH/src/$ADDON_NAME/VERSION"
VERSION="unknown"
if [ -f "$VERSION_FILE" ]; then
  VERSION=$(cat "$VERSION_FILE")
fi

echo "INFO: Preparing to remove addon '$ADDON_NAME' (version $VERSION)..."

# Remove frontend files
echo "INFO: Removing UI components..."
$DRY_RUN || rm -rf "$CARBONIO_UI_PATH/src/$ADDON_NAME"

# Unpatch sidebar
SIDEBAR_FILE="$CARBONIO_UI_PATH/src/components/Sidebar.jsx"
if [ -f "$SIDEBAR_FILE" ]; then
  echo "INFO: Cleaning up sidebar link..."
  $DRY_RUN || sed -i "/\/$ADDON_NAME/d" "$SIDEBAR_FILE"
fi

# Remove CLI wrapper
if [ -f "/usr/local/bin/cliWrapper.js" ]; then
  echo "INFO: Removing CLI wrapper..."
  $DRY_RUN || rm /usr/local/bin/cliWrapper.js
fi

# Remove cloned repo
REPO_CLONE_DIR="/opt/carbonio-addon-$ADDON_NAME"
echo "INFO: Removing cloned repo at $REPO_CLONE_DIR..."
$DRY_RUN || rm -rf "$REPO_CLONE_DIR"

# Restart UI (if needed)
echo "INFO: Restarting Carbonio Admin UI..."
$DRY_RUN || systemctl restart carbonio-admin-ui || echo "WARNING: Restart failed - restart manually if needed"

echo "INFO: Addon '$ADDON_NAME' version $VERSION removed successfully."
