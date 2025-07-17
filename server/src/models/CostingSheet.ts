import db from '../db';

export interface ICostingSheet {
  id?: number;
  name: string;
  costBreakdown: any; // Store as JSON
  taxConfig: any; // Store as JSON
  profitMargin: number;
  selectedCurrency: string;
  createdAt?: string;
  updatedAt?: string;
}

// Example: Fetch all costing sheets
export function getAllCostingSheets(): ICostingSheet[] {
  const sheets = db.prepare('SELECT * FROM costing_sheets').all();
  return sheets.map((sheet: any) => ({
    ...sheet,
    costBreakdown: JSON.parse(sheet.costBreakdown),
    taxConfig: JSON.parse(sheet.taxConfig),
  }));
}
