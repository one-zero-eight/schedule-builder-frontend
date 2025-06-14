export function fillE2FieldWith(data: string) {
    SpreadsheetApp.getActiveSheet().getRange("E2").setValue(data)
}