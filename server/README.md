Local server for ResepBudeRos

Setup

1. Install dependencies:

```bash
cd /home/fadli/Documents/HTML/ResepBudeRos
npm install
```

2. Create `.env` in repo root with at least:

```
ADMIN_CODE=my-secret-code
ADMIN_SECRET=another-secret-used-to-sign-tokens
PORT=4000
```

3. Start server:

```bash
npm run start
```

API basics
- `POST /admin/verify` { code } -> { token }
- protected mutating endpoints require `Authorization: Bearer <token>`
- `GET /api/recipes` and `GET /api/recipes/:id`
- `POST /api/recipes` multipart/form-data (field `scan` for file)
- `PUT /api/recipes/:id` multipart/form-data
- `DELETE /api/recipes/:id`

Uploads are saved to `public/scans/`. Thumbnails for image uploads are generated to `public/scans/thumbs/`.
