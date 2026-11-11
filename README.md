# Verdant Rewards — Cross-Platform Loyalty Rewards Prototype (Phase One)

**Verdant Rewards** is an interactive cross-platform frontend prototype built with **React Native**, **Expo**, **TypeScript**, and **Expo Router** (with full **React Native Web** support). It demonstrates a luxury digital-banking-inspired loyalty rewards experience paired with simulated Web3 wallet connectivity and read-only ERC-20 contract introspection.

---

## Project Overview

The project consists of two cohesive experiences:

1. **Marketing Landing Page (`/`)**
   - Calm, editorial intro loader (~1.25s on first entry)
   - Transparent-to-frosted-ivory sticky navigation bar with smooth section scrolling
   - Cinematic architectural daylight hero with interactive mobile wallet preview
   - Product value strip, *How It Works* walkthrough cards, organized rewards showcase, smart contract visualization section, transparency pillars, contact modal, and legal notice modals

2. **Interactive Mobile & Desktop Application (`/app`)**
   - **Login / Welcome (`/app/login`)**: Input validation, password visibility toggle, remember me, forgot-password preview modal, and instant **Continue as Demo User**
   - **Rewards Dashboard (`/app/dashboard`)**: Total reward balance card (`12,840.50 RWD`), earned/redeemed/count metrics, interactive 7-day SVG reward activity chart, recent transactions feed, and live wallet status card
   - **Digital Wallet (`/app/wallet`)**: Full simulated wallet state, copyable address, network status, and interactive read-only ERC-20 ABI call preview
   - **Transaction History (`/app/transactions`)**: Virtualized `FlatList` across 24 centralized transactions, type & date range filters, live search, and detailed modal with transaction hash, addresses, block height, confirmations, and simulated explorer notice
   - **Profile (`/app/profile`) & Settings (`/app/settings`)**: Editable demo profile, persisted notification preferences, Light (Warm Ivory) & Dark (Deep Pine) theme toggle, Help & Support modal, and discreet Simulation Controls for testing error states

---

## Technology Stack

- **Framework**: React Native (`0.88.1`) + Expo (`~58.0`) + Expo Router (`~58.0`)
- **Web Support**: React Native Web (`~0.21`)
- **Language**: TypeScript (strict mode)
- **State Management & Persistence**: Zustand (`^5.1`) + `@react-native-async-storage/async-storage`
- **Icons & Graphics**: `lucide-react-native`, `react-native-svg`
- **Typography**: `@expo-google-fonts/dm-sans`, `@expo-google-fonts/inter`, `@expo-google-fonts/playfair-display`
- **Clipboard**: `expo-clipboard`

---

## Installation & Development Commands

### Prerequisites

- Node.js 20+ and npm
- Expo Go app on iOS/Android (for physical mobile testing) or a modern desktop/mobile browser

### Install Dependencies

```bash
npm install
```

### Run the Web Demo

```bash
npm run web
```

To create a static production web bundle (`dist/`):

```bash
npm run build:web
```

### Deploying to Netlify

The repository includes [`netlify.toml`](./netlify.toml) and `.nvmrc` preconfigured for Expo Web (`output: "single"`):

- **Build command**: `npm run build:web` (`expo export --platform web`)
- **Publish directory**: `dist`
- **Node version**: `22` (`>=22.13.0` required by Expo SDK 58)
- **SPA Redirects**: All deep routes (`/app/dashboard`, `/app/transactions`, `/app/login`, etc.) rewrite cleanly to `/index.html` (`status = 200`)

Simply import this GitHub repository into Netlify and deploy without additional configuration.

### Run the Mobile Application

```bash
# Start Metro bundler
npm start

# Launch directly on iOS Simulator (macOS) or Android Emulator
npm run ios
npm run android
```

### Type Check & Lint

```bash
npx tsc --noEmit
npm run lint
```

---

## Project Structure

