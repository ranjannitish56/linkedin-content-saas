# Content SaaS: Creator Intelligence

This is a standalone web application designed to transform LinkedIn creator research into high-performing content.

## 🚀 Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons
- **Backend Engine**: FastAPI, LangChain, OpenAI GPT-4o, **Pillow (Image Logic)**
- **Database**: Supabase (Auth + DB)
- **Deployment**: Vercel (Frontend), Railway (Backend)

## 📁 Repository Structure
- `src/`: Next.js frontend source code. (Deploy this to **Vercel**)
- `backend/`: FastAPI Python engine. (Deploy this to **Railway**)
- `backend/static_images/`: Temporary storage for generated cards (cleared on redeploy).

## 🛠 Deployment Instructions

### 1. Supabase Setup
1. Create a project on [Supabase.com](https://supabase.com).
2. Go to **Project Settings** > **API**.
3. Copy your `Project URL` and `anon public` key.

### 2. Frontend Deployment (Vercel)
1. Push this folder to a private **GitHub** repository.
2. Link the repository to **Vercel**.
3. Add the following Environment Variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Key.

### 3. Backend Deployment (Railway)
1. Link your GitHub repository to **Railway**.
2. Set the Root Directory to `backend/`.
3. Add the following Environment Variables in Railway:
   - `OPENAI_API_KEY`: Your OpenAI API key.

---
*Created for Nitish Ranjan*
