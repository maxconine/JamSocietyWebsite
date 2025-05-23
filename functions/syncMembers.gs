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

// 🔄 Sheet ➜ Firestore (Sync members)
function syncMembersToFirestore() {
  const token = getFirestoreToken();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members");
  const rows = sheet.getDataRange().getValues();
  let successCount = 0;
  let errorCount = 0;

  // Verify headers
  const headers = rows[0];
  const expectedHeaders = ["Timestamp", "First Name", "Last Name", "Student ID Number", "HMC email (@g.hmc.edu)", "Graduating Year", "Email Address", "Swipe Added Date", "Given Swipe", "Added to mailing list"];
  if (!headers.every((header, index) => header === expectedHeaders[index])) {
    Logger.log("ERROR: Headers don't match expected format!");
    Logger.log("Expected: " + JSON.stringify(expectedHeaders));
    Logger.log("Found: " + JSON.stringify(headers));
    return;
  }

  Logger.log(`Starting sync with ${rows.length - 1} total members`);

  // Start from row 2 (index 1)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const studentId = row[3]; // Student ID Number is the fourth column
    const graduatingYear = row[5]; // Graduating Year is the sixth column
    
    // Skip if no student ID
    if (!studentId) {
      Logger.log(`Skipping row ${i + 1} - no student ID`);
      continue;
    }

    // Log the first few rows for verification
    if (i < 5) {
      Logger.log(`Row ${i + 1} data: ${JSON.stringify(row)}`);
    }

    const fields = {
      firstName: { stringValue: row[1] || "" },
      lastName: { stringValue: row[2] || "" },
      schoolId: { stringValue: studentId.toString() },
      email: { stringValue: row[4] || "" },
      classYear: { stringValue: graduatingYear.toString() },
      isAdmin: { booleanValue: false },
      createdAt: { stringValue: new Date().toISOString() },
      quizPassed: { booleanValue: false },
      swipeAddedDate: { stringValue: row[7] || "" },
      givenSwipe: { booleanValue: row[8] === "TRUE" },
      addedToMailingList: { booleanValue: row[9] === "TRUE" }
    };

    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${studentId}`;
    
    try {
      Logger.log(`Processing member ${studentId} - First Name: ${row[1]}, Last Name: ${row[2]}, Year: ${graduatingYear}`);
      
      const response = UrlFetchApp.fetch(url, {
        method: "patch",
        contentType: "application/json",
        payload: JSON.stringify({ fields }),
        headers: {
          Authorization: `Bearer ${token}`,
        },
        muteHttpExceptions: true,
      });

      const responseCode = response.getResponseCode();
      const responseText = response.getContentText();
      
      Logger.log(`Response for ${studentId} - code: ${responseCode}`);
      if (responseCode !== 200) {
        Logger.log(`Error response for ${studentId}: ${responseText}`);
      }

      if (responseCode === 200) {
        successCount++;
      } else {
        errorCount++;
      }
    } catch (error) {
      errorCount++;
      Logger.log(`Exception for ${studentId}: ${error.toString()}`);
    }

    // Add a small delay to avoid rate limiting
    Utilities.sleep(100);
  }

  // Show completion message
  const message = `Sync completed.\nProcessed ${rows.length - 1} total members.\nSuccessful: ${successCount}\nErrors: ${errorCount}`;
  Logger.log(message);
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(message), 'Sync Complete');
}

// Set up triggers for automatic syncing
function createTimeDrivenTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Create new trigger
  ScriptApp.newTrigger('syncMembersToFirestore')
    .timeBased()
    .everyHours(1)
    .create();
}

// Add a menu to the spreadsheet
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Member Sync')
    .addItem('Sync to Firestore', 'syncMembersToFirestore')
    .addItem('Set up Auto Sync', 'createTimeDrivenTriggers')
    .addToUi();
} 