# Google Sheets Setup Guide for Enquire Now Form

This guide will help you set up Google Sheets to receive form submissions when hosting on GitHub Pages. This is completely FREE and unlimited!

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it something like "AURA Enquiries" or "Website Form Submissions"
4. In the first row (Row 1), add these column headers:
   - **A1**: Timestamp
   - **B1**: Full Name
   - **C1**: Email
   - **D1**: Company
   - **E1**: Phone
   - **F1**: Product
   - **G1**: Message
5. Format the header row (bold, background color, etc.) to make it look nice
6. **Copy the Sheet ID** from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
   - The `YOUR_SHEET_ID` is what you need (keep this for later)

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code and paste this script:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Prepare the row data matching your column headers
    var rowData = [
      data.timestamp || new Date(),           // Column A: Timestamp
      data.fullName || '',                    // Column B: Full Name
      data.email || '',                       // Column C: Email
      data.company || '',                     // Column D: Company
      data.phone || '',                       // Column E: Phone
      data.product || '',                     // Column F: Product
      data.message || ''                      // Column G: Message
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({result: 'success', row: rowData})
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({result: 'error', error: error.toString()})
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (💾 icon) and name your project (e.g., "AURA Form Handler")

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the **Select type** gear icon ⚙️ → **Web app**
3. Configure the deployment:
   - **Description**: "AURA Form Handler" (or any name)
   - **Execute as**: "Me" (your email)
   - **Who has access**: **"Anyone"** (important!)
4. Click **Deploy**
5. **Authorize access** when prompted:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to [Your Project Name] (unsafe)"
   - Click "Allow"
6. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
   ⚠️ **IMPORTANT**: Keep this URL safe - you'll need it in Step 4!

## Step 4: Update Your Code

1. Open `src/components/EnquireNow.tsx` in your project
2. Find this line near the top:
   ```typescript
   const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL";
   ```
3. Replace it with your Web App URL from Step 3:
   ```typescript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
   ```
4. Save the file

## Step 5: Test It!

1. Build your website: `npm run build`
2. Deploy to GitHub Pages
3. Fill out the "Enquire Now" form on your website
4. Check your Google Sheet - you should see a new row with the submitted data!

## Troubleshooting

### Data not appearing in sheet?
- Check that you set "Who has access" to "Anyone" in Step 3
- Verify the column headers in your sheet match exactly (case-sensitive)
- Check the Apps Script execution logs: **Executions** tab in Apps Script editor

### "Configuration Error" message?
- Make sure you updated `GOOGLE_SCRIPT_URL` in `EnquireNow.tsx`
- Verify the URL is correct and includes `/exec` at the end

### CORS errors?
- The code uses `mode: "no-cors"` which is correct for Google Apps Script
- If you see errors, make sure the Web App is deployed and accessible

### Permission errors?
- Make sure you clicked "Authorize access" and granted permissions
- Try redeploying the Web App if needed

## Security Notes

- The Web App URL is public, but only your script can write to your sheet
- Consider adding spam protection (rate limiting, CAPTCHA) for production
- You can restrict by domain in Apps Script if needed
- The sheet is private by default - only you can access it unless you share it

## Customization

### Change column order?
Update the `rowData` array in the Apps Script to match your column order.

### Add more fields?
1. Add new column headers in your Google Sheet
2. Add the field to the form in `EnquireNow.tsx`
3. Add it to `formData` in the `handleSubmit` function
4. Add it to `rowData` in the Google Apps Script

### Format the timestamp?
The script uses ISO format. You can change it in the Apps Script:
```javascript
data.timestamp || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss")
```

## That's it! 🎉

Your form submissions will now automatically appear in your Google Sheet. No email limits, completely free, and you can view all submissions in one place!


