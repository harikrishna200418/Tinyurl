# TinyLink

This is the TinyLink take-home project (Next.js + Prisma). It implements URL shortening, redirects, and click stats.

Quick local setup

1. Install dependencies

```powershell
npm install
```

2. Create `.env` (see `.env.example`) — for local dev you can use SQLite:

```properties
DATABASE_URL="file:./dev.db"
BASE_URL="http://localhost:3000"
```

3. Run dev server

```powershell
npm run dev
```

Deploy to Vercel

Option A — GitHub integration (recommended):

1. Push your repo to GitHub (already done).
2. Go to https://vercel.com/new and import the GitHub repo `harikrishna200418/Tinyurl`.
3. In the Vercel project settings, add these Environment Variables (Production / Preview / Development):
   - `DATABASE_URL` → your Postgres URL (Neon, Supabase, Heroku, etc.)
   - `BASE_URL` → `https://<your-vercel-domain>`

Vercel will run `npm install` and `npm run build` (we added `prisma generate` to the build script so Prisma client is generated during build).

Option B — Vercel CLI

```powershell
npm i -g vercel
vercel login
vercel --prod
```

Notes:
- Use a hosted Postgres for production (Neon/Postgres is free and works well with Vercel). Update `DATABASE_URL` accordingly in Vercel environment variables.
- The app uses Prisma; we run `prisma generate` during build. If you change the Prisma schema, run `npx prisma db push` locally and commit migrations as needed.
