# Base44 Deployment Guide

## Quick Deployment Steps

### 1. Commit Your Changes

```bash
# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Add Vapi voice widget with dynamic message splitting"

# Push to Base44
git push origin main
```

### 2. Set Environment Variables in Base44

Before deploying, make sure to add these environment variables in your Base44 dashboard:

1. Go to your Base44 project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   - **VITE_VAPI_PUBLIC_KEY** = `your_vapi_public_key_here`
   - **VITE_VAPI_ASSISTANT_ID** = `your_assistant_id_here` (optional)

**Important:** The `VITE_` prefix is required for Vite to expose these to client-side code.

### 3. Verify Deployment

After pushing:
- Base44 should automatically detect the push and start building
- Check the Base44 dashboard for build status
- Once deployed, test the voice widget on your live site

### 4. If Base44 Doesn't Support @vapi-ai/web Package

If you encounter issues with the npm package, you can use the CDN version:

1. Add this to `index.html` (before `</body>`):
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/dist/index.umd.js"></script>
   ```

2. Create `VoiceWidgetCDN.jsx` (we can provide this if needed)

3. Update `HowItWorks.jsx` to import `VoiceWidgetCDN` instead of `VoiceWidget`

## Troubleshooting

- **Build fails**: Check Base44 build logs for errors
- **Voice widget not working**: Verify environment variables are set correctly
- **Package not found**: Use the CDN version as fallback

