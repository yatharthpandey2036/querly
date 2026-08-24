# 🦫 Querly

A **Duolingo-style app that teaches SQL, databases and AI to students in class 9–12** through games, puzzles and quizzes. Real queries run in the browser against a live SQLite engine; a light Neon-backed backend stores users, progress and streaks.

- **Basic → medium** content only, delivered as puzzles (build-the-query, fix-the-bug, predict-the-output, free query, quizzes).
- **Bit**, an AI tutor, gives hints (never the answer) — powered by an LLM when a key is set, otherwise curated hints.
- **Gamified**: XP, gems, hearts, daily streaks, a skill tree.
- **Roles**: student, parent (read-only dashboard), plus an RBAC layer for teacher/admin/author.

## Tech

- **Next.js 14** (App Router) — deploys free on Vercel, serverless (not backend-heavy)
- **Neon Postgres** via **Drizzle ORM**
- **sql.js** (SQLite in WebAssembly) runs every lesson query in the browser
- **jose** cookie sessions + **bcryptjs**
- **@anthropic-ai/sdk** for the optional AI tutor

## Run locally

1. Install deps: `npm install`
2. Set env: open `.env.local` and paste your **Neon pooled connection string** into `DATABASE_URL`. `SESSION_SECRET` is already generated.
3. Create the tables: `npm run db:push`
4. (Optional) seed demo accounts: `npm run db:seed`
   - Student → `student@demo.com` / `querly123`
   - Parent → `parent@demo.com` / `querly123`
5. Start: `npm run dev` → http://localhost:3000

## Deploy to Vercel (free)

1. Push this repo to GitHub.
2. On vercel.com → **New Project** → import the repo.
3. Add environment variables (Project → Settings → Environment Variables):
   - `DATABASE_URL` — your Neon pooled connection string
   - `SESSION_SECRET` — any long random string (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `ANTHROPIC_API_KEY` — *optional*; leave unset to use curated hints
4. Deploy. Run `npm run db:push` once against the same `DATABASE_URL` to create tables (locally or via a Neon SQL console).

## Project map

```
src/
  content/curriculum.ts      # all lessons, datasets, puzzles (basic→medium)
  db/                        # Drizzle schema, client, seed
  lib/
    sqlEngine.ts             # sql.js wrapper + answer grading (browser)
    session.ts, auth.ts      # cookie sessions, signup/login
    rbac.ts                  # role → capability matrix
    gamification.ts          # XP / gems / streak logic
  app/
    page.tsx                 # landing
    login/                   # student + parent auth (age-gate + consent)
    learn/                   # skill tree home
    lesson/[id]/             # the core loop (LessonPlayer)
    parent/                  # read-only parent dashboard
    api/                     # auth, progress, tutor, parent endpoints
```

Design blueprint (persona, flows, wireframes, RBAC, MVP, metrics): `design/querly-blueprint.html`.
