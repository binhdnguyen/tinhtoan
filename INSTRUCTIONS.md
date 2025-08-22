# PU Calculator Google Sheets Integration Setup Guide

## Step-by-Step Instructions

### Step 1: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ Create"** to create a new blank spreadsheet
3. Rename the spreadsheet to something like **"PU Calculator Data"**
4. **Copy the Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit#gid=0
                                         ^^^^^^^^^^^^^^^^^^
   ```
   Save this ID - you'll need it in Step 3!

### Step 2: Set Up Google Apps Script

1. **Open Google Apps Script**: Go to [script.google.com](https://script.google.com)

2. **Create New Project**:
   - Click **"+ New Project"**
   - The project will open with a default `Code.gs` file

3. **Replace Default Code**:
   - Delete all existing code in `Code.gs`
   - Copy the entire content from `google-apps-script.js` (in this repository)
   - Paste it into the `Code.gs` file

4. **Configure Spreadsheet ID**:
   - Find this line in the code (around line 13):
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your spreadsheet ID
   ```
   - Replace `YOUR_SPREADSHEET_ID` with the actual ID you copied in Step 1
   - **Example**: If your spreadsheet URL is:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   ```
   - Then your line should look like:
   ```javascript
   const SPREADSHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
   ```

5. **Save the Project**:
   - Click **"Save"** (Ctrl+S)
   - Give your project a name like **"PU Calculator Integration"**

### Step 3: Test the Script

1. **Run Test Function**:
   - In the function dropdown, select `testScript`
   - Click **"Run"**
   - You'll be prompted to authorize permissions - click **"Review Permissions"**
   - Choose your Google account
   - Click **"Advanced"** → **"Go to [Project Name] (unsafe)"**
   - Click **"Allow"**

2. **Check Your Spreadsheet**:
   - Go back to your Google Spreadsheet
   - You should see a new **"Part1"** sheet with test data
   - Headers should be properly formatted (blue background, white text)

### Step 4: Deploy as Web App

1. **Deploy the Script**:
   - Click **"Deploy"** → **"New Deployment"**
   - Click the gear icon ⚙️ next to "Type"
   - Select **"Web app"**

2. **Configure Deployment**:
   - **Description**: "PU Calculator Data Integration"
   - **Execute as**: "Me (your-email@gmail.com)"
   - **Who has access**: "Anyone" (recommended) or "Anyone with Google account"

3. **Deploy**:
   - Click **"Deploy"**
   - **Important**: Copy the **Web app URL** that appears
   - It will look like: `https://script.google.com/macros/s/AKfy.../exec`

### Step 5: Update Your Config File

1. **Open your local `config.js` file**

2. **Update the URL**:
   ```javascript
   const CONFIG = {
       GOOGLE_SHEETS_WEBAPP_URL: 'https://script.google.com/macros/s/YOUR_NEW_WEBAPP_URL_HERE/exec'
   };
   ```

3. **Replace** `YOUR_NEW_WEBAPP_URL_HERE` with the Web app URL from Step 4

### Step 6: Test the Integration

1. **Open your calculator**: Open `index.html` in your browser

2. **Test Each Part**:
   - **Part 1**: Enter values, calculate, and check if data appears in "Part1" sheet
   - **Part 2**: Enter test data, calculate, and check "Part2" sheet
   - **Part 3**: Enter adjustment parameters, calculate, and check "Part3" sheet

3. **Verify Success**:
   - You should see green notifications: "✓ Copied to clipboard!" and "💾 Data saved to Google Sheets!"
   - Each calculation should appear in its respective sheet with proper formatting

## Troubleshooting

### Problem: "TypeError: Cannot read properties of undefined (reading 'getRange')"
**This is the most common error!**
**Root Cause**: The Spreadsheet ID is not properly configured in the Google Apps Script.

**Solutions**:
1. **Check Spreadsheet ID Format**:
   - Make sure you copied only the ID part from the URL, not the entire URL
   - ✅ Correct: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
   - ❌ Wrong: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`

2. **Verify the Line in Code**:
   - In Google Apps Script, find line 13:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
   ```
   - Replace `YOUR_SPREADSHEET_ID` with your actual ID (keep the quotes!)

3. **Test Access**:
   - Run the `testScript` function to verify the script can access your spreadsheet
   - If it fails, check that your spreadsheet is not deleted or moved to trash

### Problem: "Data saved" notification doesn't appear
**Solution**: Check that your Web app URL is correct in `config.js`

### Problem: No data appears in sheets
**Solutions**:
1. Verify the Spreadsheet ID is correct in the Google Apps Script
2. Make sure the Web app deployment is set to "Anyone" access
3. Check that you authorized all required permissions

### Problem: Error messages in browser console
**Solutions**:
1. Open browser developer tools (F12) → Console tab
2. Look for specific error messages
3. Common fixes:
   - Re-deploy the Web app with updated permissions
   - Double-check the Spreadsheet ID format
   - Ensure the spreadsheet is not deleted or moved

### Problem: Sheets are created but headers are wrong
**Solution**: Delete the sheets and let the script recreate them with proper headers

### Problem: Permission denied errors
**Solutions**:
1. Re-run the authorization flow in Google Apps Script
2. Make sure you're using the same Google account for both the spreadsheet and the script
3. Check that the spreadsheet hasn't been moved to a different Google account

## Expected Sheet Structure

### Part1 Sheet Columns:
| Timestamp | Language | Line Speed | Output | Concentration | Ratio | Calculated Type | Calculated Value | Calculated Unit | Material 1s | Material 4s | Material 6s |

### Part2 Sheet Columns:
| Timestamp | Language | Line Speed | Test Time | Polyol Weight | Iso Weight | Polyol RPM | Iso RPM | Calculated Ratio | Output (g/s) | Consumption (g/m) |

### Part3 Sheet Columns:
| Timestamp | Language | New Line Speed | New Consumption | New Ratio | New Output (g/s) | Polyol Weight (g/s) | Iso Weight (g/s) | Polyol RPM | Iso RPM | 4s Breakdown | 6s Breakdown |

## Security Notes

- The `config.js` file is already in `.gitignore` to prevent committing sensitive URLs
- The Google Apps Script runs with your permissions but accepts data from "Anyone"
- Consider changing access to "Anyone with Google account" for additional security

## Support

If you encounter issues:
1. Check the Google Apps Script execution logs (View → Logs)
2. Verify all URLs and IDs are correctly copied
3. Test the `testScript` function in Google Apps Script first
4. Ensure your browser allows the calculator to make network requests

---

✅ **Success**: When everything is working, each calculator part will automatically save data to its dedicated sheet with proper organization and timestamps!