# 🗺️ Codebase Map: Shaikh & Sons

An in-depth, 100% comprehensive ASCII tree map of the entire project structure. Every file and subfolder is documented with its purpose.

```text
Root/
├── .idx/
│   └── dev.nix                        # Configuration for Google IDX cloud development environment
├── docs/
│   └── blueprint.md                   # Original project specifications, requirements, and design docs
├── public/
│   ├── favicon.svg                    # The site's favicon icon
│   └── fonts/                         # Custom local typography files
│       ├── IBMPlexSans-SemiBold.ttf   # Used for secondary headers/text
│       ├── playfair-display.bold.ttf  # Used for luxury brand headings (font-headline)
│       └── space-mono.bold.ttf        # Used for technical specs and data (font-code)
├── src/                               # 🌟 CORE APPLICATION SOURCE CODE 🌟
│   ├── ai/                            # AI Integration (Firebase Genkit)
│   │   ├── dev.ts                     # Setup for Genkit AI local development server
│   │   └── genkit.ts                  # Genkit AI initialization, models, and config
│   │
│   ├── app/                           # Next.js App Router (Pages & API)
│   │   │
│   │   ├── (admin)/                   # 🛡️ Admin Restricted Route Group
│   │   │   └── admin/                 # Base path: /admin
│   │   │       ├── brands/            # Base path: /admin/brands
│   │   │       │   └── page.tsx       # Corporate Manufacturer Directory & Assets
│   │   │       ├── inventory/         # Base path: /admin/inventory
│   │   │       │   └── page.tsx       # Fleet catalog management and asset actions
│   │   │       ├── likes/             # Base path: /admin/likes
│   │   │       │   └── page.tsx       # Customer engagement analytics and like logs
│   │   │       ├── login/             # Base path: /admin/login
│   │   │       │   └── page.tsx       # Stateless admin secure login interface
│   │   │       ├── orders/            # Base path: /admin/orders
│   │   │       │   └── page.tsx       # UI for tracking customer reservations (WIP)
│   │   │       ├── users/             # Base path: /admin/users
│   │   │       │   └── page.tsx       # UI for viewing the registered client list
│   │   │       ├── layout.tsx         # Sidebar, Header, and Theme wrapper for all admin pages
│   │   │       └── page.tsx           # The main admin dashboard analytics overview
│   │   │
│   │   ├── (auth)/                    # 🔐 Authentication Route Group (No URL prefix)
│   │   │   ├── forgot-password/       # Base path: /forgot-password
│   │   │   │   └── page.tsx           # Multi-step UI for requesting and verifying password resets
│   │   │   ├── login/                 # Base path: /login
│   │   │   │   └── page.tsx           # User sign-in UI (Triggers OTP email on success)
│   │   │   ├── signup/                # Base path: /signup
│   │   │   │   └── page.tsx           # New account registration UI
│   │   │   └── verify-otp/            # Base path: /verify-otp
│   │   │       └── page.tsx           # 6-digit 2FA code verification UI to create session
│   │   │
│   │   ├── (info)/                    # ℹ️ Static & Legal Route Group
│   │   │   ├── about/                 # Base path: /about
│   │   │   │   └── page.tsx           # Company history, mission, and vision
│   │   │   ├── contact/               # Base path: /contact
│   │   │   │   └── page.tsx           # Customer support form (Sends emails via NodeMailer)
│   │   │   ├── privacy/               # Base path: /privacy
│   │   │   │   └── page.tsx           # Privacy policy documentation
│   │   │   └── terms/                 # Base path: /terms
│   │   │       └── page.tsx           # Terms of service documentation
│   │   │
│   │   ├── (shop)/                    # 🛍️ Core Feature Route Group
│   │   │   └── vehicles/              # Base path: /vehicles
│   │   │       └── [id]/              # Base path: /vehicles/[id] (Dynamic)
│   │   │           └── page.tsx       # Deep dive vehicle details, specs, and reservation UI
│   │   │
│   │   ├── (user)/                    # 👤 User Restricted Route Group
│   │   │   └── profile/               # Base path: /profile
│   │   │       └── page.tsx           # UI for users to update phone, address, and view details
│   │   │
│   │   ├── api/                       # ⚙️ Next.js Backend Endpoints
│   │   │   ├── (info)/
│   │   │   │   └── contact/           # Endpoint: /api/contact
│   │   │   │       └── route.ts       # Parses contact form and dispatches SMTP email
│   │   │   ├── (shop)/
│   │   │   │   └── vehicles/          # Endpoint: /api/vehicles
│   │   │   │       ├── [slug]/
│   │   │   │       │   └── like/route.ts # Endpoint: /api/vehicles/[slug]/like (GET/POST)
│   │   │   │       └── route.ts       # Public endpoint to fetch vehicle catalog data
│   │   │   ├── admin/                 # 🛡️ Protected Admin Endpoints
│   │   │   │   ├── auth/              # Endpoint: /api/admin/auth
│   │   │   │   │   └── route.ts       # Validates ENV credentials and sets admin-token cookie
│   │   │   │   ├── brands/            # Endpoint: /api/admin/brands
│   │   │   │   │   └── route.ts       # CRUD operations for vehicle brands in Postgres
│   │   │   │   ├── dashboard/         # Endpoint: /api/admin/dashboard/stats
│   │   │   │   │   └── stats/route.ts # Aggregates analytics (total users, vehicles) for dashboard
│   │   │   │   ├── inventory/         # Endpoint: /api/admin/inventory
│   │   │   │   │   ├── bulk-update/route.ts # Batch updates multiple vehicles at once
│   │   │   │   │   └── route.ts       # CRUD operations for specific vehicles
│   │   │   │   ├── logout/            # Endpoint: /api/admin/logout
│   │   │   │   │   └── route.ts       # Clears the HttpOnly admin session cookie
│   │   │   │   ├── storage/           # Endpoint: /api/admin/storage
│   │   │   │   │   ├── upload/route.ts# Handles file uploads (images) to Vercel Blob
│   │   │   │   │   └── view/[fileId]/route.ts # Retrieves uploaded files via ID
│   │   │   │   └── users/             # Endpoint: /api/admin/users
│   │   │   │       └── route.ts       # Fetches the list of all registered clients
│   │   │   └── auth/                  # 🔐 Public Authentication Endpoints
│   │   │       ├── create-user/       # Endpoint: /api/auth/create-user
│   │   │       │   └── route.ts       # Validates with Zod, hashes password, inserts into DB
│   │   │       ├── forgot-password/   # Endpoint: /api/auth/forgot-password
│   │   │       │   └── route.ts       # Sends OTP email for password resets
│   │   │       ├── login/             # Endpoint: /api/auth/login
│   │   │       │   └── route.ts       # Sets the auth-token cookie after successful OTP
│   │   │       ├── logout/            # Endpoint: /api/auth/logout
│   │   │       │   └── route.ts       # Clears the HttpOnly user session cookie
│   │   │       ├── me/                # Endpoint: /api/auth/me
│   │   │       │   └── route.ts       # Decodes JWT and returns current authenticated user data
│   │   │       ├── reset-password/    # Endpoint: /api/auth/reset-password
│   │   │       │   └── route.ts       # Validates OTP, hashes new password, updates DB
│   │   │       ├── send-otp/          # Endpoint: /api/auth/send-otp
│   │   │       │   └── route.ts       # Generates 6-digit code, signs JWT, sends Gmail SMTP
│   │   │       ├── update-profile/    # Endpoint: /api/auth/update-profile
│   │   │       │   └── route.ts       # Updates user phone/address in Postgres
│   │   │       ├── validate-credentials/ # Endpoint: /api/auth/validate-credentials
│   │   │       │   └── route.ts       # Checks email and compares bcrypt password hash
│   │   │       └── verify-otp/        # Endpoint: /api/auth/verify-otp
│   │   │           └── route.ts       # Validates submitted OTP against the signed JWT
│   │   │
│   │   ├── globals.css                # Global Tailwind styles, CSS variables, and base layers
│   │   ├── layout.tsx                 # Root HTML wrapper, blocking theme script, global providers
│   │   └── page.tsx                   # Primary marketing landing page (Hero + Catalog overview)
│   │
│   ├── components/                    # 🧩 React UI Component Library
│   │   ├── admin/                     # Admin-specific components
│   │   │   ├── inventory/             # Admin inventory management components
│   │   │   │   └── brand-management.tsx # Brand management component with modal add functionality
│   │   │   ├── AdminHeader.tsx        # Admin top nav, logout dropdown, theme toggle
│   │   │   ├── AdminNavbar.tsx        # Mobile-specific navigation for admin
│   │   │   └── AdminSidebar.tsx       # Desktop side navigation menu for admin
│   │   ├── common/                    # Globally shared components
│   │   │   ├── AnnouncementBar.tsx    # Top marketing text banner (e.g. "Pre-orders open")
│   │   │   ├── BrandIdentity.tsx      # Reusable Shaikh & Sons stylized logo component
│   │   │   ├── CookieConsent.tsx      # GDPR compliant cookie tracking consent banner
│   │   │   └── InitialLoader.tsx      # Cinematic electric startup animation that plays on first load
│   │   ├── home/                      # Homepage specific sections
│   │   │   └── HeroSection.tsx        # Dynamic Framer Motion image slider for the landing page
├── layout/                    # Global layout structures
│   │   │   ├── ActionDock.tsx         # Floating action menu (WhatsApp, Back) with lightbox awareness
│   │   │   ├── Navbar.tsx             # Main user navigation, mobile dock, theme toggle, profile menu
│   │   │   ├── PageWrapper.tsx        # Framer Motion wrapper for smooth page transitions
│   │   │   └── SiteFooter.tsx         # Main user-facing footer with links and newsletter

│   │   ├── shop/                      # Catalog and store components
│   │   │   ├── VehicleCard.tsx        # Individual vehicle display card for grids
│   │   │   └── VehicleShowroom.tsx    # Interactive vehicle catalog with category filters
│   │   └── ui/                        # Shadcn UI primitives (auto-generated, headless UI)
│   │       ├── accordion.tsx, alert-dialog.tsx, alert.tsx, avatar.tsx, badge.tsx...
│   │       ├── button.tsx, calendar.tsx, card.tsx, carousel.tsx, chart.tsx...
│   │       ├── checkbox.tsx, collapsible.tsx, dialog.tsx, dropdown-menu.tsx, form.tsx...
│   │       ├── input.tsx, label.tsx, menubar.tsx, popover.tsx, progress.tsx, radio-group.tsx...
│   │       ├── scroll-area.tsx, select.tsx, separator.tsx, sheet.tsx, sidebar.tsx...
│   │       └── skeleton.tsx, slider.tsx, switch.tsx, table.tsx, tabs.tsx, textarea.tsx...
│   │       └── toast.tsx, toaster.tsx, tooltip.tsx, Typewriter.tsx
│   │
│   ├── context/                       # 🧠 React State Management
│   │   ├── AdminAuthContext.tsx       # Global context for Admin session state
│   │   └── AuthContext.tsx            # Global context for User session state
│   │
│   ├── hooks/                         # 🪝 Custom React Hooks
│   │   ├── use-mobile.tsx             # Utility to detect if viewport is mobile width
│   │   └── use-toast.ts               # Hook to trigger UI toast notifications
│   │
│   ├── lib/                           # 🛠️ Core Business Logic & Utilities
│   │   ├── auth/                      # Identity Logic
│   │   │   ├── auth-client.ts         # Centralized client-side fetch wrappers for all Auth APIs
│   │   │   ├── email-templates.ts     # HTML designs/templates for NodeMailer emails
│   │   │   ├── otp.ts                 # Server-side HMAC-SHA256 OTP generation and JWT signing
│   │   │   └── session.ts             # Iron Session configuration and utility functions
│   │   ├── db/                        # Database Services & Queries
│   │   │   ├── admin-auth.ts          # Server-side validation for ENV admin credentials
│   │   │   ├── auth.ts                # Server-side PostgreSQL queries (Drizzle) for users
│   │   │   ├── check-db.ts            # CLI Utility script to verify Postgres connection
│   │   │   ├── dashboard.ts           # Server-side queries to aggregate dashboard stats
│   │   │   ├── index.ts               # Drizzle ORM initialization and Postgres connection pool
│   │   │   ├── inventory.ts           # Server-side queries for managing vehicles/brands
│   │   │   ├── likes.ts               # Server-side queries for vehicle likes and user favoriting
│   │   │   ├── migrate.ts             # CLI Utility script to run Drizzle schema migrations
│   │   │   └── schema.ts              # Drizzle ORM schemas: `users`, `brands`, `vehicles` tables
│   │   ├── inventory-client.ts        # Client-side fetch wrappers for Admin inventory APIs
│   │   ├── storage-node.ts            # Node.js file system utilities (file deletion)
│   │   ├── utils.ts                   # Global helpers (e.g. `cn` for merging Tailwind classes)
│   │   └── validations.ts             # Zod schemas for API payload validation and type safety
│   │
│   ├── types/                         # 📝 TypeScript Definitions
│   │   └── auth.ts                    # Shared interfaces (AuthUser, AdminUser, JWTPayload)
│   │
│   ├── global.d.ts                    # Global TypeScript ambient declarations
│   └── middleware.ts                  # 🛡️ Next.js Edge Middleware (Route guards & redirects)
│
├── .env.local                         # Environment variables (DB URL, Secrets, SMTP) - NOT COMMITTED
├── apphosting.yaml                    # Firebase App Hosting deployment configuration
├── components.json                    # Shadcn UI configuration file
├── drizzle.config.ts                  # Drizzle Kit configuration for generating SQL migrations
├── next.config.ts                     # Next.js build, image domains, and runtime configuration
├── package-lock.json                  # Exact dependency tree lockfile
├── package.json                       # NPM dependencies, project scripts, and metadata
├── postcss.config.mjs                 # PostCSS configuration required by Tailwind CSS
├── tailwind.config.ts                 # Tailwind CSS theme, custom colors, fonts, and plugins
├── tsconfig.json                      # TypeScript compiler configuration
├── devops.md                          # DevOps, CI/CD, and deployment documentation
```
