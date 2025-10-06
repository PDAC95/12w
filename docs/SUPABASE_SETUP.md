# Supabase Setup Guide - Wallai

## Overview

This guide walks you through setting up the Supabase project for Wallai. Supabase provides our Backend-as-a-Service (BaaS) with authentication, database, storage, and realtime features.

**Estimated Time:** 30-45 minutes
**Prerequisites:** None (free Supabase account will be created)

---

## Step 1: Create Supabase Account

1. Navigate to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub (recommended) or email
4. Verify your email if using email signup

---

## Step 2: Create New Project

1. Click "New Project" in your Supabase dashboard
2. Fill in project details:

   ```
   Organization: Create new or select existing
   Project Name: wallai-prod
   Database Password: Generate a strong password (SAVE THIS!)
   Region: Choose closest to your users (e.g., US East, EU West)
   Pricing Plan: Free (for development)
   ```

3. Click "Create new project"
4. Wait 2-3 minutes for project provisioning

---

## Step 3: Configure Authentication

### Enable Email/Password Auth

1. Go to **Authentication** → **Providers** in left sidebar
2. Find "Email" provider
3. Enable it (should be enabled by default)
4. Configure settings:
   ```
   ✅ Enable email confirmations
   ✅ Enable email change confirmations
   ✅ Secure email change enabled
   Confirmation URL: https://your-app-url.com/auth/confirm
   ```

### Enable OAuth Providers

#### Google OAuth

1. Still in **Authentication** → **Providers**
2. Find "Google" and click to expand
3. Enable Google provider
4. You'll need to create Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project "Wallai"
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

#### Apple OAuth (Optional for MVP)

1. Find "Apple" provider
2. Enable it
3. Configure with Apple Developer account credentials
4. Add redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

---

## Step 4: Get API Keys

1. Go to **Settings** → **API** in left sidebar
2. You'll see three important keys:

   ```bash
   # Project URL
   URL: https://xxxxxxxxxxxxx.supabase.co

   # anon/public key (safe for frontend)
   anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # service_role key (NEVER expose to frontend!)
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Copy these to your `.env` file:

   ```bash
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## Step 5: Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize these templates:

### Confirm Signup Email

```html
<h2>Welcome to Wallai!</h2>
<p>Click the link below to confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>If you didn't sign up for Wallai, you can safely ignore this email.</p>
```

### Magic Link Email

```html
<h2>Sign in to Wallai</h2>
<p>Click the link below to sign in:</p>
<p><a href="{{ .ConfirmationURL }}">Sign in to Wallai</a></p>
<p>This link expires in 1 hour.</p>
```

### Reset Password Email

```html
<h2>Reset your Wallai password</h2>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
<p>If you didn't request a password reset, you can safely ignore this email.</p>
```

### Change Email Address

```html
<h2>Confirm email change</h2>
<p>Click the link below to confirm your new email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm email change</a></p>
<p>If you didn't request this change, please contact support immediately.</p>
```

---

## Step 6: Enable Realtime

1. Go to **Database** → **Replication** in left sidebar
2. Enable Realtime for these tables (will be created in US-004):
   ```
   ✅ spaces
   ✅ space_members
   ✅ budgets
   ✅ budget_items
   ✅ expenses
   ✅ expense_splits
   ```
3. Click "Save" after enabling each table

---

## Step 7: Configure Storage Buckets

1. Go to **Storage** in left sidebar
2. Create new bucket for receipts:

   ```
   Name: receipts
   Public: No (private)
   File size limit: 10 MB
   Allowed MIME types: image/jpeg, image/png, application/pdf
   ```

3. Create bucket for avatars:
   ```
   Name: avatars
   Public: Yes (public)
   File size limit: 2 MB
   Allowed MIME types: image/jpeg, image/png
   ```

---

## Step 8: Set Up Database Connection

1. Go to **Settings** → **Database**
2. Copy the connection string:

   ```
   URI: postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```

3. Add to `.env`:
   ```bash
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```

---

## Step 9: Configure RLS Policies (After Schema Creation)

After creating the database schema in US-004, you'll need to enable Row Level Security:

1. Go to **Authentication** → **Policies**
2. Enable RLS on all tables
3. Create policies (detailed in `database/security/rls_policies.sql`)

**Important:** RLS policies will be applied automatically via SQL scripts in US-004 (see `database/security/rls_policies.sql`).

---

## Step 10: Test Authentication

### Test with Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Create test user:
   ```
   Email: dev@jappi.ca
   Password: Password123
   Auto Confirm: Yes (for testing)
   ```
4. User should appear in the users list

### Test with Email

1. Disable "Auto Confirm" in **Authentication** → **Providers** → **Email**
2. Try signing up through your app
3. Check your email for confirmation link
4. Verify email confirmation works

---

## Step 11: Environment Variables Summary

Copy these values to your `.env` file:

```bash
# From Settings → API
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...

# From Settings → Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Frontend (Vite)
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Mobile (Expo)
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## Verification Checklist

Before proceeding to US-002 and US-003:

- [ ] Supabase project created and accessible
- [ ] Email/password authentication enabled
- [ ] Google OAuth configured (optional: Apple)
- [ ] Email templates customized
- [ ] API keys copied to `.env`
- [ ] Database connection string in `.env`
- [ ] Storage buckets created (receipts, avatars)
- [ ] Test user created and can sign in
- [ ] All environment variables documented in `.env.example`

---

## Troubleshooting

### Issue: Email confirmations not working

**Solution:**

1. Check **Authentication** → **Providers** → **Email** settings
2. Ensure "Enable email confirmations" is checked
3. Verify Site URL in **Authentication** → **URL Configuration**
4. For local development, add `http://localhost:3000` to allowed redirect URLs

### Issue: OAuth not working

**Solution:**

1. Verify OAuth credentials in provider dashboard (Google/Apple)
2. Check redirect URI matches exactly: `https://[YOUR-REF].supabase.co/auth/v1/callback`
3. Ensure OAuth consent screen is configured
4. Check browser console for errors

### Issue: Can't connect to database

**Solution:**

1. Verify password is correct (check when you created project)
2. Ensure connection string uses correct project reference
3. Try resetting database password in **Settings** → **Database**
4. Check if IPv6 is enabled (Supabase requires it)

### Issue: Storage uploads failing

**Solution:**

1. Check bucket permissions in **Storage**
2. Verify file size is under limit
3. Check MIME type is allowed
4. Ensure RLS policies on `storage.objects` table

---

## Next Steps

After completing this setup:

1. ✅ US-001 is complete
2. ➡️ Proceed to **US-002**: Frontend React setup
3. ➡️ Then **US-003**: Backend FastAPI setup
4. ➡️ Then **US-004**: Database schema creation with RLS policies

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

**Document Status:**

- Created: 2025-10-06
- Updated: 2025-10-06
- Version: 1.0
- Related: US-001, PLANNING.md, .env.example
