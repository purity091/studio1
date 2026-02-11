<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally and deploy it to Vercel.

View your app in AI Studio: https://ai.studio/apps/drive/1uvCZow2M0tlyOl_gOr-sCc-bVgx7eUG6

## Run Locally

**Prerequisites:**  Node.js + Vercel CLI (optional but recommended)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set the environment variables:**
   Add your Gemini API key to `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the app:**
   Since this app now uses serverless functions for security, run with Vercel CLI:
   ```bash
   npx vercel dev
   ```
   Or use standard dev (API calls may fail if not proxied correctly, use Vercel dev for full experience):
   ```bash
   npm run dev
   ```

## Deploy to Vercel

1. **Push your code to GitHub/GitLab/Bitbucket.**

2. **Import project into Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." -> "Project"
   - Import your repository.

3. **Configure Environment Variables:**
   - In the project settings on Vercel, add:
     - `GEMINI_API_KEY`: Your actual Google Gemini API Key.

4. **Deploy:**
   - Click "Deploy". Vercel will automatically detect the Vite app and the `api/` folder for serverless functions.

## Project Structure

- `api/`: Serverless functions for secure backend logic (replaces exposed client-side keys).
- `src/` (or root): React Frontend code.
- `vercel.json`: Configuration for routing and headers.
