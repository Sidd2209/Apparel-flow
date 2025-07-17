import Database from 'better-sqlite3';
const db = new Database('apparel.db');

// Users table
// (Add columns as needed for your user model)
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    googleId TEXT UNIQUE,
    email TEXT UNIQUE,
    name TEXT,
    department TEXT,
    preferredHomepage TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )
`).run();

// InventoryItem table
db.prepare(`
  CREATE TABLE IF NOT EXISTS inventory_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category TEXT,
    currentStock INTEGER,
    minStock INTEGER,
    maxStock INTEGER,
    unit TEXT,
    unitCost REAL,
    location TEXT,
    supplier TEXT,
    deleted INTEGER DEFAULT 0,
    totalValue REAL,
    lastUpdated TEXT
  )
`).run();

// InventoryHistory table
db.prepare(`
  CREATE TABLE IF NOT EXISTS inventory_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    itemId INTEGER,
    action TEXT,
    quantityChange INTEGER,
    previousStock INTEGER,
    newStock INTEGER,
    note TEXT,
    createdAt TEXT,
    user TEXT
  )
`).run();

// InventoryReorder table
db.prepare(`
  CREATE TABLE IF NOT EXISTS inventory_reorders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    itemId INTEGER,
    quantity INTEGER,
    supplier TEXT,
    status TEXT,
    note TEXT,
    createdAt TEXT,
    user TEXT
  )
`).run();

// Orders table
db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderNumber TEXT UNIQUE,
    productId INTEGER,
    quantity INTEGER,
    status TEXT,
    priority TEXT,
    totalValue REAL,
    customerName TEXT,
    productType TEXT,
    assignedTo TEXT,
    validDate TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )
`).run();

// Products table
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    sku TEXT,
    category TEXT,
    season TEXT,
    designer TEXT,
    status TEXT,
    developmentStage TEXT,
    actualHours REAL,
    priority TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )
`).run();

// CostingSheets table (flattened for SQLite, can be expanded as needed)
db.prepare(`
  CREATE TABLE IF NOT EXISTS costing_sheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    costBreakdown TEXT,
    taxConfig TEXT,
    profitMargin REAL,
    selectedCurrency TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )
`).run();

// ProductionPlans table
db.prepare(`
  CREATE TABLE IF NOT EXISTS production_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productName TEXT,
    quantity INTEGER,
    startDate TEXT,
    endDate TEXT,
    status TEXT,
    progress INTEGER,
    assignedWorkers INTEGER,
    estimatedHours INTEGER,
    actualHours INTEGER,
    priority TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )
`).run();

// Resources table
db.prepare(`
  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    capacity INTEGER,
    allocated INTEGER,
    available INTEGER,
    efficiency INTEGER,
    createdAt TEXT,
    updatedAt TEXT
  )
`).run();

export default db; 