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

// 🔄 Firestore ➜ Sheet
function importFirestoreToSheet() {
  const token = getFirestoreToken();
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/equipment`;
  const response = UrlFetchApp.fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = JSON.parse(response.getContentText());
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Equipment");
  sheet.clearContents();

  const headers = [
    "Item Code", "Item Name", "Location", "Type", "Description", "Value", "Owner",
    "Condition", "Notes", "Has Label", "Label Type", "Available",
    "Last Checked Out By", "Last Checked Out Date"
  ];
  sheet.appendRow(headers);

  if (!data.documents) return;

  for (const doc of data.documents) {
    const f = doc.fields || {};
    sheet.appendRow([
      f.code?.stringValue || "",
      f.name?.stringValue || "",
      f.location?.stringValue || "",
      f.type?.stringValue || "",
      f.description?.stringValue || "",
      f.price?.doubleValue || "",
      f.owner?.stringValue || "",
      f.condition?.stringValue || "",
      f.notes?.stringValue || "",
      f.hasLabel?.booleanValue || false,
      f.labelType?.stringValue || "",
      f.available?.booleanValue || false,
      f.checkedOutBy?.stringValue || "",
      f.lastCheckedOut?.stringValue || "",
    ]);
  }
}

// 🔁 Sheet ➜ Firestore
function pushSheetToFirestore() {
  const token = getFirestoreToken();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Equipment");
  const rows = sheet.getDataRange().getValues();

  const headers = rows[0];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const itemCode = row[0]; // Item Code is now the first column
    if (!itemCode) continue;

    const fields = {
      code: { stringValue: row[0] || "" },
      name: { stringValue: row[1] || "" },
      location: { stringValue: row[2] || "" },
      type: { stringValue: row[3] || "" },
      description: { stringValue: row[4] || "" },
      price: { doubleValue: parseFloat(row[5]) || 0 },
      owner: { stringValue: row[6] || "" },
      condition: { stringValue: row[7] || "" },
      notes: { stringValue: row[8] || "" },
      hasLabel: { booleanValue: row[9] === true || row[9] === "TRUE" },
      labelType: { stringValue: row[10] || "" },
      available: { booleanValue: row[11] === true || row[11] === "TRUE" },
      checkedOutBy: { stringValue: row[12] || "" },
      lastCheckedOut: { stringValue: row[13] || "" },
    };

    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/equipment/${itemCode}`;
    UrlFetchApp.fetch(url, {
      method: "patch",
      contentType: "application/json",
      payload: JSON.stringify({ fields }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      muteHttpExceptions: true,
    });
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