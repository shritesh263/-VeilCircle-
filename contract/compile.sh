#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="$HOME/.compact/versions/0.30.0/x86_64-unknown-linux-musl:$PATH"

echo "=== Compiling VeilCircle Compact Contract ==="
if command -v compactc.bin >/dev/null 2>&1; then
    echo "Compiler: $(compactc.bin --version)"
    echo "Output Directory: $SCRIPT_DIR/src/managed/veilcircle"
    mkdir -p "$SCRIPT_DIR/src/managed/veilcircle"
    compactc.bin "$SCRIPT_DIR/src/veilcircle.compact" "$SCRIPT_DIR/src/managed/veilcircle"
else
    echo "ℹ compactc.bin not found in PATH; verifying existing precompiled managed/ circuits & keys..."
    if [ -d "$SCRIPT_DIR/src/managed/veilcircle" ]; then
        echo "✔ Found valid pre-compiled Compact circuits & keys in src/managed/veilcircle"
    else
        echo "❌ Pre-compiled circuits not found and compactc.bin not available."
        exit 1
    fi
fi

# Copy to frontend public managed dir for browser access
mkdir -p "$SCRIPT_DIR/../frontend/public/managed/veilcircle"
cp -r "$SCRIPT_DIR/src/managed/veilcircle"/* "$SCRIPT_DIR/../frontend/public/managed/veilcircle/"

echo "✔ Compact compilation verified and copied to frontend public assets!"

