# 🤖 AI Agent Protocol: Shaikh & Sons

This document contains foundational mandates and strict engineering standards for any AI agent interacting with this codebase. **You must read this file and `CODEBASE_MAP.md` before performing any task.**

## 📑 The Golden Rule
**After every task that adds, moves, or deletes a file or folder, you MUST update `CODEBASE_MAP.md` to reflect the change. Never leave the map out of sync.**

## 🏗️ Architectural Mandates

### 1. Routing & Organization
- **Next.js 15 Route Groups:** Always use Route Groups (folders with parentheses like `(auth)`) to organize pages. Do not clutter the root `app` directory.
- **API Symmetry:** Ensure API routes in `src/app/api` follow the same grouping and naming logic as the frontend pages.

### 2. Statelessness & Security
- **No Session DB:** Never create a "sessions" table. Keep authentication purely stateless using JWTs and HttpOnly cookies.
- **Admin Access:** Never store Admin credentials in the database. Use `.env` variables only.
- **HttpOnly Cookies:** All session tokens must be stored in HttpOnly, Secure, SameSite: Lax/Strict cookies.

### 3. Logic Consolidation
- **No Raw Fetch in UI:** UI pages (`page.tsx`) must never call `fetch` directly for internal APIs. Always use or create a helper function in `src/lib/auth/auth-client.ts` or `src/lib/db/`.
- **Zod Everywhere:** Every single API route (`route.ts`) MUST validate its input body and query parameters using Zod schemas defined in `src/lib/validations.ts`.
- **Shared Types:** Do not redefine interfaces like `AuthUser` or `JWTPayload`. Use the centralized definitions in `src/types/auth.ts`.

## 🧹 Code Cleanliness & "Anti-Mess" Rules

1. **Delete Dead Wood:** If you move a file, delete the old one immediately. If a directory becomes empty, delete it.
2. **Naming Consistency:** 
   - Files: `kebab-case` for logic, `PascalCase` for React components.
   - Variables/Functions: `camelCase`.
3. **Component Specificity:** Move general components to `src/components/ui`, layout components to `src/components/layout`, and feature-specific components to their respective feature folders (e.g., `src/components/shop`).
4. **Theme Integrity:** Never hardcode "dark" or "light" styles that break the theme toggle. Use Tailwind's `dark:` modifier and CSS variables.
5. **Loader Preservation:** The `InitialLoader.tsx` is a core brand element. Do not modify its cinematic timing (4s) without explicit user permission.

## 🛠️ Tooling
- **ORM:** Drizzle ORM.
- **Database:** PostgreSQL.
- **Validation:** Zod.
- **Animations:** Framer Motion.
- **Icons:** Lucide React.
- **Storage:** Local VPS File System (using `fs` and `sharp`).

## 📁 Local VPS Storage Mandates

To ensure clean file management on the VPS, follow these protocols for all image/file operations:

### 1. Storage Responsibility
- **Saving (Upload):** `src/app/api/admin/storage/upload/route.ts`. Handles multipart form data, compresses to WebP using `sharp`, and saves to `public/uploads/`.
- **Deleting:** `src/lib/storage-node.ts`. Provides the `deleteFile(fileUrl)` utility. Always use this utility to ensure safety checks and absolute path resolution.
- **Viewing:** Handled natively by Next.js via the `public/` folder, or via the protected proxy route `src/app/api/admin/storage/view/[fileId]/route.ts`.

### 2. Synchronization Rule
When an entity (Brand, Vehicle, User) that has an associated image is **deleted** or its image is **updated**, you MUST manually trigger the deletion of the old file from the VPS using the `deleteFile` utility. Never leave "orphan" files on the VPS.

### 3. Security
- Files must be stored in `public/uploads/`.
- File names must be randomized (UUID or Hash) to prevent collision and enumeration.
- All storage-related API routes must verify `isAdminAuthenticated` or `getSession` as appropriate.
