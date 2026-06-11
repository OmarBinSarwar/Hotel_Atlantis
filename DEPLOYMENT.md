# deployment guide: hotel atlantis royal

This guide explains how to deploy the **Express Backend** to Render and the **Vite Frontend** to Vercel.

---

## 1. Deploy the Backend to Render (https://render.com)

Render makes it easy to deploy services from subdirectories. Follow these steps:

1. **Create a Web Service**:
   - Log in to Render, click **New +**, and select **Web Service**.
   - Connect your GitHub repository containing the project.

2. **Configure Service Details**:
   - **Name**: `atlantis-royal-backend` (or any name you prefer)
   - **Environment**: `Node`
   - **Region**: Choose a region closest to you or your database.
   - **Branch**: `main` (or your active development branch)
   - **Root Directory**: `backend` *(CRITICAL: This tells Render to run commands inside the backend folder)*

3. **Configure Build & Start Commands**:
   - **Build Command**: `npm install && npm run build` *(This installs backend packages and generates the Prisma client)*
   - **Start Command**: `npm start` *(This runs node server.js)*

4. **Set Environment Variables**:
   - Click on **Advanced** or the **Environment** tab.
   - Add the following variable:
     - `DATABASE_URL` = `mongodb+srv://...` *(Your MongoDB Atlas connection string)*

5. **Deploy**:
   - Click **Create Web Service**. Once deployed, Render will provide a URL (e.g., `https://atlantis-royal-backend.onrender.com`). Copy this URL.

---

## 2. Deploy the Frontend to Vercel (https://vercel.com)

Vercel natively supports Vite projects and subdirectories. Follow these steps:

1. **Import Project**:
   - Log in to Vercel, click **Add New...** -> **Project**.
   - Connect your GitHub repository.

2. **Configure Project Settings**:
   - **Project Name**: `atlantis-the-royal` (or any name you prefer)
   - **Framework Preset**: `Vite` *(Vercel will detect Vite automatically)*
   - **Root Directory**: Click **Edit** and select the `frontend` folder.

3. **Set Environment Variables**:
   - Expand the **Environment Variables** section.
   - Add the following variable:
     - `VITE_API_URL` = `https://your-backend.onrender.com` *(Paste the Render backend URL you copied in the previous section. Make sure there is NO trailing slash `/` at the end)*

4. **Deploy**:
   - Click **Deploy**. Vercel will automatically build the static assets and deploy your luxury hotel website!

---

## Local Development Reminder
To run both backend and frontend together locally, simply open the project root directory and run:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
