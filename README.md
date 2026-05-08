# Shaikh & Sons | High-Performance Electronic Mobility

A luxury electric vehicle (EV) e-commerce and dealership platform built with Next.js 15, Drizzle ORM, and Tailwind CSS. The platform features a high-end, dark-themed aesthetic with complex interactive elements, stateless authentication, and a secure administration dashboard.

## 🚀 Core Technologies
- **Framework:** Next.js 15 (App Router, Turbopack)
- **Styling:** Tailwind CSS + Framer Motion (Animations)
- **UI Components:** Shadcn UI
- **Database:** PostgreSQL (via Drizzle ORM)
- **Authentication:** Stateless JWT & Email OTP (Custom implementation)
- **Validation:** Zod
- **Email:** NodeMailer (SMTP)

## 🏗 Architecture Highlights
- **Stateless Authentication:** The system uses HttpOnly cookies and JWTs for both Admins and Users. OTPs are cryptographically signed, meaning the database never has to store temporary session states or OTP codes.
- **Route Groups:** The Next.js `app` directory is organized using Route Groups (`(auth)`, `(admin)`, `(shop)`) to keep the codebase modular without affecting the public URL structure.
- **Stateless Theming:** Dark/Light mode preferences are stored locally in the browser (`localStorage`) and applied synchronously in the document `<head>` to prevent theme flashing on load.

## 🔐 Security
- **Route Protection:** A central `middleware.ts` file acts as a gatekeeper, securing `/admin` routes for administrators and `/profile` routes for authenticated users.
- **Admin Access:** Administrator credentials are not stored in the database. They are securely read directly from environment variables, protecting the system from SQL injection or database breaches.
- **Input Sanitization:** All API endpoints strictly validate incoming payloads using Zod schemas before processing.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- SMTP Server (e.g., Gmail App Passwords)

### Environment Variables (`.env.local`)
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
OTP_JWT_SECRET="your-super-secret-key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
ADMIN_EMAIL="admin@shaikhandsons.com"
ADMIN_PASSWORD="secure-admin-password"
```

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Push database schema:
   ```bash
   npx drizzle-kit push
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to view the application.