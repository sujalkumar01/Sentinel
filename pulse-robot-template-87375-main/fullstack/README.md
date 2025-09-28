# SatelliteWatch - AI-Powered Vehicle Detection System

A full-stack application for detecting and analyzing vehicles in satellite imagery using YOLO models and AI-powered intelligence summaries.

## 🚀 Features

- **Image Upload & Analysis**: Upload satellite/aerial images for vehicle detection
- **Coordinate-Based Capture**: Enter coordinates to capture images from Google Maps
- **AI-Powered Intelligence**: Generate detailed analysis reports using FastRouter API
- **Real-time Processing**: Live processing overlay with progress tracking
- **Modern UI**: Beautiful, responsive interface with dark theme support
- **Location Tracking**: Track and analyze vehicle patterns over time

## 🔧 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Router
- Lottie animations

**Backend:**
- Node.js + Express
- Python + YOLO (Ultralytics)
- FastRouter API integration
- Multer for file uploads

## 🛡️ Security Notice

**IMPORTANT**: This project contains sensitive API keys and should be configured properly before deployment.

### Required Environment Variables

1. **Frontend** (create `.env` file in root):
```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_FASTROUTER_API_KEY=your_fastrouter_api_key
VITE_BACKEND_API_URL=http://localhost:8003
```

2. **Backend** (create `.env` file in backend/):
```bash
FASTROUTER_API_KEY=your_fastrouter_api_key
PORT=8003
NODE_ENV=development
```

### Security Checklist Before Pushing to GitHub

- ✅ API keys removed from source code
- ✅ Environment variables properly configured
- ✅ .gitignore updated to exclude sensitive files
- ✅ Model files excluded (can be large)
- ✅ No hardcoded credentials in code

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/35d72d2e-6e25-40e5-9b0c-c0d1a7c1b727) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/35d72d2e-6e25-40e5-9b0c-c0d1a7c1b727) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
