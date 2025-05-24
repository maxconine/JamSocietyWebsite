// === 🔐 FIRESTORE AUTH ===
const FIREBASE_PROJECT_ID = 'jamsoc-2473e';
const FIREBASE_CLIENT_EMAIL = 'firebase-adminsdk-fbsvc@jamsoc-2473e.iam.gserviceaccount.com';
const FIREBASE_PRIVATE_KEY = `PRIVATE'

function getFirestoreToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };
  const claimSet = {
    iss: FIREBASE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const encHeader = Utilities.base64EncodeWebSafe(JSON.stringify(header));
  const encClaim = Utilities.base64EncodeWebSafe(JSON.stringify(claimSet));
  const signature = Utilities.base64EncodeWebSafe(
    Utilities.computeRsaSha256Signature(`${encHeader}.${encClaim}`, FIREBASE_PRIVATE_KEY)
  );
  const jwt = `${encHeader}.${encClaim}.${signature}`;

  const response = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'post',
    payload: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    },
  });

  return JSON.parse(response.getContentText()).access_token;
}

// 🔄 Firestore ➜ Sheet (Sync checkout info and new website items)
function importFirestoreToSheet() {
  const token = getFirestoreToken();
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/equipment`;
  const response = UrlFetchApp.fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = JSON.parse(response.getContentText());
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Equipment");

  // Only add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
  const headers = [
      "Image", "Item Code", "Item Name", "Location", "Type", "Description", "Value", "Owner",
      "Condition", "Notes", "Label Type", "Status", "Last Checked Out Name", "Last Checked Out Email",
      "Checkout Description", "Reason For Checkout", "Last Checked Out Date", "Last Returned Date",
      "Last Returned Notes"
  ];
  sheet.appendRow(headers);
  }

  if (!data.documents) return;

  // Get existing items and their checkout info
  const existingItems = new Map();
  if (sheet.getLastRow() > 1) {
    const existingData = sheet.getRange(2, 1, sheet.getLastRow() - 1, 19).getValues();
    existingData.forEach(row => {
      existingItems.set(row[1], { // Use Item Code as key
        row: row,
        rowIndex: existingData.indexOf(row) + 2 // +2 because we start from row 2 and index is 0-based
      });
    });
  }

  // Process each item from Firestore
  for (const doc of data.documents) {
    const f = doc.fields || {};
    const itemCode = f.code?.stringValue || "";
    if (!itemCode) continue;

    const existingItem = existingItems.get(itemCode);
    
    if (existingItem) {
      // Update only checkout info for existing items
      const row = existingItem.row;
      const rowIndex = existingItem.rowIndex;
      
      // Only update if checkout info has changed
      if (row[11] !== f.status?.stringValue || // Status
          row[12] !== f.lastCheckedOutByName?.stringValue || // Last Checked Out Name
          row[13] !== f.lastCheckedOutByEmail?.stringValue || // Last Checked Out Email
          row[14] !== f.checkoutDescription?.stringValue || // Checkout Description
          row[15] !== f.reason?.stringValue || // Reason
          row[16] !== f.lastCheckedOutDate?.stringValue || // Last Checked Out Date
          row[17] !== f.lastReturnedDate?.stringValue || // Last Returned Date
          row[18] !== f.lastReturnedNotes?.stringValue) { // Last Returned Notes
        
        sheet.getRange(rowIndex, 12, 1, 7).setValues([[
          f.status?.stringValue || "Available",
          f.lastCheckedOutByName?.stringValue || "",
          f.lastCheckedOutByEmail?.stringValue || "",
          f.checkoutDescription?.stringValue || "",
          f.reason?.stringValue || "",
          f.lastCheckedOutDate?.stringValue || "",
          f.lastReturnedDate?.stringValue || "",
          f.lastReturnedNotes?.stringValue || ""
        ]]);
      }
    } else {
      // Add new items from website
    sheet.appendRow([
        f.image?.stringValue || "", // Image
        itemCode, // Item Code
        f.name?.stringValue || "", // Item Name
        f.location?.stringValue || "", // Location
        f.type?.stringValue || "", // Type
        f.description?.stringValue || "", // Description
        f.price?.doubleValue || "", // Value
        f.owner?.stringValue || "", // Owner
        f.condition?.stringValue || "", // Condition
        f.notes?.stringValue || "", // Notes
        f.labelType?.stringValue || "", // Label Type
        f.status?.stringValue || "Available", // Status
        f.lastCheckedOutByName?.stringValue || "", // Last Checked Out Name
        f.lastCheckedOutByEmail?.stringValue || "", // Last Checked Out Email
        f.checkoutDescription?.stringValue || "", // Checkout Description
        f.reason?.stringValue || "", // Reason For Checkout
        f.lastCheckedOutDate?.stringValue || "", // Last Checked Out Date
        f.lastReturnedDate?.stringValue || "", // Last Returned Date
        f.lastReturnedNotes?.stringValue || "" // Last Returned Notes
    ]);
    }
  }
}

// 🔁 Sheet ➜ Firestore (Add new items from sheet)
function pushSheetToFirestore() {
  const token = getFirestoreToken();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Equipment");
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const itemCode = row[1]; // Item Code is in column B
    if (!itemCode) continue;

    // Check if item exists in Firestore
    const checkUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/equipment/${itemCode}`;
    const checkResponse = UrlFetchApp.fetch(checkUrl, {
      headers: { Authorization: `Bearer ${token}` },
      muteHttpExceptions: true
    });
    
    // Only add if item doesn't exist in Firestore
    if (checkResponse.getResponseCode() !== 200) {
    const fields = {
        image: { stringValue: row[0] || "" },
        code: { stringValue: row[1] || "" },
        name: { stringValue: row[2] || "" },
        location: { stringValue: row[3] || "" },
        type: { stringValue: row[4] || "" },
        description: { stringValue: row[5] || "" },
        price: { doubleValue: parseFloat(row[6]) || 0 },
        owner: { stringValue: row[7] || "" },
        condition: { stringValue: row[8] || "" },
        notes: { stringValue: row[9] || "" },
      labelType: { stringValue: row[10] || "" },
        status: { stringValue: row[11] || "Available" },
        lastCheckedOutByName: { stringValue: row[12] || "" },
        lastCheckedOutByEmail: { stringValue: row[13] || "" },
        checkoutDescription: { stringValue: row[14] || "" },
        reason: { stringValue: row[15] || "" },
        lastCheckedOutDate: { stringValue: row[16] || "" },
        lastReturnedDate: { stringValue: row[17] || "" },
        lastReturnedNotes: { stringValue: row[18] || "" }
      };

      UrlFetchApp.fetch(checkUrl, {
        method: "put",
      contentType: "application/json",
      payload: JSON.stringify({ fields }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      muteHttpExceptions: true,
    });
    }
  }
}

// Set up triggers for automatic syncing
function createTimeDrivenTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Create new triggers
  ScriptApp.newTrigger('importFirestoreToSheet')
    .timeBased()
    .everyHours(1)
    .create();

  ScriptApp.newTrigger('pushSheetToFirestore')
    .timeBased()
    .everyHours(1)
    .create();
}

// Add a menu to the spreadsheet
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Equipment Sync')
    .addItem('Import from Firestore', 'importFirestoreToSheet')
    .addItem('Push to Firestore', 'pushSheetToFirestore')
    .addItem('Set up Auto Sync', 'createTimeDrivenTriggers')
    .addToUi();
} 