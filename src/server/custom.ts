function extractGoogleSheetsId(url: string): string {
  const match = url.match(/\/d\/([^/]+)/);
  return match ? match[1] : 'Not a google URL';
}

export function fillE2FieldWith(data: string) {
  SpreadsheetApp.getActiveSheet().getRange('E2').setValue(data);
}

export function getSpreadsheetID(): string {
  const fullUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  const id = extractGoogleSheetsId(fullUrl);
  return id;
}

export function selectTheRangeForUser(range: string) {
  const rangeObject = SpreadsheetApp.getActiveSpreadsheet()
    .getActiveSheet()
    .getRange(range);
  rangeObject.activate();
}
