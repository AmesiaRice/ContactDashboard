/**
 * Google Apps Script — Contacts Sheet API
 * ─────────────────────────────────────────
 * 1. Open your Google Sheet → Extensions → Apps Script
 * 2. Paste this entire file, replacing any existing code
 * 3. Save (Ctrl+S)
 * 4. Click Deploy → New deployment
 *    • Type: Web app
 *    • Execute as: Me
 *    • Who has access: Anyone
 * 5. Click Deploy → copy the Web App URL
 * 6. Paste the URL into .env.local as NEXT_PUBLIC_APPS_SCRIPT_URL
 *
 * The sheet's first row MUST be the header row with these exact labels:
 *   Timestamp | Name | Phone No | Company Name | Address |
 *   Email | City | Pincode | Contact Type | Remarks
 */

const SHEET_NAME = "Sheet1"; // ← change if your sheet tab has a different name

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return jsonResponse({ status: "error", data: [], message: "Sheet not found: " + SHEET_NAME });
    }

    const rows = sheet.getDataRange().getValues();

    if (rows.length < 2) {
      return jsonResponse({ status: "success", data: [] });
    }

    const headers = rows[0].map(String);
    const data = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      // Skip completely empty rows
      if (row.every(cell => cell === "" || cell === null || cell === undefined)) continue;

      const record = {};
      headers.forEach((header, idx) => {
        const value = row[idx];
        // Format Dates as ISO strings so JS can parse them
        if (value instanceof Date) {
          record[header] = value.toISOString();
        } else {
          record[header] = String(value ?? "");
        }
      });
      data.push(record);
    }

    return jsonResponse({ status: "success", data });
  } catch (err) {
    return jsonResponse({ status: "error", data: [], message: err.toString() });
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
