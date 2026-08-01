# 📰 Mini Blog CMS – Full Stack Starter

A fully functional, Dockerized, production-ready **full stack blog CMS** — built from scratch using modern industry practices. Includes user authentication, media uploads, dark mode support, and public/private routes.

> This app is designed as both a template and portfolio-quality proof of full stack development skill.

---

## 🔥 Features

- 🔐 **JWT Auth (access + refresh tokens)**
- 👤 **User profile with bio, avatar, and theme preference**
- 🖼️ **Featured image uploads for posts**
- 📝 **Rich text post editor (TinyMCE)**
- 🌓 **Dark/light theme toggle, synced across UI, localStorage, and backend**
- 🚫 **Protected routes for authenticated users**
- 🌐 **Public blog view with custom author boxes**
- 🐳 **Fully Dockerized (client + server + Postgres + pgAdmin)**
- ☁️ **Production-deployable via Fly.io**
- 💾 **Prisma ORM with PostgreSQL**

---


## 🧱 Tech Stack

| Layer       | Tech                         |
|-------------|------------------------------|
| Frontend    | React + Vite + MUI v10       |
| Backend     | Node.js + Express + Prisma   |
| Auth        | JWT (access + refresh), cookies |
| Database    | PostgreSQL                   |
| Storage     | Local (uploads to `/media`)  |
| Deployment  | Fly.io (Docker)              |

---

## 🧪 Local Development

### 1. Clone the project:

```bash
git clone https://github.com/yourusername/mini-blog-cms.git
cd mini-blog-cms
```

### 2. Create `.env` files:

#### `server/.env`

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/mini_blog
JWT_ACCESS_SECRET=your_dev_access_secret
JWT_REFRESH_SECRET=your_dev_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=12h
REFRESH_TOKEN_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

#### `client/.env`

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SERVER_PUBLIC_URL=http://localhost:3000
```

### 3. Start everything with Docker:

```bash
docker compose up --build
```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:3000/api  
- pgAdmin: http://localhost:5050

---

## 🐳 Docker Architecture

```
/client       → React app (Vite)
/server       → Express + Prisma API
/db           → PostgreSQL (via Docker)
```

All containers are defined in `docker-compose.yml` and share a network. PostgreSQL has persistent volume storage.

---

## 🔧 Environment Variables

| Environment | Path                     | Notes                        |
|-------------|--------------------------|------------------------------|
| Dev API     | `server/.env`            | Used locally with Docker     |
| Dev Client  | `client/.env`            | VITE_ prefixed variables     |
| Prod API    | `fly secrets set`        | Injected via Fly CLI         |
| Prod Client | `client/.env.production` | Used at build time by Vite   |

---

## ☁️ Deployment (Fly.io)

This app uses **split deployment** for frontend and backend.

### ✅ Backend

```bash
cd server
fly launch # Accept prompts, don't deploy yet
fly postgres create
fly postgres attach --app mini-blog-api
fly secrets set JWT_ACCESS_SECRET=... JWT_REFRESH_SECRET=... ACCESS_TOKEN_EXPIRES_IN=12h REFRESH_TOKEN_EXPIRES_IN=7d CLIENT_ORIGIN=https://yourdomain.com
fly deploy
```

### ✅ Frontend

```bash
cd client
npm run build
fly launch --name mini-blog-client
fly deploy
```

> Make sure `VITE_API_BASE_URL` and `VITE_SERVER_PUBLIC_URL` point to your live API URL, e.g. `https://mini-blog-api.fly.dev`

---

## 🌐 Custom Domain (Optional)

If you have a domain (e.g., via SiteGround), configure DNS:

| Subdomain            | Points To                 |
|----------------------|---------------------------|
| `yourdomain.com`     | Fly frontend app          |
| `api.yourdomain.com` | Fly backend app           |

✅ Fly handles HTTPS certs automatically.

---

## 🙋 About the Developer

This project was built to demonstrate real full-stack skills — from backend auth to frontend theming to DevOps deploys.

Built by **Caleb Hoffman** — full stack developer focused on modern SaaS, React, and Node.js.

[GitHub](https://github.com/calebhoffman) • [Portfolio](https://yourdomain.com)

---

## 🪪 License

MIT — free to use, customize, and ship.
