import { getUserByGoogleId, createUser, IUser } from '../models/User';
import { getAllOrders, IOrder } from '../models/Order';
import { getAllProducts, IProduct } from '../models/Product';
import { getAllInventoryItems, IInventoryItem } from '../models/InventoryItem';
import { getInventoryHistory, IInventoryHistory } from '../models/InventoryHistory';
import { getInventoryReorders, IInventoryReorder } from '../models/InventoryReorder';
import { getAllProductionPlans, IProductionPlan } from '../models/ProductionPlan';
import { getAllResources, IResource } from '../models/Resource';
import { getAllCostingSheets, ICostingSheet } from '../models/CostingSheet';
import db from '../db';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const getHomepageForDepartment = (department: string): string => {
  switch (department) {
    case 'DESIGN': return '/product-dev';
    case 'SOURCING': return '/sourcing';
    case 'PRODUCTION': return '/production-scheduler';
    case 'SALES': return '/orders';
    case 'INVENTORY': return '/inventory';
    default: return '/';
  }
};

export const resolvers = {
  Query: {
    user: async (_: any, { googleId }: { googleId: string }) => getUserByGoogleId(googleId),
    users: async () => [], // Implement as needed
    userByToken: async (_: any, { idToken }: { idToken: string }) => {
      try {
        const ticket = await client.verifyIdToken({
          idToken: idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) throw new Error('Invalid Google token');
        const { sub: googleId, email, name } = payload;
        let user = getUserByGoogleId(googleId);
        if (!user) {
          user = createUser({ googleId, email: email || '', name: name || '' });
        }
        const token = jwt.sign(
          { id: user.id, googleId: user.googleId },
          process.env.JWT_SECRET!,
          { expiresIn: '1d' }
        );
        return { ...user, token };
      } catch (error: any) {
        throw new Error('Authentication failed');
      }
    },
    productionPlans: async () => getAllProductionPlans(),
    products: async () => getAllProducts(),
    orders: async () => getAllOrders(),
    costingSheets: async () => getAllCostingSheets(),
    inventoryItems: async () => getAllInventoryItems(),
    inventoryHistory: async (_: any, { itemId }: { itemId: number }) => getInventoryHistory(itemId),
    inventoryReorders: async (_: any, { itemId }: { itemId: number }) => getInventoryReorders(itemId),
    resources: async () => getAllResources(),
  },
  Mutation: {
    // Example: updateUserProfile
    updateUserProfile: async (_: any, { input }: { input: any }) => {
      const { googleId, email, name, department } = input;
      let user = getUserByGoogleId(googleId);
      if (user) {
        db.prepare('UPDATE users SET name = ?, department = ?, preferredHomepage = ?, updatedAt = ? WHERE googleId = ?')
          .run(name, department, getHomepageForDepartment(department), new Date().toISOString(), googleId);
        user = getUserByGoogleId(googleId);
        return user;
      } else {
        user = createUser({ googleId, email, name, department, preferredHomepage: getHomepageForDepartment(department) });
        return user;
      }
    },
    // Example: createOrder
    createOrder: async (_: any, { input }: { input: any }) => {
      const now = new Date().toISOString();
      db.prepare(
        'INSERT INTO orders (orderNumber, productId, quantity, status, priority, totalValue, customerName, productType, assignedTo, validDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(
        input.orderNumber || `ORD-${Date.now()}`,
        input.productId,
        input.quantity,
        input.status,
        input.priority,
        input.totalValue,
        input.customerName,
        input.productType,
        input.assignedTo,
        input.validDate,
        now,
        now
      );
      const newOrder = db.prepare('SELECT * FROM orders WHERE orderNumber = ?').get(input.orderNumber || `ORD-${Date.now()}`);
      return newOrder;
    },
    // Example: deleteOrder
    deleteOrder: async (_: any, { id }: { id: number }) => {
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
      if (!order) throw new Error('Order not found');
      db.prepare('DELETE FROM orders WHERE id = ?').run(id);
      return order;
    },
    // Example: createProduct
    createProduct: async (_: any, { input }: { input: any }) => {
      const now = new Date().toISOString();
      db.prepare(
        'INSERT INTO products (name, sku, category, season, designer, status, developmentStage, actualHours, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(
        input.name,
        input.sku,
        input.category,
        input.season,
        input.designer,
        input.status,
        input.developmentStage,
        input.actualHours || 0,
        input.priority,
        now,
        now
      );
      const newProduct = db.prepare('SELECT * FROM products WHERE name = ? AND sku = ?').get(input.name, input.sku);
      return newProduct;
    },
    // Example: updateProduct
    updateProduct: async (_: any, { id, input }: { id: number, input: any }) => {
      const now = new Date().toISOString();
      db.prepare(
        'UPDATE products SET name = ?, sku = ?, category = ?, season = ?, designer = ?, status = ?, developmentStage = ?, actualHours = ?, priority = ?, updatedAt = ? WHERE id = ?'
      ).run(
        input.name,
        input.sku,
        input.category,
        input.season,
        input.designer,
        input.status,
        input.developmentStage,
        input.actualHours || 0,
        input.priority,
        now,
        id
      );
      const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      if (!updatedProduct) throw new Error('Product not found');
      return updatedProduct;
    },
    // Example: deleteProduct
    deleteProduct: async (_: any, { id }: { id: number }) => {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      if (!product) throw new Error('Product not found');
      db.prepare('DELETE FROM products WHERE id = ?').run(id);
      return product;
    },
    // Example: createInventoryItem
    createInventoryItem: async (_: any, { input }: { input: any }) => {
      const now = new Date().toISOString();
      db.prepare(
        'INSERT INTO inventory_items (name, category, currentStock, minStock, maxStock, unit, unitCost, location, supplier, deleted, totalValue, lastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(
        input.name,
        input.category,
        input.currentStock,
        input.minStock,
        input.maxStock,
        input.unit,
        input.unitCost,
        input.location,
        input.supplier,
        0,
        (input.currentStock || 0) * (input.unitCost || 0),
        now
      );
      const newItem = db.prepare('SELECT * FROM inventory_items WHERE name = ? AND lastUpdated = ?').get(input.name, now) as IInventoryItem;
      return newItem;
    },
    // Example: updateInventoryItem
    updateInventoryItem: async (_: any, { id, input }: { id: number, input: any }) => {
      const now = new Date().toISOString();
      const currentRaw = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(id);
      if (!currentRaw || typeof currentRaw !== 'object') throw new Error('Inventory item not found');
      const current = currentRaw as IInventoryItem;
      const totalValue = (input.currentStock !== undefined ? input.currentStock : current.currentStock) * (input.unitCost !== undefined ? input.unitCost : current.unitCost);
      db.prepare(
        'UPDATE inventory_items SET name = ?, category = ?, currentStock = ?, minStock = ?, maxStock = ?, unit = ?, unitCost = ?, location = ?, supplier = ?, totalValue = ?, lastUpdated = ? WHERE id = ?'
      ).run(
        input.name || current.name,
        input.category || current.category,
        input.currentStock !== undefined ? input.currentStock : current.currentStock,
        input.minStock !== undefined ? input.minStock : current.minStock,
        input.maxStock !== undefined ? input.maxStock : current.maxStock,
        input.unit || current.unit,
        input.unitCost !== undefined ? input.unitCost : current.unitCost,
        input.location || current.location,
        input.supplier || current.supplier,
        totalValue,
        now,
        id
      );
      const updatedRaw = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(id);
      if (!updatedRaw || typeof updatedRaw !== 'object') throw new Error('Inventory item not found');
      const updated = updatedRaw as IInventoryItem;
      return updated;
    },
    // Example: deleteInventoryItem (soft delete)
    deleteInventoryItem: async (_: any, { id }: { id: number }) => {
      const itemRaw = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(id);
      if (!itemRaw || typeof itemRaw !== 'object') throw new Error('Inventory item not found');
      const item = itemRaw as IInventoryItem;
      db.prepare('UPDATE inventory_items SET deleted = 1, lastUpdated = ? WHERE id = ?').run(new Date().toISOString(), id);
      return { ...item, deleted: 1 };
    },
    // Example: saveCostingSheet
    saveCostingSheet: async (_: any, { id, input }: { id?: number, input: any }) => {
      const now = new Date().toISOString();
      if (id) {
        db.prepare(
          'UPDATE costing_sheets SET name = ?, costBreakdown = ?, taxConfig = ?, profitMargin = ?, selectedCurrency = ?, updatedAt = ? WHERE id = ?'
        ).run(
          input.name,
          JSON.stringify(input.costBreakdown),
          JSON.stringify(input.taxConfig),
          input.profitMargin,
          input.selectedCurrency,
          now,
          id
        );
        const updatedRaw = db.prepare('SELECT * FROM costing_sheets WHERE id = ?').get(id);
        if (!updatedRaw || typeof updatedRaw !== 'object') throw new Error('Costing sheet not found');
        const updated = updatedRaw as ICostingSheet & { costBreakdown: string, taxConfig: string };
        return { ...updated, costBreakdown: JSON.parse(updated.costBreakdown), taxConfig: JSON.parse(updated.taxConfig) };
      } else {
        db.prepare(
          'INSERT INTO costing_sheets (name, costBreakdown, taxConfig, profitMargin, selectedCurrency, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).run(
          input.name,
          JSON.stringify(input.costBreakdown),
          JSON.stringify(input.taxConfig),
          input.profitMargin,
          input.selectedCurrency,
          now,
          now
        );
        const newSheetRaw = db.prepare('SELECT * FROM costing_sheets WHERE name = ? AND createdAt = ?').get(input.name, now);
        if (!newSheetRaw || typeof newSheetRaw !== 'object') throw new Error('Costing sheet not found');
        const newSheet = newSheetRaw as ICostingSheet & { costBreakdown: string, taxConfig: string };
        return { ...newSheet, costBreakdown: JSON.parse(newSheet.costBreakdown), taxConfig: JSON.parse(newSheet.taxConfig) };
      }
    },
    // Example: deleteCostingSheet
    deleteCostingSheet: async (_: any, { id }: { id: number }) => {
      const sheetRaw = db.prepare('SELECT * FROM costing_sheets WHERE id = ?').get(id);
      if (!sheetRaw || typeof sheetRaw !== 'object') throw new Error('Costing sheet not found');
      const sheet = sheetRaw as ICostingSheet & { costBreakdown: string, taxConfig: string };
      db.prepare('DELETE FROM costing_sheets WHERE id = ?').run(id);
      return { ...sheet, costBreakdown: JSON.parse(sheet.costBreakdown), taxConfig: JSON.parse(sheet.taxConfig) };
    },
    // Add more mutations as needed, following the same pattern
  }
};