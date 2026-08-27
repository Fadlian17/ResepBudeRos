Local server for ResepBudeRos

Setup

1. Install dependencies:

```bash
cd /home/fadli/Documents/HTML/ResepBudeRos
npm install
```

2. Create `.env` in repo root (copy from `.env.example`):

```
ADMIN_CODE=my-secret-code
ADMIN_SECRET=another-secret-used-to-sign-tokens
PORT=4000
ALLOWED_ORIGIN=http://localhost:4000
```

> **IMPORTANT:** The server will NOT start without `ADMIN_CODE` and `ADMIN_SECRET` set.
> Never commit `.env` to version control.

3. Start server:

```bash
npm run start
```

API basics
- `GET /health` -> `{ status: 'ok', database: 'connected' }`
- `POST /admin/verify` { code } -> { token } (rate limited: 5 attempts / 15 min)
- protected mutating endpoints require `Authorization: Bearer <token>`
- `GET /api/recipes` and `GET /api/recipes/:id`
- `POST /api/recipes` multipart/form-data (field `scan` for file)
- `PUT /api/recipes/:id` multipart/form-data
- `DELETE /api/recipes/:id`

Security notes
- CORS is restricted to `ALLOWED_ORIGIN` (default: `http://localhost:4000`)
- Static files are served from `public/` only (not the entire project)
- Admin login endpoint has rate limiting (5 attempts per 15 minutes)
- JWT tokens expire after 30 minutes

Uploads are saved to `public/scans/`. Thumbnails for image uploads are generated to `public/scans/thumbs/`.
