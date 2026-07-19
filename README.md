# CHEEZO - Premium Fresh Halal Chicken Online Delivery Store

Welcome to the official source code for **CHEEZO**, a highly optimized, responsive full-stack e-commerce web application designed for premium fresh halal chicken delivery. CHEEZO integrates a fast customer storefront, a secure administrative dashboard, real-time database replication, local fallback states, and instant direct-to-WhatsApp checkout.

---

## 🚀 Key Features

### 🛒 Customer Storefront
- **Visual Branding & Splash Screen**: An immersive, premium onboarding flow modeled after top food delivery services (Licious, Blinkit, Swiggy) featuring a soft gradient and the official **CHEEZO** brand logo.
- **Dynamic Catalog**: Browse fresh categories (Curry Cut, Boneless, Drumsticks, Wings, Eggs, and Marinated specialities) with live price calculations and customizable cut options.
- **Delivery Zone Validation**: Integrated pincode/delivery area selection with automatic delivery charges calculation and free delivery thresholds.
- **Smart Cart & Coupons**: Seamless coupon application (e.g., `CHEEZO50`), real-time cart recalculations, and delivery charge logic.
- **Direct-to-WhatsApp Checkout**: Completely functional "Place Order" workflow that instantly compiles the cart details, total pricing, customer delivery address, and coupon data into a beautifully formatted text template, opening a chat window directly with the registered business number.

### 💼 Admin Dashboard
- **Store Analytics**: Key metrics (gross sales, total orders, active customers, coupon usage) with elegant data visualization.
- **Products & Categories Manager**: Real-time CRUD (Create, Read, Update, Delete) for items, pricing, inventory, weights, and descriptions.
- **Coupon Code Engine**: Easily issue, edit, or disable percentage-based or flat discount coupon codes.
- **Delivery Configuration**: Set delivery fees, minimum orders, estimated delivery times, and schedule-enabled slots.
- **Business Identity Controls**: Edit the business WhatsApp number and brand asset paths dynamically from the dashboard.
- **Supabase Cloud Sync**: One-click transition from localized browser localStorage sandbox to a durable cloud PostgreSQL database featuring PostgreSQL Realtime Replication.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [React 18+](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling & Theme**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (`motion/react`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database Fallback (Sandbox)**: Browser `localStorage`
- **Cloud Database (Durable Sync)**: [Supabase](https://supabase.com/) (PostgreSQL & Realtime Client)

---

## 📂 Project Structure

```text
├── .env.example            # Environment configurations template
├── index.html              # HTML Entry Point & Browser Favicon
├── package.json            # Project dependencies and operational scripts
├── README.md               # Setup and architecture documentation
├── src/
│   ├── main.tsx            # Main application entry
│   ├── index.css           # Global stylesheets & Tailwind imports
│   ├── App.tsx             # Primary router, splash screen & layout router
│   ├── data.ts             # Default configurations and static catalog
│   ├── types.ts            # Global TypeScript interface definitions
│   ├── components/         # Modular user interface components
│   │   ├── CheezoLogo.tsx  # Dynamic brand rendering component
│   │   ├── AdminPanel.tsx  # High-fidelity dashboard controller
│   │   ├── CartSheet.tsx   # Slid-out checkout and order formulation
│   │   ├── Header.tsx      # Customer navigation and location bar
│   │   ├── Footer.tsx      # Interactive contact, admin gate, and information
│   │   └── ...             # Carousel, sliders, modals, and reviews
│   ├── context/
│   │   ├── AppContext.tsx  # Business logic provider & Supabase driver
│   │   └── LanguageContext.tsx # Localization and translation engine
│   └── lib/
│       └── supabase.ts     # Supabase client instantiation & DB queries
```

---

## 🚦 Getting Started

### 1. Prerequisites
Ensure you have the following installed locally:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [bun](https://bun.sh/)

### 2. Installation
Clone your workspace project, navigate into the directory, and install dependencies:
```bash
npm install
```

### 3. Run the Development Server
Launch the live local reload development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build for Production
To bundle a production-ready build:
```bash
npm run build
```
This produces a highly compressed `dist/` folder containing static assets optimized for standard server delivery or static CDN hosts.

---

## ☁️ Cloud Supabase Integration (Optional)

By default, CHEEZO runs in fully functional **Local Sandbox Mode** (saving your products, categories, coupons, and orders directly to your local browser storage).

To hook CHEEZO up to a live cloud Postgres database:

### 1. Execute Schema Script
Create a new Supabase project, navigate to the **SQL Editor**, paste the SQL queries supplied in the **Admin Dashboard (Supabase Sync tab)**, and execute them. This provisions:
- `products`, `categories`, `coupons`, `orders`, `delivery_areas`, `delivery_settings` tables.
- Sets up public access policies and registers the tables into the Postgres Realtime publication channel.

### 2. Add Environment Variables
Create a `.env` file in the root directory (based on `.env.example`) and supply your Supabase credentials:
```env
VITE_SUPABASE_URL="https://your-project-reference.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-api-key"
```
Once added, restart your development server, and your store will dynamically switch to real-time cloud sync!

---

## 📞 WhatsApp Order Configuration

- **Default Order Number**: All customer orders are routed directly via web-link templates to the permanent phone number `+91 87667 17483`.
- **Dynamic Configuration**: To change this target phone number at any time without touching the code, log in to the **Admin Dashboard**, click on the **Delivery Settings** tab, update the **Business WhatsApp Order Number** input field, and save changes.
