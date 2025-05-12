#!/usr/bin/env bash
set -e

# Ensure script is run as root
if [ "$(id -u)" -ne 0 ]; then
  echo "❌ This script must be run as root. Use sudo."
  exit 1
fi

# AUTO-DETECT CARBONIO UI PATH
CARBONIO_UI_PATH=$(find /opt /usr -type d -name "carbonio-admin-ui" 2>/dev/null | head -n 1)

if [ -z "$CARBONIO_UI_PATH" ]; then
  echo "❌ Could not auto-detect carbonio-admin-ui path."
  echo "Please set CARBONIO_UI_PATH manually in this script."
  exit 1
fi

echo "✅ Detected Carbonio UI path at: $CARBONIO_UI_PATH"

# CONFIGURATION
ADDON_NAME="delegated-admin"
REPO_CLONE_DIR="/opt/carbonio-addon-$ADDON_NAME"

# Clone your fork (customize if needed)
echo "Cloning your custom UI repo..."
git clone https://github.com/Priyantha/carbonio-admin-ui.git "$REPO_CLONE_DIR"

# Copy frontend files
echo "Installing UI components..."
mkdir -p "$CARBONIO_UI_PATH/src/$ADDON_NAME"
cp "$REPO_CLONE_DIR/src/$ADDON_NAME"/*.jsx "$CARBONIO_UI_PATH/src/$ADDON_NAME/"
cp "$REPO_CLONE_DIR/src/$ADDON_NAME"/*.js "$CARBONIO_UI_PATH/src/$ADDON_NAME/"

# Patch sidebar (if applicable)
SIDEBAR_FILE="$CARBONIO_UI_PATH/src/components/Sidebar.jsx"
if [ -f "$SIDEBAR_FILE" ] && ! grep -q "$ADDON_NAME" "$SIDEBAR_FILE"; then
  echo "Registering sidebar item..."
  sed -i "/<ul className=\"sidebar-nav\">/a \\\n    <li><a href=\"/#/$ADDON_NAME\" className=\"sidebar-link\">Delegated Admin</a></li>" "$SIDEBAR_FILE"
fi

# Copy backend CLI wrapper
cp "$REPO_CLONE_DIR/src/$ADDON_NAME/cliWrapper.js" /usr/local/bin/cliWrapper.js
chmod +x /usr/local/bin/cliWrapper.js

# Restart UI (if needed)
echo "Restarting Carbonio Admin UI..."
systemctl restart carbonio-admin-ui || echo "⚠️ Restart failed — restart manually if needed"

echo "✅ Addon '$ADDON_NAME' installed successfully!"
