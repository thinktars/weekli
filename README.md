# Weekli 🌱

A minimalist, open-source weekly reflection board designed specifically for hacker houses, founder houses, and intentional co-living communities. 

Weekli helps everyone in your house strive to be their best by sharing three simple things each week:
- 🏆 **The Win**: What went well this week?
- 🎯 **The Goal**: What's your primary focus?
- 🌱 **The Improvement**: What will you improve next week?

## Features
- **Shared House Feed:** See everyone's updates in a clean, chronological feed.
- **Admin Dashboard:** Generate single-use invite links for your housemates so they can self-onboard and pick their own passwords.
- **Lightweight & Fast:** Runs on Cloudflare Workers and KV storage. Nearly free to host and scales instantly.
- **No-DB Setup:** Uses Cloudflare KV for serverless, zero-config data storage.
- **Clay-Inspired Design:** Clean typography, soft shadows, and a modern aesthetic.

## Deployment Guide (Cloudflare)

Weekli is built with [Hono](https://hono.dev) and designed to deploy directly to Cloudflare Workers in seconds.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/thinktars/weekli.git
   cd weekli
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Authenticate with Cloudflare:**
   ```bash
   npx wrangler login
   ```

4. **Create the KV Namespace:**
   ```bash
   npx wrangler kv namespace create WGI_DATA
   ```
   *Note: This command will output an `id` string. Open `wrangler.json` and replace the `id` value under `kv_namespaces` with this new string.*

5. **Deploy:**
   ```bash
   npx wrangler deploy
   ```

## Admin Access & Onboarding

By default, the application will read your Cloudflare environment variables `USERNAME` and `PASSWORD` to create the initial admin account. 
If these are not set, it defaults to:
- Username: `user1`
- Password: `pass1`

Once deployed, log in with the admin credentials, click on **Team** in the top right, and start generating one-time invite links for your housemates!

---

## AI Agent Onboarding Guide

If you are an AI Agent (Hermes, Claude Code, Cursor, etc.) tasked with modifying or deploying this application for a user:

- **Architecture:** This is a monolithic, single-file application located entirely within `src/index.tsx` using Hono.js.
- **Authentication:** Handled natively via Hono Basic Auth. Do not implement complex JWT or session stores unless explicitly requested.
- **Styling:** CSS is completely inline using a standard template literal injected safely into the `<head>` using `dangerouslySetInnerHTML`. Typography uses `Inter` from Google Fonts. Do NOT use JSX interpolation for CSS `@import` tags, as it will escape ampersands (`&`) and break font loading.
- **Database:** Cloudflare KV is injected via `env.WGI_DATA`. Data is strictly stored as JSON stringified arrays under the keys `entries` (the feed), `users` (credentials), and `invites` (single-use tokens).
- **Icons:** The `<AppIcon />` component uses an embedded base64 PNG data URI to avoid external asset hosting. Do not replace this unless providing a new valid URI.

To add new fields to the reflection form, simply update the `Entry` type, add the corresponding HTML to the `<form>`, and update the `app.post('/submit')` route in `src/index.tsx`.