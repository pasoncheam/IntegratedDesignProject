# Quick Testing Guide

## 🚀 Fast Track: Test Analysis in 5 Steps

### Step 1: Install Python Dependencies
```powershell
pip install -r analysis/requirements.txt
```

### Step 2: Get Firebase Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → ⚙️ Settings → Service Accounts
3. Click "Generate New Private Key"
4. Save as `serviceAccountKey.json` in the **project root** (where `package.json` is)

### Step 3: Run the Script
```powershell
python analysis/analyze.py
```

You should see:
```
✓ Firebase initialized from serviceAccountKey.json
✓ Fetched sensor data: {...}
✓ Risk Level: LOW
✓ Graph saved to analysis_graph.png
✓ Analysis complete!
```

### Step 4: Copy Outputs to Public Folder
```powershell
# Create directory if it doesn't exist
New-Item -ItemType Directory -Force -Path public/analysis

# Copy files
Copy-Item analysis_graph.png public/analysis/
Copy-Item analysis_summary.json public/analysis/
Copy-Item analysis_summary.txt public/analysis/
```

### Step 5: View on Website
```powershell
npm run dev
```
Then open: `http://localhost:5173/analytics`

You should see the graph and summary at the top of the page!

---

## ✅ Checklist

- [ ] Python 3.10+ installed
- [ ] Dependencies installed (`pip install -r analysis/requirements.txt`)
- [ ] `serviceAccountKey.json` in project root
- [ ] Firebase Realtime Database has data at `sensors/latest`
- [ ] Script runs without errors
- [ ] Files copied to `public/analysis/`
- [ ] Website displays the analysis correctly

---

## 🔧 Common Issues

**"Firebase credentials not found"**
→ Make sure `serviceAccountKey.json` is in the project root, not in `analysis/` folder

**"No data found"**
→ Check Firebase Database has data at path `sensors/latest`

**Graph not showing**
→ Check browser console (F12) for 404 errors
→ Verify files are in `public/analysis/` not `analysis/`

**Old data showing**
→ Hard refresh the page (Ctrl+F5)
→ Check the timestamp in the summary

---

## 📝 Next Steps for GitHub Actions

1. **Add Secret to GitHub:**
   - Repository → Settings → Secrets → Actions
   - New secret: `FIREBASE_SERVICE_ACCOUNT_JSON`
   - Value: Copy entire contents of `serviceAccountKey.json`

2. **Test Workflow:**
   - Go to Actions tab
   - Run "Automated Analysis" workflow manually
   - Check it completes and commits files

3. **Verify on Live Site:**
   - Wait a few minutes for GitHub Pages to update
   - Check your live site's Analytics page

