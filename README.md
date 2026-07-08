# Little Paws Dachshund Rescue

The web platform for [Little Paws Dachshund Rescue](https://littlepawsdr.org), an East Coast based 501(c)(3) nonprofit dedicated to the rescue and re-homing of dachshunds and dachshund mixes.

Built and maintained by [Sqysh](https://sqysh.com).

---

## ⚠️ Proprietary Software — No Contributions

This repository is **source-available but proprietary**. It is published publicly for transparency and reference only.

- **All rights reserved.** This software is the exclusive property of Sqysh.
- **No contributions accepted.** Pull requests, patches, and feature submissions will not be reviewed or merged.
- **No license granted.** You may not copy, modify, distribute, sublicense, or use any part of this codebase, in whole or in part, for any purpose without prior written permission from Sqysh.
- **No forking for reuse.** Viewing the code is permitted; repurposing it is not.

If you have a question about the platform or a licensing inquiry, contact Sqysh directly.

---

## About

A custom, full-stack platform purpose-built to replace the disconnected third-party tools most rescues rely on. It handles adoptions, fundraising, e-commerce, live auctions, sponsorships, and member management in a single application.

### Features

- **Adoptions** — dachshund listings synced from Rescue Groups, adoption applications, and fee processing
- **Fundraising** — one-time and recurring donations, live real-time auctions, and "Welcome Wiener" sponsorship campaigns
- **Store** — merchandise with an automated fulfillment pipeline
- **Newsletters** — issue archive and subscriber management
- **Admin** — a full control panel for orders, users, content, and reporting
- **Member portal** — accounts, order history, and subscriptions

## Tech Stack

- **Framework** — Next.js (App Router) + TypeScript
- **Database** — PostgreSQL (Neon) via Prisma
- **Auth** — Auth.js (NextAuth v5) with database sessions
- **Payments** — Stripe
- **Email** — Resend
- **Realtime** — Pusher
- **Storage** — Firebase Storage
- **Styling** — Tailwind CSS v4
- **State** — Redux Toolkit
- **Hosting** — Vercel

## Status

Actively developed and maintained. This is production software running a live nonprofit platform.

---

© Sqysh. All rights reserved.
