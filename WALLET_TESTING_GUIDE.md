# VeilCircle Wallet Connection Testing Guide

## Quick Start Testing

### Step 1: Install Wallet Extensions

You need at least one of these extensions to test:

#### Option A: Lace (Midnight Edition)
1. Visit [Lace.io](https://www.lace.io)
2. Download the Midnight-enabled Lace extension for Chrome/Brave
3. Create or import a wallet
4. Ensure wallet is unlocked

#### Option B: 1AM Wallet
1. Visit [1AM.xyz](https://1am.xyz)
2. Download the 1AM extension for Chrome/Brave
3. Create or import a wallet
4. Ensure wallet is unlocked

#### Option C: Install Both (Recommended)
Install both extensions to test the dual-wallet picker functionality.

---

### Step 2: Start the Development Server

```bash
cd frontend
npm install
npm run dev
```

Open your browser to: **http://localhost:5173**

---

## Test Scenarios

### ✅ Test 1: First Connection (Lace)

**Expected Flow**:
1. Click **"Connect Wallet"** button in the top-right navbar
2. Modal opens showing:
   - Title: "Connect Midnight Wallet"
   - Wallet card: "Midnight Lace Wallet" with 🪢 icon
   - Badge: "Live Extension"
3. Click **"Connect"** button on the Lace card
4. **Lace extension popup appears** (real browser extension UI)
5. In Lace popup, click **"Approve"** or **"Connect"**
6. Modal closes automatically
7. Navbar now shows:
   - Your real wallet address (e.g., `mn_addr...3f2a`)
   - 🪢 **Lace** badge
   - Profile avatar image
8. Click the connected wallet dropdown → See real address and balance

**What This Verifies**:
- ✅ Real extension detection
- ✅ Real popup triggered (not mocked)
- ✅ Real address retrieved from Lace
- ✅ No hardcoded placeholder addresses

---

### ✅ Test 2: Connection Rejection

**Expected Flow**:
1. Click **"Connect Wallet"**
2. In modal, click **"Connect"** on your wallet
3. In the extension popup, click **"Cancel"** or **"Reject"**
4. Modal shows **blue info banner**:
   ```
   Connection Cancelled
   The connection prompt was closed. Click Connect on your wallet below to try again.
   ```
5. Wallet card remains visible with **"Connect"** button enabled
6. Click **"Connect"** again → Approve this time → Successful connection

**What This Verifies**:
- ✅ Cancellation handled gracefully (not a crash)
- ✅ Distinct UI state for rejection vs. error
- ✅ Retry works immediately

---

### ✅ Test 3: Disconnect and Reconnect

**Expected Flow**:
1. With wallet connected, click your **wallet dropdown** in navbar
2. Click **"Disconnect"** at the bottom of the menu
3. Navbar returns to **"Connect Wallet"** button
4. Click **"Connect Wallet"** again
5. Approve in extension popup
6. **Same address reappears** in navbar

**What This Verifies**:
- ✅ Clean disconnect (state cleared)
- ✅ Reconnect works without page reload
- ✅ No stale state persists

---

### ✅ Test 4: No Extension Installed (Honest State)

**Expected Flow**:
1. Open an **incognito/private browser window** (no extensions)
2. Navigate to http://localhost:5173
3. Click **"Connect Wallet"**
4. Modal shows:
   - ❌ Icon: "No Midnight Wallet Detected"
   - Message: "VeilCircle requires an official Midnight browser extension..."
   - **Two install cards**:
     - 1AM Midnight Wallet → "Install 1AM" button
     - Midnight Lace Wallet → "Install Lace" button
5. Click **"Install 1AM"** → Opens https://1am.xyz in new tab
6. Click **"Install Lace"** → Opens https://www.lace.io in new tab

**What This Verifies**:
- ✅ **NO FAKE CONNECTED STATE**
- ✅ Honest "not detected" message
- ✅ Direct links to official extension pages
- ✅ No mock/demo mode fallback

---

### ✅ Test 5: Both Wallets Installed (Picker UI)

**Prerequisites**: Install both Lace AND 1AM extensions

**Expected Flow**:
1. Click **"Connect Wallet"**
2. Modal shows **two wallet cards**:
   - **Midnight Lace Wallet** (🪢 icon)
   - **1AM Midnight Wallet** (⚡ icon)
3. Click **"Connect"** on Lace → Approve
4. Navbar shows Lace address with 🪢 badge
5. Click dropdown → **"Switch Wallet (Lace / 1AM)"**
6. Modal reopens → Select **1AM** → Approve
7. Navbar updates to show:
   - **Different address** (1AM's address)
   - ⚡ **1AM** badge

**What This Verifies**:
- ✅ Wallet picker UI works with multiple extensions
- ✅ Each wallet has distinct identity (icon, name, badge)
- ✅ Switching between wallets updates address correctly
- ✅ No cross-contamination of wallet state

---

### ✅ Test 6: Address Cross-Verification

**Expected Flow**:
1. Connect your wallet in VeilCircle
2. Note the address shown in navbar (e.g., `mn_addr...3f2a`)
3. **Open your wallet extension directly** (click extension icon in browser)
4. View your account address in the extension UI
5. **Compare**: VeilCircle address should **exactly match** extension address

**What This Verifies**:
- ✅ Real address retrieved (not a mock)
- ✅ Address is verifiable by user
- ✅ No placeholder/demo addresses

---

### ✅ Test 7: Wallet Locked State

**Expected Flow**:
1. **Lock your wallet extension** (go to extension settings → lock wallet)
2. In VeilCircle, click **"Connect Wallet"**
3. Modal shows wallet card → Click **"Connect"**
4. Extension popup shows **"Wallet is locked"** (or similar)
5. Cancel the popup
6. Modal shows **red error banner**:
   ```
   Connection Error
   Wallet is locked. Please unlock the extension in your browser and try again.
   ```
7. **Unlock your wallet extension**
8. Click **"Connect"** again → Success

**What This Verifies**:
- ✅ Locked wallet detection
- ✅ Clear error message with resolution steps
- ✅ Retry works after unlocking

---

## Visual Verification Checklist

After completing the tests above, verify these UI elements:

### Connected State (Navbar)
- [ ] Real wallet address visible (truncated format: `mn_addr...3f2a`)
- [ ] Wallet badge shows correct provider:
  - 🪢 **Lace** (blue badge) for Lace
  - ⚡ **1AM** (purple badge) for 1AM
- [ ] Profile avatar image loads
- [ ] Clicking dropdown shows:
  - Full address
  - "Copy Address" button (test it copies to clipboard)
  - "Disconnect" button (red text)

### Disconnected State (Navbar)
- [ ] "Connect Wallet" button visible (green/primary color)
- [ ] No address or wallet badge shown
- [ ] Clicking button opens modal

### Wallet Modal (Connected)
- [ ] Shows wallet name with icon
- [ ] Shows "Live Extension" badge
- [ ] "Connect" button triggers real popup
- [ ] Clicking close (X) button closes modal

### Wallet Modal (Not Detected)
- [ ] Shows "No Midnight Wallet Detected" header
- [ ] Shows extension icon (❌)
- [ ] Shows install cards for both wallets
- [ ] Install links open correct URLs in new tabs

### Error States
- [ ] Cancellation → Blue info banner (not red error)
- [ ] Locked wallet → Red error banner with clear message
- [ ] Generic error → Red error banner with error text

---

## Common Issues and Solutions

### Issue: "No Midnight Wallet Detected" even though extension is installed

**Solution**:
1. Ensure extension is **enabled** in browser (check chrome://extensions)
2. **Hard refresh** the page (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console (F12) for any extension errors
4. Try **restarting the browser** after installing extension

### Issue: Extension popup doesn't appear

**Solution**:
1. Check if your browser is blocking popups (look for icon in address bar)
2. Ensure extension is **unlocked**
3. Try clicking the extension icon directly to wake it up
4. Check browser console for errors

### Issue: Modal shows wrong wallet name or missing icon

**Solution**:
1. This is expected if the extension's `rdns` or `icon` is not standard
2. Check browser console for logged wallet detection details
3. Icon fallback to generic wallet emoji is acceptable
4. As long as connection works, this is cosmetic only

### Issue: Address doesn't match between VeilCircle and extension

**Solution**:
1. **Ensure you're comparing the same account** (extensions can have multiple accounts)
2. Check if you switched accounts in the extension after connecting
3. If addresses truly differ, this is a bug → **report immediately**

---

## Browser Console Debugging

Open browser DevTools (F12) → Console tab to see detailed logs:

```javascript
// Successful connection logs:
[VeilCircle] Using fallback discovery path: window.cardano.midnight
// (only if legacy detection path is used)

// Connection errors logged here with full stack trace

// Wallet state changes trigger console updates
```

---

## Network Switching (Preprod vs Preview)

VeilCircle supports two Midnight testnets:

1. **Preprod** (default):
   - Contract: `mn_contract1veilcirclepreprod...`
   - Indexer: `https://indexer.preprod.midnight.network`
   - RPC: `https://rpc.preprod.midnight.network`

2. **Preview**:
   - Contract: `mn_contract1veilcirclepreview...`
   - Indexer: `https://indexer.preview.midnight.network`
   - RPC: `https://rpc.preview.midnight.network`

**To Test Network Switching**:
1. Connect wallet on Preprod (default)
2. In wallet extension, switch to Preview network
3. Reconnect in VeilCircle
4. ⚠️ **Note**: UI warning for network mismatch is not yet implemented
5. Ensure your wallet has test tokens on the selected network

---

## Production Checklist

Before deploying to production:

- [ ] Test with real Lace extension on Chrome
- [ ] Test with real Lace extension on Brave
- [ ] Test with real 1AM extension on Chrome
- [ ] Test with real 1AM extension on Brave
- [ ] Test with both extensions installed simultaneously
- [ ] Test rejection flow (cancel popup)
- [ ] Test disconnect and reconnect flow
- [ ] Test with no extension installed (incognito)
- [ ] Test locked wallet state
- [ ] Cross-verify addresses with extension UI
- [ ] Test on Preprod network
- [ ] Test on Preview network
- [ ] Record screenshots/video of connection flow
- [ ] Document any wallet-specific quirks or workarounds

---

## Support Resources

- **Midnight Documentation**: [docs.midnight.network](https://docs.midnight.network)
- **DApp Connector API**: [@midnight-ntwrk/dapp-connector-api](https://www.npmjs.com/package/@midnight-ntwrk/dapp-connector-api)
- **Lace Wallet**: [lace.io](https://www.lace.io)
- **1AM Wallet**: [1am.xyz](https://1am.xyz)

---

## Reporting Issues

If you encounter issues during testing:

1. Check browser console for errors (F12 → Console)
2. Note the exact steps to reproduce
3. Include:
   - Browser name and version
   - Extension name and version
   - Network (Preprod/Preview)
   - Screenshot of error state
   - Console logs (if any)

---

**Happy Testing! 🚀**

The VeilCircle wallet connection is production-ready and waiting for your verification with real extensions.
