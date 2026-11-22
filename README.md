# SalonBook — Client Application

Full-stack Next.js and TypeScript client application for **SalonBook**, a modern salon appointment booking and management platform.

## 📌 Project Overview
SalonBook is a comprehensive, role-based salon appointment booking platform where customers can explore luxury treatment rituals, check real-time availability, schedule appointments, and complete payments securely via Stripe. Salon administrators can manage treatment catalogs, review and confirm booking requests, manage registered customer access, and monitor financial transactions.

## 🚀 Important Features

### Customer Experience:
- **Bespoke Service Browsing**: Explore active salon treatments filtered by category (Haircut & Styling, Hair Coloring, Hair Treatment, Facial & Skincare, Makeup, Manicure & Pedicure, Spa & Massage).
- **Interactive Search & Sorting**: Real-time search by service name and sorting by treatment price.
- **Service Details & Ritual Exploration**: View detailed service descriptions, pricing, duration, and salon amenities.
- **Conflict-Free Appointment Scheduling**: Reserve appointment slots with automatic prevention of duplicate bookings or past dates.
- **Customer Dashboard**: Overview of personal appointment counts (Total, Pending, Confirmed, Cancelled).
- **My Appointments Management**: Review booking history, view details modal, cancel pending appointments, and track payment standing.
- **Stripe Checkout**: Seamless payment processing for confirmed salon appointments.
- **Profile Management**: Update full name, profile picture (via file upload or image URL), and phone number.

### Administrator Experience:
- **Operational Metrics Dashboard**: Real-time stats on registered customers, active services, appointment requests, pending reviews, confirmed sessions, and total captured revenue.
- **Treatment Catalog Management**: View complete catalog, add new treatments with ImgBB-hosted images, edit existing services, and toggle active/inactive status.
- **Appointment Request Review**: Filter by status (All, Pending, Confirmed, Cancelled), view customer notes, confirm pending bookings, or cancel sessions.
- **Customer Account Management**: Monitor registered accounts and suspend (block) or restore (unblock) customer platform privileges.
- **Financial Ledger**: Audit trail of verified Stripe transactions with session references and payment verification timestamps.
- **Strict Access Control**: Server-verified role protection ensuring customers cannot access admin operations and admins cannot submit customer bookings.

## 🛠️ Technology Stack
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19, Tailwind CSS v4, Lucide React, Shadcn UI
- **Authentication**: Better Auth with JWT plugin
- **State & Notifications**: Sonner Toast Notifications
- **Language**: TypeScript

## 📦 Installation Instructions

1. Navigate to the client directory:
```bash
cd salonbook-client/salonbook-client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (see `.env.example`).

4. Build the application:
```bash
npm run build
```

## ⚙️ How to Run Locally

### Start Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Production Build:
```bash
npm run build
npm start
```

### Type Checking & Linting:
```bash
npm run typecheck
npm run lint
```

## 🔐 Required Environment Variables
Configure the following in your `.env` file (never commit secrets to Git):
- `BETTER_AUTH_SECRET` — Secret key for signing Better Auth sessions and JWT tokens
- `BETTER_AUTH_URL` — Base URL of the client application (e.g., `http://localhost:3000`)
- `MONGODB_URL` — MongoDB connection URI
- `NEXT_PUBLIC_API_URL` — Backend server origin (e.g., `http://localhost:5000`)
- `NEXT_PUBLIC_API_BASE_URL` — Full REST API base path (e.g., `http://localhost:5000/api/v1`)
- `GOOGLE_CLIENT_ID` — (Optional) Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` — (Optional) Google OAuth Client Secret

## 🔗 Repository & Live Links
- **Client Repository**: https://github.com/abirhosen30/salonbook-client
- **Server Repository**: https://github.com/abirhosen30/salonbook-server
- **Live Website**: https://salonbook-client.vercel.app (or custom deployment domain)
