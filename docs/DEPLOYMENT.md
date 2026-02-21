# CyberWraith — Deployment Guide

## Recommended Stack

| Service | Purpose | Cost |
|---|---|---|
| Vercel | Next.js hosting | Free / Pro |
| Supabase | PostgreSQL database | Free / Pro |
| Stripe | Payments | Pay per transaction |
| Resend or Gmail | Transactional email | Free tier available |

---

## Step 1 — Prepare Your Repository

Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "ready for deployment"
git push origin main
```

Ensure `.env.local` is in `.gitignore` and never committed.

---

## Step 2 — Set Up Supabase (Production Database)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region closest to your users
3. Go to Settings → Database → Connection String
4. Copy the URI connection string — it looks like:
```
   postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```
5. Save this as your production `DATABASE_URL`

---

## Step 3 — Deploy to Vercel

### Option A — Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Import your `cyberwraith` repository
4. Set the framework to **Next.js** (auto-detected)
5. Add all environment variables from `.env.example`:

   Click **Environment Variables** and add each one:
```
   NEXT_PUBLIC_APP_URL         https://cyberwraith.app
   NEXTAUTH_URL                https://cyberwraith.app
   NEXTAUTH_SECRET             your-production-secret
   DATABASE_URL                your-supabase-connection-string
   GOOGLE_CLIENT_ID            your-google-client-id
   GOOGLE_CLIENT_SECRET        your-google-client-secret
   GITHUB_CLIENT_ID            your-github-client-id
   GITHUB_CLIENT_SECRET        your-github-client-secret
   STRIPE_SECRET_KEY           sk_live_...
   STRIPE_WEBHOOK_SECRET       whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  pk_live_...
   STRIPE_PRICE_FREELANCER     price_...
   STRIPE_PRICE_PRO            price_...
   STRIPE_PRICE_AGENCY         price_...
   EMAIL_SERVER_HOST           smtp.gmail.com
   EMAIL_SERVER_PORT           587
   EMAIL_SERVER_USER           your@gmail.com
   EMAIL_SERVER_PASSWORD       your-app-password
   EMAIL_FROM                  noreply@cyberwraith.app
```

6. Click **Deploy**

### Option B — Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Step 4 — Run Database Migrations on Production

After deploying, push your Prisma schema to the production database:
```bash
DATABASE_URL="your-production-url" npx prisma db push
```

Then seed it:
```bash
DATABASE_URL="your-production-url" npm run db:seed
```

> Only run the seed once. Running it again is safe
> because it uses `upsert` — but change the default
> admin password immediately after first login.

---

## Step 5 — Update OAuth Redirect URIs

### Google

1. Go back to Google Cloud Console → OAuth 2.0 Credentials
2. Add your production redirect URI:
```
   https://cyberwraith.app/api/auth/callback/google
```

### GitHub

1. Go to GitHub → Settings → Developer Settings → OAuth Apps
2. Update the Authorization callback URL:
```
   https://cyberwraith.app/api/auth/callback/github
```

---

## Step 6 — Set Up Stripe Production Webhook

1. Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add Endpoint**
3. Set the endpoint URL:
```
   https://cyberwraith.app/api/stripe/webhook
```
4. Select these events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the Signing Secret (`whsec_...`)
6. Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables
7. Redeploy for the change to take effect:
```bash
   vercel --prod
```

---

## Step 7 — Add Custom Domain

1. In Vercel dashboard go to your project → Settings → Domains
2. Add your domain: `cyberwraith.app`
3. Vercel provides the DNS records to add — add them in your
   domain registrar (Namecheap, Cloudflare, GoDaddy, etc.)
4. SSL is provisioned automatically

---

## Step 8 — Post-Deployment Checklist

- [ ] Homepage loads on production URL
- [ ] Login and signup work with real credentials
- [ ] Google OAuth works on production domain
- [ ] GitHub OAuth works on production domain
- [ ] Stripe test checkout completes and updates user tier
- [ ] Stripe production mode enabled in dashboard
- [ ] Webhook receives events and updates subscriptions in DB
- [ ] Admin panel accessible at `/admin`
- [ ] Contact form saves submissions to DB
- [ ] Default admin password changed
- [ ] `NEXT_PUBLIC_APP_URL` set to production URL

---

## Redeployment

Every push to `main` triggers an automatic redeploy on Vercel.

To manually redeploy:
```bash
vercel --prod
```

Or trigger from the Vercel dashboard under
Deployments → Redeploy.

---

## Monitoring

Vercel provides built-in:

- Function logs (Vercel Dashboard → Functions)
- Real-time error tracking
- Analytics (Vercel Analytics — enable in project settings)

For database monitoring use Supabase Dashboard →
Table Editor and Logs.

---

## Rollback

To roll back to a previous deployment:

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click the three-dot menu → **Promote to Production**