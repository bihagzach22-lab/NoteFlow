# NoteFlow Angular 13 Frontend

This is an original note-taking app frontend built for Angular 13. It is not a 1:1 copy of the reference site. The project contains a proper note app structure with public marketing pages, login/register, protected user dashboard, notes CRUD workspace, and an admin placeholder.

## Tech versions

Designed for:

```txt
Angular CLI: 13.3.11
Node: 16.15.0
npm: 8.5.5
OS: Windows x64
```

## Features included

- Original NoteFlow landing page
- Login page
- Register page
- Protected dashboard
- Notes board
- Create notes
- Edit notes
- Delete notes
- Pin notes
- Archive and restore notes
- Search notes by title/content/tags
- Filter by category
- LocalStorage mock data
- Demo user and admin accounts
- Auth guard
- Admin guard
- JWT interceptor placeholder
- ASP.NET API-ready environment files
- Vercel SPA rewrite config

## Demo accounts

```txt
User:
user@noteflow.test
user123

Admin:
admin@noteflow.test
admin123
```

## Install

```bash
npm install
```

## Run locally

```bash
ng serve
```

Open:

```txt
http://localhost:4200
```

## Production build

```bash
ng build --configuration production
```

Output folder:

```txt
dist/noteflow-frontend
```

## Vercel settings

```txt
Framework Preset: Other
Build Command: ng build --configuration production
Output Directory: dist/noteflow-frontend
```

## Backend connection later

When the ASP.NET Core API is ready, update:

```txt
src/environments/environment.ts
src/environments/environment.prod.ts
```

Then replace the mock logic in:

```txt
src/app/services/auth.service.ts
src/app/services/notes.service.ts
```

Recommended backend endpoints:

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/notes
POST /api/notes
PUT  /api/notes/{id}
DELETE /api/notes/{id}
PATCH /api/notes/{id}/pin
PATCH /api/notes/{id}/archive
GET  /api/admin/users
```

## Important note

The current login/register and notes data are frontend mock features using browser LocalStorage. This is intentional because this ZIP is only the frontend phase. Passwords are not secured in this mock version. Use ASP.NET Core authentication before using this as a real production app.
