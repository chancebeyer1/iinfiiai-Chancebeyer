# Base44 App

## Deployment to Base44

### Setting Environment Variables

To enable the Vapi voice widget, add these secrets in your Base44 dashboard:

1. Go to your Base44 project dashboard
2. Navigate to **Base44 Secrets** section
3. Click **"+ Add Secret"** button
4. Add these secrets:

   - **VITE_VAPI_PUBLIC_KEY** = Your Vapi Public API Key (get from [Vapi Dashboard](https://dashboard.vapi.ai))
   - **VITE_VAPI_ASSISTANT_ID** = Your Assistant ID (optional, defaults to demo assistant)

**Note:** The `VITE_` prefix is required for Vite to expose these to client-side code.

### Deploying Changes

```bash
# Commit your changes
git add .
git commit -m "Your commit message"
git push origin main
```

Base44 will automatically detect the push and start building your application.