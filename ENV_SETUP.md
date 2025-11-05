# Environment Variables Setup Guide

This guide explains how to set environment variables for the CloudNow Admin application in three different environments:

1. **Local Development** (.env.local)
2. **GitHub Actions** (GitHub Secrets)
3. **Azure App Service** (Azure Portal)

## Required Environment Variables

The following environment variables are required:

| Variable            | Required    | Description                                        | Where to Get It                                                             |
| ------------------- | ----------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| `SUPABASE_URL`      | ✅ Yes      | Your Supabase project URL                          | [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api) |
| `SUPABASE_ANON_KEY` | ✅ Yes      | Your Supabase anonymous/public key                 | [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api) |
| `UMAMI_API_KEY`     | ✅ Yes      | Umami Analytics API key                            | [Umami Dashboard](https://umami.is)                                         |
| `UMAMI_WEBSITE_ID`  | ⚠️ Optional | Umami website ID                                   | [Umami Dashboard](https://umami.is)                                         |
| `UMAMI_API_URL`     | ⚠️ Optional | Umami API URL (defaults to `https://api.umami.is`) | Usually `https://api.umami.is`                                              |

---

## 1. Local Development Setup

### Step 1: Create `.env.local` file

In the `cloudnow-website-admin` directory, create a `.env.local` file:

```bash
cd cloudnow-website-admin
touch .env.local
```

### Step 2: Add your environment variables

Open `.env.local` and add the following:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Umami Analytics API Configuration
UMAMI_API_KEY=your-umami-api-key-here
UMAMI_WEBSITE_ID=your-website-id-here
UMAMI_API_URL=https://api.umami.is
```

### Step 3: Get your Supabase credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → Use as `SUPABASE_URL`
   - **anon/public key** → Use as `SUPABASE_ANON_KEY`

### Step 4: Get your Umami credentials

1. Log in to your [Umami Dashboard](https://umami.is)
2. Navigate to **Settings** → **API Keys**
3. Create a new API key or copy an existing one → Use as `UMAMI_API_KEY`
4. Get your website ID from the website settings → Use as `UMAMI_WEBSITE_ID`

### Step 5: Verify setup

```bash
npm run dev
```

The application should start without errors.

---

## 2. GitHub Actions Setup (CI/CD)

Environment variables need to be set as **GitHub Secrets** so they're available during the build process.

### Step 1: Go to GitHub Repository Settings

1. Navigate to your GitHub repository
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Repository Secrets

Click **New repository secret** and add each of the following:

| Secret Name         | Value                     | Example                                   |
| ------------------- | ------------------------- | ----------------------------------------- |
| `SUPABASE_URL`      | Your Supabase project URL | `https://xxxxx.supabase.co`               |
| `SUPABASE_ANON_KEY` | Your Supabase anon key    | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `UMAMI_API_KEY`     | Your Umami API key        | `api_BWL6tIwwZ8e5Zjctr0QQwftXbc2OVILQ`    |
| `UMAMI_WEBSITE_ID`  | Your Umami website ID     | `4c0162c3-3a17-4187-a16a-161b50c79bbd`    |
| `UMAMI_API_URL`     | Umami API URL (optional)  | `https://api.umami.is`                    |

### Step 3: Verify in Workflow File

The workflow file (`.github/workflows/main_webapp-frontend-cnwebadmin.yml`) should already be configured to use these secrets. The build step should look like:

```yaml
- name: Install dependencies and build
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
    UMAMI_API_KEY: ${{ secrets.UMAMI_API_KEY }}
    UMAMI_WEBSITE_ID: ${{ secrets.UMAMI_WEBSITE_ID }}
    UMAMI_API_URL: ${{ secrets.UMAMI_API_URL }}
  run: |
    npm install
    npm run build
```

---

## 3. Azure App Service Setup (Runtime)

Even though environment variables are set in GitHub Actions for the build, you also need to set them in Azure App Service for runtime.

### Step 1: Navigate to Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for your App Service: `webapp-frontend-cnwebadmin`
3. Click on the App Service name

### Step 2: Open Configuration Settings

1. In the left sidebar, find **Settings** section
2. Click on **Configuration (preview)** or **Configuration**
3. You should now see multiple tabs at the top of the main content area:
   - "General settings" (you might be on this tab by default)
   - **"Application settings"** ← Click this tab
   - "Connection strings"
   - "Path mappings"
   - etc.

### Step 3: Add Application Settings

1. **Click on the "Application settings" tab** at the top of the page (next to "General settings")
2. You'll see a table/list of existing application settings (if any)
3. Click the **+ New application setting** button (usually appears as a blue button at the top of the table, or in the table header row)
4. A dialog will open where you can enter:
   - **Name**: The environment variable name (e.g., `SUPABASE_URL`)
   - **Value**: The environment variable value (e.g., `https://xxxxx.supabase.co`)
5. Click **OK** to save that setting
6. Repeat steps 3-5 for each environment variable

Add the following application settings:

| Name                | Value                     | Example                                   |
| ------------------- | ------------------------- | ----------------------------------------- |
| `SUPABASE_URL`      | Your Supabase project URL | `https://xxxxx.supabase.co`               |
| `SUPABASE_ANON_KEY` | Your Supabase anon key    | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `UMAMI_API_KEY`     | Your Umami API key        | `api_BWL6tIwwZ8e5Zjctr0QQwftXbc2OVILQ`    |
| `UMAMI_WEBSITE_ID`  | Your Umami website ID     | `4c0162c3-3a17-4187-a16a-161b50c79bbd`    |
| `UMAMI_API_URL`     | Umami API URL (optional)  | `https://api.umami.is`                    |

### Step 4: Save Changes

1. Click **Save** at the top
2. Azure will restart your app with the new environment variables

### Alternative: Using Azure CLI

You can also set environment variables using Azure CLI:

```bash
az webapp config appsettings set \
  --name webapp-frontend-cnwebadmin \
  --resource-group YOUR_RESOURCE_GROUP \
  --settings \
    SUPABASE_URL="https://xxxxx.supabase.co" \
    SUPABASE_ANON_KEY="your-anon-key" \
    UMAMI_API_KEY="your-api-key" \
    UMAMI_WEBSITE_ID="your-website-id" \
    UMAMI_API_URL="https://api.umami.is"
```

---

## Troubleshooting

### Build fails with "Missing Supabase environment variables"

- ✅ Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in GitHub Secrets
- ✅ Verify the values are correct (not placeholder values)
- ✅ Ensure the workflow file references the secrets correctly

### Build fails with "UMAMI_API_KEY environment variable is not set"

- ✅ Check that `UMAMI_API_KEY` is set in GitHub Secrets
- ✅ Verify the API key is valid and active

### App works locally but fails in Azure

- ✅ Check that all environment variables are set in Azure App Service Configuration
- ✅ Verify the values match your local `.env.local` file
- ✅ Restart the Azure App Service after setting environment variables

### How to verify environment variables are set

**Local:**

```bash
cat .env.local
```

**GitHub Actions:**

- Check the workflow run logs (they won't show the actual values, but you'll see if they're missing)

**Azure:**

- Go to Azure Portal → Your App Service → Configuration → Application settings
- Or use Azure CLI: `az webapp config appsettings list --name webapp-frontend-cnwebadmin --resource-group YOUR_RESOURCE_GROUP`

---

## Security Best Practices

1. ✅ **Never commit `.env.local` to git** - It should be in `.gitignore`
2. ✅ **Use GitHub Secrets** - Never hardcode secrets in workflow files
3. ✅ **Rotate keys regularly** - Update secrets periodically
4. ✅ **Use different keys for dev/staging/production** - Don't share keys across environments
5. ✅ **Restrict access** - Only grant access to secrets to those who need it

---

## Quick Reference Checklist

### For Local Development:

- [ ] Create `.env.local` file
- [ ] Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- [ ] Add `UMAMI_API_KEY` and `UMAMI_WEBSITE_ID`
- [ ] Test with `npm run dev`

### For GitHub Actions:

- [ ] Add `SUPABASE_URL` to GitHub Secrets
- [ ] Add `SUPABASE_ANON_KEY` to GitHub Secrets
- [ ] Add `UMAMI_API_KEY` to GitHub Secrets
- [ ] Add `UMAMI_WEBSITE_ID` to GitHub Secrets (optional)
- [ ] Add `UMAMI_API_URL` to GitHub Secrets (optional)
- [ ] Verify workflow file uses `${{ secrets.VARIABLE_NAME }}`

### For Azure App Service:

- [ ] Add `SUPABASE_URL` to Application Settings
- [ ] Add `SUPABASE_ANON_KEY` to Application Settings
- [ ] Add `UMAMI_API_KEY` to Application Settings
- [ ] Add `UMAMI_WEBSITE_ID` to Application Settings (optional)
- [ ] Add `UMAMI_API_URL` to Application Settings (optional)
- [ ] Save and restart the app

---

Need help? Check the error messages in your build logs or Azure App Service logs for specific missing variables.
