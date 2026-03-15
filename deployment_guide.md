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

> [!IMPORTANT]
> **Authentication Troubleshooting:**
> 1. **Password is Invisible:** When you type or paste your password/token in the Terminal, you will see NOTHING (no dots, no stars). This is a security feature. Just paste and hit Enter.
> 2. **Password vs Token:** GitHub **no longer accepts** your normal account password in the terminal. You must use a **Personal Access Token (PAT)**.

### How to get your Token (PAT):
1. Go to **GitHub Settings** > **Developer settings** (bottom left).
2. Click **Personal access tokens** > **Tokens (classic)**.
3. Click **Generate new token** > **Generate new token (classic)**.
4. Note: "SaaS Deploy".
5. Expiration: 30 days.
6. **Check the "repo" box** (top one).
7. Scroll down and click **Generate token**.
8. **COPY THE TOKEN IMMEDIATELY.** You won't see it again.
9. **When Terminal asks for "Password", paste THE TOKEN instead of your password.**
10. **STILL NOT WORKING?** Run this command to "Force" the link (Replace `YOUR_TOKEN` with the code you copied):

```bash
git remote set-url origin https://ranjannitish56:YOUR_TOKEN@github.com/ranjannitish56/linkedin-content-saas.git
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
5. **CRITICAL (Root Directory)**:
   - Click on your **Service Box** (usually looks like a colored rectangle for your repo).
   - Go to the **Settings** tab.
   - Look for **"Root Directory"** under the **"Service"** section.
   - Set it to `/backend` and click the checkmark/save.
6. Railway will automatically redeploy.

> [!TIP]
> **Can't find your repo on Railway?**
> Click on **"Configure GitHub App"** in the Railway search popup. This will take you to GitHub where you need to make sure the `linkedin-content-saas` repository is selected (or choose "All repositories").

## 3. Vercel Setup (The Frontend)
1. Go to [Vercel.com](https://vercel.com).
2. **Add New Project** > **Import** your GitHub repo.
3. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: *(From Supabase Settings > API)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: *(From Supabase Settings > API)*
   - `NEXT_PUBLIC_API_URL`: **GET THIS FROM RAILWAY** (Instruction below)
4. Click **Deploy**.

### How to get your Railway API URL:
1. Go to your **Railway Project**.
2. Click your **Service Box**.
3. Go to the **Networking** tab.
4. Click **"Generate Domain"** (if one doesn't exist already).
5. Copy the URL (e.g., `https://backend-production-123.up.railway.app`).
6. **THIS IS YOUR `NEXT_PUBLIC_API_URL`.**

## 4. Final Verification
1. Open your Vercel URL.
2. Log in.
3. Go to **Brand Profile**, fill it out, and click **Calibrate Engine**.
4. Go to **Generate** and click **Generate Batch**.
5. Your first 5 high-authority posts will appear on the dashboard!
