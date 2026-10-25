# Thadi (തടി) — Vercel & Firebase Deployment Walkthrough

This guide provides a 1:1 deployment workflow matching **Bucket_List_Maker** and **Traxpens**, enabling Google Authentication and Cloud Firestore synchronization on **Vercel** with automatic offline fallback.

---

## 1. Architecture Overview (1:1 with Traxpens & Bucket_List_Maker)

- **Frontend:** React + Vite + Tailwind CSS + Lucide Icons + Leaflet (Map).
- **Authentication:** Firebase Authentication with Google Sign-In Provider.
- **Database:** Cloud Firestore (`users/{uid}` document syncing profile, logs, budget, and weight history).
- **Hosting:** Vercel (Global Edge Network, automatic SSL, SPA routing via `vercel.json`).
- **Offline / Local-First Guard:** Works 100% offline via `localStorage` even before or without logging into Firebase.

---

## 2. Firebase Setup (Step-by-Step)

### Step 2.1: Create Firebase Project
1. Open [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
2. Click **"Add project"** (or select your existing project if you want to share with Traxpens / Bucket_List_Maker).
3. Name your project (e.g. `thadi-app` or `my-apps-hub`).
4. (Optional) Disable Google Analytics for faster setup, then click **Create project**.

### Step 2.2: Register Web App
1. On your Firebase Project Overview page, click the **Web icon (`</>`)** to add an app.
2. App nickname: `Thadi Web App`.
3. Do **NOT** check "Also set up Firebase Hosting" (we are deploying to **Vercel**).
4. Click **Register app**.
5. Copy the `firebaseConfig` keys shown on the screen.

### Step 2.3: Enable Google Authentication
1. In the Firebase left sidebar, navigate to **Build** → **Authentication**.
2. Click **Get Started**.
3. In the **Sign-in method** tab, click **Google**.
4. Toggle **Enable**.
5. Choose your project support email.
6. Click **Save**.

### Step 2.4: Create Cloud Firestore Database
1. In the left sidebar, navigate to **Build** → **Firestore Database**.
2. Click **Create database**.
3. Location: Choose `asia-south1 (Mumbai)` for ultra-low latency in India.
4. Security Rules: Select **Start in test mode** (or paste the production rules below).
5. Click **Create**.

#### Recommended Firestore Security Rules:
Go to **Firestore Database** → **Rules** tab, paste the following, and click **Publish**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
*(This ensures only you can read and write your personal nutrition and weight data).*

---

## 3. Local Environment Setup

In your project folder (`c:\Users\USER\Desktop\My Apps\Thadi`):

1. Create a file named `.env.local` (copy from `.env.example`):
```bash
cp .env.example .env.local
```
2. Paste your keys from Step 2.2 into `.env.local`:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=thadi-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=thadi-app
VITE_FIREBASE_STORAGE_BUCKET=thadi-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:...
VITE_FIREBASE_MEASUREMENT_ID=G-...
```

---

## 4. Deploying to Vercel (1:1 with Bucket_List_Maker)

### Option A: Via GitHub (Recommended)
1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Thadi"
   # Create a repo on github.com and link it:
   git remote add origin https://github.com/<your-username>/thadi.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/dashboard).
3. Click **"Add New..."** → **"Project"**.
4. Import your `thadi` repository.
5. In **Framework Preset**, select **Vite**.
6. Expand **Environment Variables** and add all the keys from your `.env.local`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
7. Click **Deploy**. Vercel will build and assign your URL: `https://thadi.vercel.app`.

### Option B: Via Vercel CLI
1. Open PowerShell in `c:\Users\USER\Desktop\My Apps\Thadi`.
2. Run:
   ```bash
   npx vercel
   ```
3. Follow the CLI prompts to link the project.
4. Add environment variables:
   ```bash
   npx vercel env add VITE_FIREBASE_API_KEY
   # (repeat for remaining variables)
   ```
5. Deploy to production:
   ```bash
   npx vercel --prod
   ```

---

## 5. Critical Final Step: Authorize Vercel Domain in Firebase
To allow Google Sign-in to work on your live Vercel URL:

1. Open [Firebase Console](https://console.firebase.google.com/) → **Authentication** → **Settings** tab.
2. Click **Authorized domains**.
3. Click **Add domain**.
4. Enter your Vercel domain (e.g. `thadi.vercel.app` or `thadi-app.vercel.app`).
5. Click **Done**.

Now Google Sign-In and Firestore synchronization will work across your phone, tablet, and laptop!
