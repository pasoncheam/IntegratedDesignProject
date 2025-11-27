# Flood Risk Prediction Analysis

This directory contains the automated Python analysis script that runs via GitHub Actions to generate flood risk predictions based on Firebase sensor data.

## Files

- `analyze.py` - Main analysis script that fetches data, performs analysis, and generates outputs
- `requirements.txt` - Python dependencies
- `README.md` - This file

## Outputs

The script generates:
- `analysis_graph.png` - Visualization showing water level, rainfall, risk score, and environmental conditions
- `analysis_summary.json` - Structured JSON with analysis results and metadata
- `analysis_summary.txt` - Human-readable text summary

These files are automatically copied to `public/analysis/` by the GitHub Actions workflow and committed to the repository for the website to display.

## Local Testing

### Prerequisites

1. **Python 3.10+** installed
2. **Firebase Service Account Key** - Download from Firebase Console:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in the project root (NOT in the analysis folder)

### Step-by-Step Testing Instructions

#### Step 1: Install Dependencies

```bash
# Navigate to the project root
cd "C:\Users\user\Documents\Degree\Y4S1\BER4023_Integrated Design Project 2\Website"

# Install Python dependencies
pip install -r analysis/requirements.txt
```

#### Step 2: Set Up Firebase Credentials

1. **Download Service Account Key:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings (gear icon) → Service Accounts
   - Click "Generate New Private Key"
   - Save the downloaded JSON file as `serviceAccountKey.json` in the **project root** (same level as `package.json`)

2. **Verify the file location:**
   ```
   Website/
   ├── serviceAccountKey.json  ← Place it here
   ├── package.json
   ├── analysis/
   │   └── analyze.py
   └── ...
   ```

#### Step 3: Verify Firebase Database Path

The script reads from `sensors/latest` in your Firebase Realtime Database. Make sure:
- Your Firebase Realtime Database is enabled
- Data exists at path `sensors/latest` with structure:
  ```json
  {
    "waterLevel": 45,
    "rainfall": 12,
    "humidity": 65,
    "temperature": 28,
    "timestamp": 1234567890
  }
  ```

#### Step 4: Run the Analysis Script

```bash
# From the project root
python analysis/analyze.py
```

**Expected output:**
```
============================================================
AURA Flood Risk Prediction Analysis
============================================================

✓ Firebase initialized from serviceAccountKey.json

[1/4] Fetching sensor data from Firebase...
✓ Fetched sensor data: {...}

[2/4] Performing flood risk analysis...
✓ Risk Level: LOW
✓ Risk Score: 15/100

[3/4] Generating visualization graph...
✓ Graph saved to analysis_graph.png

[4/4] Creating analysis summary...
✓ Text summary saved to analysis_summary.txt
✓ JSON summary saved to analysis_summary.json

============================================================
✓ Analysis complete! All outputs generated successfully.
============================================================
```

#### Step 5: Copy Outputs to Public Directory

After running the script, manually copy the outputs to the public directory:

```bash
# Windows PowerShell
mkdir -p public/analysis
copy analysis_graph.png public/analysis/
copy analysis_summary.json public/analysis/
copy analysis_summary.txt public/analysis/
```

Or manually:
1. Copy `analysis_graph.png` → `public/analysis/analysis_graph.png`
2. Copy `analysis_summary.json` → `public/analysis/analysis_summary.json`
3. Copy `analysis_summary.txt` → `public/analysis/analysis_summary.txt`

#### Step 6: Test on Local Website

1. **Build and serve the website:**
   ```bash
   npm run build
   npm run preview
   # Or use your dev server: npm run dev
   ```

2. **Navigate to the Analytics page:**
   - Open `http://localhost:5173/analytics` (or your dev server URL)
   - You should see:
     - The analysis graph at the top
     - The text summary below the graph
     - All content styled and displayed correctly

#### Step 7: Commit and Push (Optional)

If you want to test the full GitHub Pages workflow:

```bash
git add public/analysis/
git commit -m "test: add analysis outputs for testing"
git push
```

Then check your GitHub Pages site to see if the analysis displays correctly.

## GitHub Actions Setup

### Required Secret

Add this secret to your GitHub repository:

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `FIREBASE_SERVICE_ACCOUNT_JSON`
5. Value: Paste the **entire contents** of your `serviceAccountKey.json` file (as a single-line JSON string)

### Workflow Schedule

The workflow runs:
- **Every minute** (cron: `* * * * *`) - Note: GitHub may throttle very frequent runs
- **Manually** via "Run workflow" button in Actions tab

### Testing GitHub Actions

1. **Push the workflow file** (if not already committed)
2. **Add the secret** (see above)
3. **Trigger manually:**
   - Go to Actions tab
   - Select "Automated Analysis" workflow
   - Click "Run workflow" → "Run workflow"
4. **Check the run:**
   - Wait for it to complete
   - Check the "Commit and push updates" step
   - Verify `public/analysis/` files were updated

## Troubleshooting

### "Firebase credentials not found"
- Make sure `serviceAccountKey.json` is in the project root (not in `analysis/` folder)
- For GitHub Actions, verify the `FIREBASE_SERVICE_ACCOUNT_JSON` secret is set correctly

### "No data found at path 'sensors/latest'"
- Check Firebase Realtime Database rules allow read access
- Verify data exists at that path
- Check the database URL in your service account key matches your project

### Graph not displaying on website
- Verify files are in `public/analysis/` (not `analysis/`)
- Check browser console for 404 errors
- Ensure files were committed and pushed to GitHub

### Analysis shows old data
- The website caches images - try hard refresh (Ctrl+F5)
- Check the timestamp in the summary to verify it's recent
- GitHub Actions may take a few minutes to run and commit

## Customization

### Adjust Risk Thresholds

Edit `analyze.py` and modify these constants:
```python
WATER_LEVEL_SAFE = 50      # cm
WATER_LEVEL_WARNING = 100  # cm
WATER_LEVEL_DANGER = 150   # cm

RAINFALL_SAFE = 5          # mm
RAINFALL_WARNING = 20      # mm
RAINFALL_DANGER = 50       # mm
```

### Change Database Path

If your sensor data is at a different path, modify:
```python
FIREBASE_DB_PATH = "sensors/latest"  # Change this
```

### Modify Analysis Logic

Edit the `analyze_flood_risk()` function in `analyze.py` to customize:
- Risk calculation algorithm
- Factor weights
- Recommendations
- Risk level thresholds

## Support

For issues or questions:
1. Check the GitHub Actions logs for errors
2. Verify Firebase credentials and database access
3. Test locally first before relying on automated runs

