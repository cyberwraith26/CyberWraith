# CyberWraith — Local Development Setup

## Prerequisites

Make sure you have the following installed before starting:

- Node.js 18.17 or higher
- npm 9 or higher
- Git
- PostgreSQL 14 or higher (local or cloud via Supabase / Railway)
- A Stripe account (free to create)
- A Google Cloud project (for OAuth)
- A GitHub OAuth App (for OAuth)

---

## Step 1 — Clone the Repository
```bash
git clone https://github.com/your-username/cyberwraith.git
cd cyberwraith
```

---

## Step 2 — Install Dependencies
```bash
npm install
```

---

## Step 3 — Environment Variables

Copy the example env file and fill in your values:
```bash
cp .env.example .env.local
```

Open `.env.local` and fill in every value:
```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CyberWraith

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cyberwraith"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_FREELANCER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_AGENCY=price_...

# Email
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@cyberwraith.app
```

### Generating NEXTAUTH_SECRET

Run this in your terminal and paste the output:
```bash
openssl rand -base64 32
```

---

## Step 4 — Database Setup

### Option A — Local PostgreSQL

Create the database:
```bash
psql -U postgres -c "CREATE DATABASE cyberwraith;"
```

Push the Prisma schema:
```bash
npx prisma db push
```

### Option B — Supabase (Recommended for Cloud)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the connection string from Settings → Database
3. Paste it as your `DATABASE_URL` in `.env.local`
4. Run:
```bash
npx prisma db push
```

### Option C — Railway

1. Go to [railway.app](https://railway.app) and create a PostgreSQL service
2. Copy the connection string from the Variables tab
3. Paste it as your `DATABASE_URL` in `.env.local`
4. Run:
```bash
npx prisma db push
```

---

## Step 5 — Seed the Database

Populate the database with tools, an admin user, and a test user:
```bash
npm run db:seed
```

This creates:

| Account | Email | Password | Role | Tier |
|---|---|---|---|---|
| Admin | admin@cyberwraith.app | Admin@12345 | admin | agency |
| Test User | test@cyberwraith.app | Test@12345 | user | pro |

> Change these passwords immediately in production.

---

## Step 6 — Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to APIs & Services → Credentials
4. Click Create Credentials → OAuth 2.0 Client ID
5. Set Application Type to **Web Application**
6. Add Authorized Redirect URI:
```
   http://localhost:3000/api/auth/callback/google
```
7. Copy the Client ID and Secret into `.env.local`

---

## Step 7 — GitHub OAuth Setup

1. Go to GitHub → Settings → Developer Settings → OAuth Apps
2. Click New OAuth App
3. Fill in:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL:
```
     http://localhost:3000/api/auth/callback/github
```
4. Copy the Client ID and Secret into `.env.local`

---

## Step 8 — Stripe Setup

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create three subscription products:
   - **Freelancer** — $19/month
   - **Pro** — $49/month
   - **Agency** — $129/month
3. Copy each Price ID (starts with `price_`) into `.env.local`
4. Copy your Secret Key (`sk_test_...`) and Publishable Key (`pk_test_...`)

### Stripe Webhook (Local Testing)

Install the Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows / Linux
# Download from https://stripe.com/docs/stripe-cli
```

Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret (`whsec_...`) shown in the terminal
into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## Step 9 — Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Step 10 — Verify Everything Works

Go through this checklist:

- [ ] Homepage loads at `localhost:3000`
- [ ] Signup at `/signup` creates a new user
- [ ] Login at `/login` works with credentials
- [ ] Google OAuth redirects and logs in correctly
- [ ] GitHub OAuth redirects and logs in correctly
- [ ] Dashboard loads at `/dashboard`
- [ ] Tools list shows at `/dashboard/tools`
- [ ] FollowStack opens at `/dashboard/tools/followstack`
- [ ] Billing page shows at `/dashboard/settings/billing`
- [ ] Stripe checkout opens when clicking upgrade
- [ ] Admin panel loads at `/admin` when logged in as admin
- [ ] Contact form submits without errors

---

## Useful Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma db push` | Push schema changes to DB |
| `npx prisma studio` | Open Prisma DB GUI |
| `npm run db:seed` | Seed database with tools and users |
| `stripe listen --forward-to localhost:3000/api/stripe/webhook` | Forward Stripe webhooks locally |

---

## Common Issues

### "Cannot find module @prisma/client"
```bash
npx prisma generate
```

### "PrismaClientInitializationError"

Your `DATABASE_URL` is incorrect or the database is not running.
Check your connection string and make sure PostgreSQL is running.

### "OAuthSignin" error on login

Your OAuth redirect URI does not match exactly.
Double-check the callback URLs in Google Console and GitHub OAuth settings.

### Stripe webhook "No signatures found"

Make sure you are running `stripe listen` in a separate terminal
and have pasted the correct `whsec_...` value into `.env.local`.