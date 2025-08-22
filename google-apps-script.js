/**
 * Google Apps Script for PU Calculator Google Sheets Integration
 * This script should be deployed as a web app in Google Apps Script
 * and the deployment URL should be used in config.js
 */

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the spreadsheet by ID (replace 'YOUR_SPREADSHEET_ID' with your actual ID)
    const SPREADSHEET_ID = '1SaAmagB7DRkIZZ2OhZ1CWKmzEQdyvTF7KZipYFw7WfU'; // Replace with your spreadsheet ID
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Determine which sheet to use based on the part
    let sheet;
    const sheetName = data.sheetName || 'Sheet1'; // Use sheetName from data
    
    try {
      sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        // Create the sheet if it doesn't exist
        console.log(`Creating new sheet: ${sheetName}`);
        sheet = spreadsheet.insertSheet(sheetName);
        setupSheetHeaders(sheet, data.part);
      } else {
        // Check if headers exist (if row 1 is empty, add headers)
        const headerRange = sheet.getRange(1, 1);
        if (!headerRange.getValue()) {
          setupSheetHeaders(sheet, data.part);
        }
      }
    } catch (error) {
      console.error(`Error accessing sheet ${sheetName}:`, error);
      // Fallback to creating a new sheet
      sheet = spreadsheet.insertSheet(sheetName);
      setupSheetHeaders(sheet, data.part);
    }
    
    // Add timestamp
    const timestamp = new Date();
    
    // Process data based on part type
    if (data.part === 'part1') {
      appendPart1Data(sheet, data, timestamp);
    } else if (data.part === 'part2') {
      appendPart2Data(sheet, data, timestamp);
    } else if (data.part === 'part3') {
      appendPart3Data(sheet, data, timestamp);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: `Data saved to ${sheetName}`,
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing request:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setupSheetHeaders(sheet, part) {
  try {
    console.log(`Setting up headers for ${part} in sheet:`, sheet.getName());
    
    if (part === 'part1') {
      sheet.getRange(1, 1, 1, 12).setValues([[
        'Timestamp', 'Language', 'Line Speed (Input)', 'Output (Input)', 
        'Concentration (Input)', 'Ratio (Input)', 'Calculated Type', 
        'Calculated Value', 'Calculated Unit', 'Material 1s', 'Material 4s', 'Material 6s'
      ]]);
    } else if (part === 'part2') {
      sheet.getRange(1, 1, 1, 11).setValues([[
        'Timestamp', 'Language', 'Line Speed', 'Test Time', 'Polyol Weight', 
        'Iso Weight', 'Polyol RPM', 'Iso RPM', 'Calculated Ratio', 
        'Output (g/s)', 'Consumption (g/m)'
      ]]);
    } else if (part === 'part3') {
      sheet.getRange(1, 1, 1, 12).setValues([[
        'Timestamp', 'Language', 'New Line Speed', 'New Consumption', 'New Ratio', 
        'New Output (g/s)', 'Polyol Weight (g/s)', 'Iso Weight (g/s)', 
        'Polyol RPM', 'Iso RPM', '4s Breakdown', '6s Breakdown'
      ]]);
    }
    
    // Style the header row
    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    
    console.log(`Headers successfully set up for ${part}`);
  } catch (error) {
    console.error(`Error setting up headers for ${part}:`, error);
    throw error;
  }
}

function appendPart1Data(sheet, data, timestamp) {
  // Format material breakdown similar to Part 3 format
  const material1s = data.materialBreakdown && data.materialBreakdown['1s'] ? 
    `Total: ${data.materialBreakdown['1s'].total}g (Pol: ${data.materialBreakdown['1s'].pol}g, Iso: ${data.materialBreakdown['1s'].iso}g)` : '';
  const material4s = data.materialBreakdown && data.materialBreakdown['4s'] ? 
    `Total: ${data.materialBreakdown['4s'].total}g (Pol: ${data.materialBreakdown['4s'].pol}g, Iso: ${data.materialBreakdown['4s'].iso}g)` : '';
  const material6s = data.materialBreakdown && data.materialBreakdown['6s'] ? 
    `Total: ${data.materialBreakdown['6s'].total}g (Pol: ${data.materialBreakdown['6s'].pol}g, Iso: ${data.materialBreakdown['6s'].iso}g)` : '';

  const row = [
    timestamp,
    data.language,
    data.inputs.lineSpeed || 0,
    data.inputs.output || 0,
    data.inputs.concentration || 0,
    data.inputs.ratio || 0,
    data.results.calculatedType || '',
    data.results.calculatedValue || '',
    data.results.calculatedUnit || '',
    material1s,
    material4s,
    material6s
  ];
  
  sheet.appendRow(row);
}

function appendPart2Data(sheet, data, timestamp) {
  const row = [
    timestamp,
    data.language,
    data.inputs.linespeed || 0,
    data.inputs.testTime || 0,
    data.inputs.polyolWeight || 0,
    data.inputs.isoWeight || 0,
    data.inputs.polyolRpm || 0,
    data.inputs.isoRpm || 0,
    data.results.ratio || '',
    data.results.outputGs || '',
    data.results.consumptionGM || ''
  ];
  
  sheet.appendRow(row);
}

function appendPart3Data(sheet, data, timestamp) {
  const timeBreakdown4s = data.results.timeBreakdown ? 
    `Total: ${data.results.timeBreakdown['4s'].total}g (Pol: ${data.results.timeBreakdown['4s'].polyol}g, Iso: ${data.results.timeBreakdown['4s'].iso}g)` : '';
  const timeBreakdown6s = data.results.timeBreakdown ? 
    `Total: ${data.results.timeBreakdown['6s'].total}g (Pol: ${data.results.timeBreakdown['6s'].polyol}g, Iso: ${data.results.timeBreakdown['6s'].iso}g)` : '';
  
  const row = [
    timestamp,
    data.language,
    data.inputs.newLinespeed || 0,
    data.inputs.newConsumption || 0,
    data.inputs.newRatio || 0,
    data.results.newOutputGs || '',
    data.results.polyolWeightGs || '',
    data.results.isoWeightGs || '',
    data.results.polyolRpm || '',
    data.results.isoRpm || '',
    timeBreakdown4s,
    timeBreakdown6s
  ];
  
  sheet.appendRow(row);
}

// Test function to verify the script works
function testScript() {
  const testData = {
    part: 'part1',
    sheetName: 'Part1',
    language: 'en',
    inputs: {
      lineSpeed: 8,
      output: 88,
      concentration: 0,
      ratio: 1.65
    },
    results: {
      calculatedType: 'Concentration',
      calculatedValue: '660',
      calculatedUnit: 'g/m'
    },
    materialBreakdown: {
      '1s': { pol: '33.2', iso: '54.8', total: '88.0' },
      '4s': { pol: '132.8', iso: '219.2', total: '352.0' },
      '6s': { pol: '199.2', iso: '328.8', total: '528.0' }
    }
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  console.log(doPost(e));
}