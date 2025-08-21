# PU Machine Operation Parameters Calculator

A specialized calculator for polyurethane spraying process with Google Sheets integration.

## Features

- **Part 1**: Basic formula calculations (O = C × L)
- **Part 2**: Test data analysis
- **Part 3**: Parameter adjustment
- **Multi-language support**: English, Vietnamese, Thai, Chinese
- **Clipboard functionality**: Automatically copies results
- **Google Sheets integration**: Saves calculation data

## Setup for Google Sheets Integration

### Option 1: Using config.js (Recommended)

1. Copy `config.example.js` to `config.js`
2. Replace `YOUR_WEBAPP_URL_HERE` with your Google Apps Script webapp URL
3. The `config.js` file is automatically ignored by git for security

### Option 2: Direct Usage

The calculator will work without the config file using a fallback method.

## Security Note

The `config.js` file contains sensitive information and should not be committed to version control. It's already added to `.gitignore`.

## Usage

1. Open `index.html` in a web browser
2. Select your preferred language
3. Choose the appropriate calculator part (1, 2, or 3)
4. Enter your parameters
5. Click "Calculate" to get results and save to Google Sheets

## Google Sheets Data

Each calculation automatically saves:
- Timestamp
- Calculator part used
- Language selected
- All input parameters
- Calculated results
- Additional breakdown data