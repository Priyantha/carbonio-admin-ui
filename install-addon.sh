#!/usr/bin/env bash
set -e

# Ensure script is run as root
if [ "$(id -u)" -ne 0 ]; then
  echo "ERROR: This script must be run as root. Use sudo."
  exit 1
fi

# Dry-run and update flags
DRY_RUN=false
FORCE_UPDATE=false

for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      echo "INFO: Running in dry-run mode. No files will be modified."
      ;;
    --update)
      FORCE_UPDATE=true
      echo "INFO: Update mode enabled. Will overwrite existing files."
      ;;
  esac
  shift
done

# Auto-detect Carbonio Admin UI path
CARBONIO_UI_PATH=$(find /opt /usr -type d -name "carbonio-admin-ui" 2>/dev/null | head -n 1)

if [ -z "$CARBONIO_UI_PATH" ]; then
  echo "ERROR: Could not auto-detect carbonio-admin-ui path."
  echo "Please set CARBONIO_UI_PATH manually in this script."
  exit 1
fi

echo "INFO: Detected Carbonio UI path at: $CARBONIO_UI_PATH"

# Configuration
ADDON_NAME="delegated-admin"
REPO_CLONE_DIR="/opt/carbonio-addon-$ADDON_NAME"
VERSION="0.1.0"
VERSION_FILE="$CARBONIO_UI_PATH/src/$ADDON_NAME/VERSION"

# Version check and block downgrade if needed
if [ -f "$VERSION_FILE" ]; then
  CURRENT_VERSION=$(cat "$VERSION_FILE")
  NEWER=$(printf "%s\n%s" "$CURRENT_VERSION" "$VERSION" | sort -V | tail -n1)
  if [ "$NEWER" != "$VERSION" ] && [ "$FORCE_UPDATE" = false ]; then
    echo "WARNING: Installed version ($CURRENT_VERSION) is newer than script version ($VERSION)."
    echo "Use --update to force overwrite."
    exit 1
  fi
fi

# Clone or update repository
if [ "$FORCE_UPDATE" = true ] && [ -d "$REPO_CLONE_DIR" ]; then
  echo "Updating local clone of repo..."
  $DRY_RUN || git -C "$REPO_CLONE_DIR" pull
else
  echo "Cloning your custom UI repo..."
  $DRY_RUN || git clone https://github.com/Priyantha/carbonio-admin-ui.git "$REPO_CLONE_DIR"
fi

# Install frontend files
echo "Installing UI components..."
$DRY_RUN || mkdir -p "$CARBONIO_UI_PATH/src/$ADDON_NAME"
$DRY_RUN || cp "$REPO_CLONE_DIR/src/$ADDON_NAME"/*.jsx "$CARBONIO_UI_PATH/src/$ADDON_NAME/"
$DRY_RUN || cp "$REPO_CLONE_DIR/src/$ADDON_NAME"/*.js "$CARBONIO_UI_PATH/src/$ADDON_NAME/"
$DRY_RUN || echo "$VERSION" > "$VERSION_FILE"

# Patch sidebar
SIDEBAR_FILE="$CARBONIO_UI_PATH/src/components/Sidebar.jsx"
if [ -f "$SIDEBAR_FILE" ] && ! grep -q "$ADDON_NAME" "$SIDEBAR_FILE"; then
  echo "Registering sidebar item..."
  $DRY_RUN || sed -i "/<ul className=\"sidebar-nav\">/a \\\n    <li><a href=\"/#/$ADDON_NAME\" className=\"sidebar-link\">Delegated Admin</a></li>" "$SIDEBAR_FILE"
fi

# Copy backend CLI wrapper
echo "Installing CLI backend wrapper..."
$DRY_RUN || cp "$REPO_CLONE_DIR/src/$ADDON_NAME/cliWrapper.js" /usr/local/bin/cliWrapper.js
$DRY_RUN || chmod +x /usr/local/bin/cliWrapper.js

# Try restarting relevant Carbonio services
restart_candidates=("carbonio-user-management" "carbonio-mailbox-admin-sidecar" "carbonio")
for svc in "${restart_candidates[@]}"; do
  if systemctl list-units --type=service | grep -q "$svc"; then
    echo "INFO: Restarting $svc..."
    $DRY_RUN || systemctl restart "$svc" && break
  fi
done

echo "INFO: Addon '$ADDON_NAME' v$VERSION installation complete."
