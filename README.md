# Render Tracker

A web app for tracking 3D render progress across projects and cameras. Create a project, add cameras to it, and log rendered-frame counts with a reference image to see progress and estimated completion time per camera.

## Stack

- **Frontend**: React 19 + Vite, React Router, Tailwind CSS, Axios
- **Backend**: Express (ESM), MySQL (`mysql2`), Multer for image uploads

## Project structure

```
backend/    Express API + MySQL access (routes, controllers, models)
frontend/   React + Vite single-page app
```

## Setup

### 1. Database

Create the schema (requires a running MySQL server):

```bash
mysql -u root -p < backend/config/schema.sql
```

This creates the `render_time_calculator` database with `project` and `camera` tables.

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=render_time_calculator
MYSQL_PORT=3306
PORT=5000
```

Start the server:

```bash
npm start
```

The API listens on `http://localhost:5000` (or LAN IP) and serves uploaded images from `/uploads`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The API base URL is set in `frontend/src/utils/context.jsx` (defaults to `http://localhost:5000`).

## Features

- Create and delete projects
- Add cameras to a project with total frame count, rendered-frame count, and a reference image
- Edit/update camera render progress and image
- View per-camera progress with elapsed/remaining time estimates (seconds/minutes/hours)
- Delete cameras

## API overview

| Method | Endpoint            | Description              |
|--------|----------------------|---------------------------|
| GET    | `/getProject`        | List projects             |
| POST   | `/createProject`     | Create a project           |
| POST   | `/deleteProject`     | Delete a project           |
| POST   | `/getCameraDetails`  | List cameras for a project |
| POST   | `/getViewDetails`    | Get a single camera        |
| POST   | `/upload`            | Add a camera (with image)  |
| POST   | `/update`            | Update a camera (with image)|
| POST   | `/delete`            | Delete a camera            |

A Postman collection is available at `backend/postman_collection.json`.
