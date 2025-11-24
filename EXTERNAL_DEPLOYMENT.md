# External Deployment Guide (Outside Base44)

## Cheapest Options with Custom Domain & NPM Modules

### 🏆 **Best Free Options:**

1. **Vercel** (Recommended) - FREE
   - ✅ Free tier with generous limits
   - ✅ Custom domain support (free)
   - ✅ Full npm module support
   - ✅ Automatic deployments from Git
   - ✅ Built-in CDN
   - ✅ Perfect for Vite/React apps

2. **Netlify** - FREE
   - ✅ Free tier available
   - ✅ Custom domain support (free)
   - ✅ Full npm module support
   - ✅ Automatic deployments
   - ✅ Good for static sites

3. **Cloudflare Pages** - FREE
   - ✅ Completely free
   - ✅ Custom domain support (free)
   - ✅ Full npm module support
   - ✅ Fastest CDN globally
   - ✅ Unlimited bandwidth

---

## Option 1: Vercel (Recommended - Easiest)

### Setup Steps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts. Vercel will auto-detect Vite.

4. **Add Environment Variables:**
   - Go to your project on Vercel dashboard
   - Settings → Environment Variables
   - Add:
     - `VITE_VAPI_PUBLIC_KEY` = your key
     - `VITE_VAPI_ASSISTANT_ID` = your assistant ID

5. **Add Custom Domain:**
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter your domain
   - Follow DNS instructions

### Build Settings (Auto-detected):
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

---

## Option 2: Netlify

### Setup Steps:

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Or Connect via GitHub:**
   - Push code to GitHub
   - Go to [netlify.com](https://netlify.com)
   - "Add new site" → "Import from Git"
   - Connect repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

5. **Add Environment Variables:**
   - Site settings → Environment variables
   - Add your `VITE_*` variables

6. **Add Custom Domain:**
   - Site settings → Domain management
   - Add custom domain

---

## Option 3: Cloudflare Pages

### Setup Steps:

1. **Push to GitHub/GitLab**

2. **Go to Cloudflare Dashboard:**
   - Workers & Pages → Create application → Pages
   - Connect your Git repository

3. **Build Settings:**
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`

4. **Add Environment Variables:**
   - Settings → Environment variables
   - Add your `VITE_*` variables

5. **Add Custom Domain:**
   - Custom domains → Set up a custom domain
   - Follow DNS instructions

---

## Preparing Your App for External Deployment

### Step 1: Remove Base44 Dependencies (Optional)

If you're not using Base44 features, you can remove the plugin:

```bash
npm uninstall @base44/sdk @base44/vite-plugin
```

Then update `vite.config.js` to remove the Base44 plugin.

### Step 2: Update vite.config.js

Create a version without Base44 plugin:

```js
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
})
```

### Step 3: Ensure Build Works Locally

```bash
npm run build
npm run preview
```

Test that everything works before deploying.

---

## Cost Comparison

| Platform | Free Tier | Custom Domain | NPM Modules | Best For |
|----------|-----------|---------------|-------------|----------|
| **Vercel** | ✅ Generous | ✅ Free | ✅ Full | Best overall |
| **Netlify** | ✅ Good | ✅ Free | ✅ Full | Static sites |
| **Cloudflare Pages** | ✅ Unlimited | ✅ Free | ✅ Full | Fastest CDN |
| **Render** | ⚠️ Limited | ✅ Free | ✅ Full | Full-stack apps |
| **Railway** | ⚠️ $5/month | ✅ Free | ✅ Full | Backend-heavy |

**Recommendation:** Start with **Vercel** - it's free, easiest to use, and perfect for Vite apps.

---

## Quick Deploy Commands

### Vercel (Fastest):
```bash
npm install -g vercel
vercel
```

### Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Cloudflare Pages:
- Use web UI (easiest)
- Or use Wrangler CLI for advanced users

---

## Environment Variables Setup

All platforms support environment variables. Add these in each platform's dashboard:

- `VITE_VAPI_PUBLIC_KEY` = your Vapi public key
- `VITE_VAPI_ASSISTANT_ID` = your assistant ID (optional)

The `VITE_` prefix is required for client-side access.

---

## Custom Domain Setup

All three platforms (Vercel, Netlify, Cloudflare) offer **free custom domains**. You just need to:

1. Add your domain in the platform's dashboard
2. Update your DNS records (A record or CNAME)
3. Wait for SSL certificate (automatic, usually < 5 minutes)

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages

