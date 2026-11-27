# 🌱 EcoHand — Frontend

React (Vite) frontend for **EcoHand**, a second-hand electronics marketplace built to reduce
e-waste. This repository contains only the client app — the API lives in the
[`Eco-Hand-Serversite`](https://github.com/Tonmoy225/Eco-Hand-Serversite) repository.

**Live site:** https://eco-hand-website.vercel.app/

---

## ✨ Features

- 🔐 Register / Login / Logout with JWT (show/hide password toggle)
- 📰 News feed with category pills, search, filters and pagination
- 📦 Listings: create, edit, mark sold, delete, like, save, share and comment
- 💬 **Buyer ↔ seller chat** with unread badges, conversation list and listing context
- 👤 Profile editing, avatar/cover upload, social links and eco-score
- 🛒 Cart, 🔖 saved posts and 🔔 notifications
- 🛡️ Admin dashboard — stats, user roles, listings, reports and feedback
- 📱 Responsive for **PC (≥1441px), laptop (1025–1440px), tablet (768–1024px) and mobile (≤767px)**,
  including a bottom tab bar and slide-out navigation on small screens
- 🎨 Purple / dark professional theme

---

## 🛠 Tech stack

| | |
|---|---|
| Framework | React 18 + Vite 5 |
| Routing | React Router 6 |
| State | Zustand |
| HTTP | Axios (Bearer token + cookie, `withCredentials`) |
| UI | react-hot-toast, react-icons, date-fns, Font Awesome CDN |

---

## 🚀 Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173**.

In development, Vite proxies `/api` to `http://localhost:5000` (see `vite.config.js`), so
start the backend too:

```bash
# in the server repository
npm install
npm run dev
```

### Environment variables

`.env` is **optional**. The app uses the `/api` proxy by default.

To call the backend directly instead, copy `.env.example` to `.env` and set:

```
VITE_API_URL=https://your-backend-url.vercel.app
```

Use the backend **origin only** (no `/api` suffix — it is added automatically). When set, make
sure the backend CORS allows your frontend origin.

---

## 🌍 Deploy to Vercel

1. Import this repository into Vercel.
2. Framework preset: **Vite**. Build command: `npm run build`. Output: `dist`.
3. Since `package.json` and `vercel.json` are at the repository root, leave **Root Directory**
   as `.`.
4. `vercel.json` already contains:
   - `/api/:path*` → the backend URL (change the `destination` if your backend URL differs)
   - a SPA fallback so routes like `/post/:id` and `/admin` work on refresh
   - a header that disables caching of proxied API responses
5. Deploy, then verify `https://<your-site>/api/auth/me` returns a JSON response (not 404).

---

## 📁 Structure

```
src/
├── api/            # axios client + auth, posts, users, chat, admin calls
├── components/
│   ├── chat/       # messaging widget
│   ├── common/     # shared helpers
│   ├── layout/     # topbar, sidebar, category bar, right panel, mobile nav/drawer
│   ├── modals/     # auth, profile, cart, create post, feedback, report, etc.
│   └── post/       # post card
├── pages/          # feed, post detail, profile, my posts, saved, admin, landing
├── store/          # auth, UI and chat state (Zustand)
└── styles/         # global CSS and responsive breakpoints
```

---

## 🔑 Demo accounts (if demo data was seeded)

| Role | Email | Password |
|---|---|---|
| User | `demo@ecohand.app` | `demo1234` |
| Admin | `admin@ecohand.app` | `admin1234` |

> Remove demo data before making the site public: in the server repo run
> `npm run seed -- --clear`.
