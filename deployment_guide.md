# SaaS Deployment Guide 🚀

Follow these steps to take your LinkedIn Content SaaS live.

## 0. Upload to GitHub (The "Bridge")
Vercel and Railway need to connect to your code. To do this, you must push your local folder to GitHub.

### Step A: Create a Repository
1. Go to [GitHub.com](https://github.com) and log in.
2. Click the **"+"** icon (top right) > **New repository**.
3. Name it: `linkedin-content-saas`.
4. Keep it **Public** (or Private if you prefer).
5. **CRITICAL**: Do NOT check "Add a README" or ".gitignore" (I have already created these for you).
6. Click **Create repository**.

### Step B: Push your code
Open your Mac **Terminal** and paste these commands one by one (hit Enter after each):

```bash
# 1. Go to your project folder
cd "/Users/nitishranjan/Desktop/Everything AI/content-saas"

# 2. Start a new Git session
git init

# 3. Add all your files
git add .

# 4. Save the files (Commit)
git commit -m "initial saas engine build"

# 5. Connect to YOUR specific GitHub link (Replace 'username' with yours)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/linkedin-content-saas.git

# 6. Upload the code
git branch -M main
git push -u origin main
```

## 1. Supabase Setup (The Database)
In your Supabase Dashboard:
1. Go to **SQL Editor** (left sidebar).
2. Click **New Query**.
3. Copy the contents of [`supabase_schema.sql`](file:///Users/nitishranjan/Desktop/Everything%20AI/content-saas/supabase_schema.sql) and paste them there.
4. Click **Run**. 
   - *This creates the tables needed to save your brand data.*

## 2. Railway Setup (The Backend)
1. Go to [Railway.app](https://railway.app).
2. Create a **New Project** > **Deploy from GitHub repo**.
3. Select this repository.
4. Go to the **Variables** tab and add:
   - `OPENAI_API_KEY`: *(Your OpenAI Key)*
5. Railway will automatically detect the `backend/` folder and deploy your API.

## 3. Vercel Setup (The Frontend)
1. Go to [Vercel.com](https://vercel.com).
2. **Add New Project** > **Import** your GitHub repo.
3. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: *(From Supabase Settings > API)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: *(From Supabase Settings > API)*
4. Click **Deploy**.

## The Way Ahead
After deployment:
1. Open your Vercel URL.
2. Log in via Magic Link.
3. Go to **Brand Profile** and complete the **Discovery Session**.
4. Hit **Calibrate Engine**.
5. Go to **Generate** and start creating your first high-authority posts!