```text
src/
├── app/                      # Expo Router routes
│   ├── _layout.tsx           # Root font loading, theme provider, toast overlay
│   ├── index.tsx             # Marketing landing page (/)
│   └── app/                  # Interactive application routes (/app/*)
│       ├── _layout.tsx
│       ├── index.tsx         # Smart entry redirect
│       ├── login.tsx         # Login / Welcome & Demo Login
│       ├── dashboard.tsx     # Main Rewards Dashboard
│       ├── transactions.tsx  # Filterable Transaction History
│       ├── wallet.tsx        # Wallet & Smart Contract Inspector
│       ├── profile.tsx       # Member Profile & Preferences
│       └── settings.tsx      # Appearance, Notifications & Simulation Controls
├── components/
│   ├── common/               # BrandLogo, Button, Card, ModalShell, Skeleton, EmptyState, Toast, DemoModeBanner
│   ├── dashboard/            # BalanceCard, StatsRow, RewardActivityChart, RecentTransactionsCard, WalletStatusCard
│   ├── landing/              # LandingNavbar, HeroSection, HeroBackground, HeroPhonePreview, TrustStrip, HowItWorks, RewardsShowcase, WalletTech, Security, FinalCta, Footer
│   ├── navigation/           # Responsive AppShell (Desktop Sidebar, Tablet Rail, Mobile Bottom Tabs)
│   ├── profile/              # EditProfile, ChangePassword, PrivacyPreferences, SignOut modals
│   ├── settings/             # HelpSupportModal
│   ├── transactions/         # TransactionIcon, TransactionRow, TransactionFilters, TransactionDetailModal
│   └── wallet/               # WalletConnectModal, DisconnectConfirmModal, WalletDetailsView
├── constants/                # Breakpoints & layout metrics
├── data/                     # Centralized mockUser, mockWallet, and 24 reconciled mockTransactions
├── hooks/                    # useResponsive, useReducedMotion
├── services/
│   └── blockchain/           # Modular Web3 simulation service layer
│       ├── contractConfig.ts     # Demo contract metadata & read-only ERC-20 ABI
│       ├── simulationControl.ts  # Latency simulation & fault injection controller
│       ├── walletService.ts      # Simulated wallet connection & address state
│       ├── tokenService.ts       # Simulated balanceOf & summary reads
│       ├── transactionService.ts # Simulated transfer log queries
│       └── blockchainService.ts  # Unified facade consumed by stores/UI
├── store/                    # Zustand stores (walletStore, userStore, notificationStore, toastStore)
├── theme/                    # Warm Ivory / Deep Forest design tokens & ThemeContext
├── types/                    # TypeScript interfaces for wallet, transactions, rewards, and user
└── utils/                    # Formatting and cross-platform clipboard helpers
```

---

## Simulated Wallet & Smart Contract Architecture

### Clearly Simulated Features (Phase One)

This Phase One prototype is **100% client-side** and uses realistic demonstration data:

- **Authentication**: Demo login and form login operate locally; no backend authentication server is connected.
- **Wallet Connection**: Both *Demo Wallet* and *Browser Wallet* simulate an asynchronous connection flow (450–880 ms latency) returning a preconfigured Sepolia demo address (`0x71C7656EC7ab88b098defB751B7401B5f6d89A42` / `0x71C7...9A42`).
- **Token Balances & Logs**: `12,840.50 RWD` balance (`18,450 RWD` earned minus `5,609.50 RWD` redeemed across `24` transactions) is reconciled from centralized local mock data.
- **Smart Contract Reads**: `src/services/blockchain/contractConfig.ts` defines an illustrative ERC-20 contract address, chain ID (`11155111` — Sepolia Demo), and read-only ABI entries (`balanceOf(address)`, `decimals()`, `symbol()`, `totalSupply()`).
- **Fault Simulation**: Use the discreet **Demo Mode** pill (or *Settings → Simulation Controls*) to preview rejected wallet prompts, unavailable RPC networks, failed balance reads, and missing transaction logs.
- **Explorer & Contact**: *View on Explorer* and *Contact* submissions display explicit demonstration notices rather than linking to fake on-chain transactions or transmitting external messages.

### Introducing Real Blockchain Integration (Phase Two)

The UI and Zustand stores never access raw mock JSON directly; they consume `blockchainService` (`src/services/blockchain/blockchainService.ts`). To transition to production:

1. **Provider & Wallet Connector**: Integrate **WalletConnect / Reown AppKit** or **wagmi / viem** inside `walletService.ts` to prompt real mobile/browser wallets and obtain a live signer/account address.
2. **Contract Reads**: Replace `tokenService.getTokenBalance()` with a live `viem` `publicClient.readContract` (or `ethers.Contract`) call using the deployed `RWD` contract address and ABI.
3. **Transaction Indexing**: Replace `transactionService.getRecentTransactions()` with ERC-20 `Transfer` event indexing or an indexer API (such as Alchemy Transfers, The Graph, or a backend reward ledger service).
4. **Explorer Links**: Update `TransactionDetailModal` to open `https://sepolia.etherscan.io/tx/<txHash>` (or Mainnet explorer) once real transaction hashes are returned.
