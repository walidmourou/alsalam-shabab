# Al-Salam Lörrach – Jugendkurs Anmeldung

Bilingual (German / Arabic) registration website for the **Jugendkurs für
Glaubensbildung** (Youth Course for Faith-Based Education) of the
*Gemeinnütziger Verein Al-Salam in Lörrach*.

Parents watch the association's presentation video, then register one or more
children online. An internal admin area lists every submitted registration.

## Features

- **Bilingual** German (`/de`, LTR) and Arabic (`/ar`, RTL) with automatic
  language detection (`Accept-Language`) and a language switcher.
- **Home page** with a clear invitation to watch the presentation video
  (`public/shabab.mp4`) before registering.
- **Registration form** collecting the parent's full name, address, phone and
  e-mail, plus any number of children (name, birth date, gender).
- **Consent** required for the association regulations and for a commitment to
  regular attendance.
- **Server-side validation** with localized, per-field error messages.
- **Admin interface** (`/{lang}/admin`) listing all registrations with quick
  statistics (registrations, children, boys, girls) and a per-family breakdown.
- Full **German and Arabic** UI translations, light branded design and mobile
  friendly layout.

## Tech stack

- [Next.js 16](https://nextjs.org) App Router with **Cache Components**
  (`cacheComponents: true`) and Partial Prefetching.
- React 19 Server Components, Server Functions/Actions and `useActionState`.
- Tailwind CSS v4.
- **MySQL** via `mysql2` (connection pool, prepared statements, transactions).

## Getting started

### 1. Configure the database

The database connection is read from `.env` (already present for this project):

```dotenv
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
DB_HOST=...
DB_PORT=3306
```

> The `DB_*` variables may include characters such as `[`, `?` or `*`. Next.js
> reads `.env` directly, so no extra escaping is required.

Optional overrides:

| Variable               | Default                       | Purpose                                   |
| ---------------------- | ----------------------------- | ----------------------------------------- |
| `ADMIN_USERNAME`       | `admin`                       | Admin area user                           |
| `ADMIN_PASSWORD`       | `987654321`                   | Admin area password                       |
| `ADMIN_SESSION_SECRET` | derived from `DB_PASSWORD`    | Secret used to sign the admin session     |
| `DB_DNS_ORDER`         | `ipv4first`                   | Address family used to reach the database |

> **Remote database access.** The database host resolves to both an IPv4 and an
> IPv6 address, and the application deliberately connects over IPv4 (see
> `DB_DNS_ORDER`) so that a single entry in the host's remote-access allow-list
> is enough. If the connection fails with `ER_ACCESS_DENIED_ERROR`, add the
> client address reported in the error message to that allow-list, or run the
> application on the database server itself and use `DB_HOST=localhost`.

### 2. Install and run

```bash
npm install
npm run db:init   # optional – creates the tables up-front
npm run dev
```

Open <http://localhost:3000> – you will be redirected to `/de` or `/ar`.

Other scripts:

```bash
npm run build      # production build
npm run start      # production server
npm run lint       # ESLint
npm run typecheck  # TypeScript
```

## Database

All tables created by this project are prefixed with `yc_` (youth course) so
they **never touch the existing tables** of the association's database. The
application creates them automatically on first use, so `npm run db:init` is
only a convenience.

| Table              | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `yc_registrations` | One row per parent / family registration              |
| `yc_children`      | One row per child, linked to a registration (1–6)     |

## Routes

| Route             | Description                                        |
| ----------------- | -------------------------------------------------- |
| `/`               | Redirects to the detected language                 |
| `/{lang}`         | Home page with the presentation video               |
| `/{lang}/register`| Registration form                                   |
| `/{lang}/admin`   | Admin login / dashboard (noindex)                   |

## Admin access

- URL: `/{lang}/admin`
- User: **admin**
- Password: **987654321**

The admin session is stored in an HTTP-only cookie. In production the cookie is
marked `Secure`, so the site must be served over **HTTPS** for the admin login
to work. `npm run dev` works over plain HTTP.

## Assets

- `public/shabab.mp4` – the association's presentation video.
- `public/shabab-poster.jpg` – poster frame shown before playback.
- `public/logo.png` – association logo (extracted from the video).
- `public/Icon.ico` – association emblem (also used as `app/favicon.ico`).

## Deployment notes

- Ensure the MySQL user is allowed to connect from the server that runs the app
  (Hostinger: *Remote MySQL* / the host's own IP).
- The app creates the `yc_*` tables on the first request; no manual migration is
  needed.
- Because Cache Components are enabled, cached pages revalidate on a schedule and
  the admin dashboard always reads fresh data at request time.
