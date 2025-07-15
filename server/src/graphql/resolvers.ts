import { User } from '../models/User';

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
    user: async (_: any, { googleId }: { googleId: string }) => {
      return await User.findOne({ googleId });
    },
    users: async () => await User.find({}),
    userByToken: async (_: any, { idToken }: { idToken: string }) => {
      console.log('userByToken called with args:', { idToken });
      try {
        const ticket = await client.verifyIdToken({
          idToken: idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) {
          throw new Error('Invalid Google token');
        }

        const { sub: googleId, email, name } = payload;
        let user = await User.findOne({ googleId });

        if (!user) {
          // If no user with this googleId, check if one exists with the email
          user = await User.findOne({ email });

          if (user) {
            // If user exists with email, link the googleId
            user.googleId = googleId;
            await user.save();
          } else {
            // If no user exists at all, create a new one
            user = new User({ 
              googleId, 
              email, 
              name, 
              department: null, 
              preferredHomepage: null 
            });
            await user.save();
          }
        }

        const token = jwt.sign(
          { id: user.id, googleId: user.googleId },
          process.env.JWT_SECRET!,
          { expiresIn: '1d' }
        );

        return { ...user.toObject(), id: user._id, token };
      } catch (error: any) {
        console.error('Authentication error in userByToken resolver:', error);
        throw new Error('Authentication failed');
      }
    },
    productionPlans: async () => {
      const { ProductionPlan } = require('../models/ProductionPlan');
      const plans = await ProductionPlan.find({});
      return plans || [];
    },
    products: async () => {
      const Product = require('../models/Product').default;
      const products = await Product.find({});
      return products || [];
    },
    orders: async () => {
      const Order = require('../models/Order').default;
      const orders = await Order.find({});
      // Patch missing validDate and id for old orders and return plain objects
      return orders.map((order: any) => {
        const obj = order.toObject ? order.toObject() : order;
        if (!obj.validDate) {
          obj.validDate = obj.createdAt || new Date();
        }
        // Ensure validDate is always a string (ISO format)
        if (obj.validDate instanceof Date) {
          obj.validDate = obj.validDate.toISOString();
        } else if (typeof obj.validDate === 'number') {
          obj.validDate = new Date(obj.validDate).toISOString();
        }
        // Ensure id is set from _id
        obj.id = obj._id ? obj._id.toString() : undefined;
        return obj;
      });
    },
    costingSheets: async () => {
      const { CostingSheet } = require('../models/CostingSheet');
      let sheets = await CostingSheet.find({});
      // Patch each sheet to ensure all required/nested fields are present
      sheets = sheets.map((sheet: any) => {
        if (!sheet.selectedCurrency) sheet.selectedCurrency = 'USD';
        if (sheet.profitMargin === undefined || sheet.profitMargin === null) sheet.profitMargin = 0;
        if (!sheet.costBreakdown) sheet.costBreakdown = { materials: [], labor: [], overheads: [] };
        else {
          if (!sheet.costBreakdown.materials) sheet.costBreakdown.materials = [];
          if (!sheet.costBreakdown.labor) sheet.costBreakdown.labor = [];
          if (!sheet.costBreakdown.overheads) sheet.costBreakdown.overheads = [];
        }
        if (!sheet.taxConfig) sheet.taxConfig = { vatRate: 0, customsDuty: 0, otherTaxes: 0 };
        else {
          if (sheet.taxConfig.vatRate === undefined || sheet.taxConfig.vatRate === null) sheet.taxConfig.vatRate = 0;
          if (sheet.taxConfig.customsDuty === undefined || sheet.taxConfig.customsDuty === null) sheet.taxConfig.customsDuty = 0;
          if (sheet.taxConfig.otherTaxes === undefined || sheet.taxConfig.otherTaxes === null) sheet.taxConfig.otherTaxes = 0;
        }
        // Patch totals for materials and labor
        if (sheet.costBreakdown.materials) {
          sheet.costBreakdown.materials = sheet.costBreakdown.materials.map((m: any) => ({
            ...m,
            total: (Number(m.quantity) || 0) * (Number(m.unitCost) || 0)
          }));
        }
        if (sheet.costBreakdown.labor) {
          sheet.costBreakdown.labor = sheet.costBreakdown.labor.map((l: any) => ({
            ...l,
            total: ((Number(l.timeMinutes) || 0) / 60) * (Number(l.ratePerHour) || 0)
          }));
        }
        return sheet;
      });
      return sheets || [];
    },
    inventoryItems: async () => {
      const InventoryItem = require('../models/InventoryItem').default;
      const items = await InventoryItem.find({ deleted: { $ne: true } });
      return items || [];
    },
    inventoryHistory: async (_: any, { itemId }: { itemId: string }) => {
      const InventoryHistory = require('../models/InventoryHistory').default;
      return await InventoryHistory.find({ itemId }).sort({ createdAt: -1 });
    },
    resources: async () => {
      const { Resource } = require('../models/Resource');
      const resources = await Resource.find({});
      return resources || [];
    },
  },
  Mutation: {
    updateUserProfile: async (_: any, { input }: { input: any }) => {
      console.log('updateUserProfile called with input:', input);
      const { googleId, email, name, department } = input;
      if (!googleId || !email) { 
        console.error('Google ID and email are required.');
        throw new Error('Google ID and email are required.'); 
      }

      let user = await User.findOne({ googleId });
      console.log('User found by googleId:', user);
      if (user) {
        user.name = name;
        user.department = department;
        user.preferredHomepage = getHomepageForDepartment(department);
        await user.save();
        console.log('User updated:', user);
        return user;
      } else {
        // Check for duplicate email
        user = await User.findOne({ email });
        console.log('User found by email:', user);
        if (user) {
          user.googleId = googleId;
          user.name = name;
          user.department = department;
          user.preferredHomepage = getHomepageForDepartment(department);
          await user.save();
          console.log('User updated by email:', user);
          return user;
        }
        user = new User({
          googleId, email, name, department,
          preferredHomepage: getHomepageForDepartment(department)
        });
        await user.save();
        console.log('New user created:', user);
        return user;
      }
    },
    createOrder: async (_: any, { input }: { input: any }) => {
      try {
        const Order = require('../models/Order').default;
        // Auto-generate orderNumber if not provided
        if (!input.orderNumber) {
          input.orderNumber = `ORD-${Date.now()}`;
        }
        // Convert validDate string to Date object
        if (input.validDate) {
          input.validDate = new Date(input.validDate);
        }
        const order = new Order(input);
        await order.save();
        return order;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to create order: ${err.message}`);
      }
    },
    deleteOrder: async (_: any, { id }: { id: string }) => {
      try {
        const Order = require('../models/Order').default;
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
          throw new Error('Order not found');
        }
        return order;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to delete order: ${err.message}`);
      }
    },
    createProduct: async (_: any, { input }: { input: any }) => {
      try {
        const Product = require('../models/Product').default;
        // Provide defaults for required fields if missing
        if (!input.status) input.status = 'CONCEPT';
        if (!input.developmentStage) input.developmentStage = 'IDEATION';
        const product = new Product(input);
        await product.save();
        return product;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to create product: ${err.message}`);
      }
    },
    updateProduct: async (_: any, { id, input }: { id: string, input: any }) => {
      try {
        const Product = require('../models/Product').default;
        const updated = await Product.findByIdAndUpdate(id, input, { new: true });
        if (!updated) throw new Error('Product not found');
        return updated;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to update product: ${err.message}`);
      }
    },
    deleteProduct: async (_: any, { id }: { id: string }) => {
      try {
        const Product = require('../models/Product').default;
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) throw new Error('Product not found');
        return deleted;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to delete product: ${err.message}`);
      }
    },
    createProductionPlan: async (_: any, { input }: { input: any }) => {
      try {
        const { ProductionPlan } = require('../models/ProductionPlan');
        // Provide defaults for required fields if missing
        if (!input.status) input.status = 'PLANNED';
        if (!input.progress && input.progress !== 0) input.progress = 0;
        if (!input.actualHours && input.actualHours !== 0) input.actualHours = 0;
        const plan = new ProductionPlan(input);
        await plan.save();
        return plan;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to create production plan: ${err.message}`);
      }
    },
    updateProductionPlan: async (_: any, { id, input }: { id: string, input: any }) => {
      try {
        const { ProductionPlan } = require('../models/ProductionPlan');
        const updated = await ProductionPlan.findByIdAndUpdate(id, input, { new: true });
        if (!updated) throw new Error('Production plan not found');
        return updated;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to update production plan: ${err.message}`);
      }
    },
    deleteProductionPlan: async (_: any, { id }: { id: string }) => {
      try {
        const { ProductionPlan } = require('../models/ProductionPlan');
        const deleted = await ProductionPlan.findByIdAndDelete(id);
        if (!deleted) throw new Error('Production plan not found');
        return deleted;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to delete production plan: ${err.message}`);
      }
    },
    createResource: async (_: any, { input }: { input: any }) => {
      try {
        const { Resource } = require('../models/Resource');
        // Provide defaults for required fields if missing
        if (!input.allocated && input.allocated !== 0) input.allocated = 0;
        const resource = new Resource(input);
        await resource.save();
        return resource;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to create resource: ${err.message}`);
      }
    },
    updateResource: async (_: any, { id, input }: { id: string, input: any }) => {
      try {
        const { Resource } = require('../models/Resource');
        const updated = await Resource.findByIdAndUpdate(id, input, { new: true });
        if (!updated) throw new Error('Resource not found');
        return updated;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to update resource: ${err.message}`);
      }
    },
    deleteResource: async (_: any, { id }: { id: string }) => {
      try {
        const { Resource } = require('../models/Resource');
        const deleted = await Resource.findByIdAndDelete(id);
        if (!deleted) throw new Error('Resource not found');
        return deleted;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to delete resource: ${err.message}`);
      }
    },
    saveCostingSheet: async (_: any, { id, input }: { id?: string, input: any }) => {
      try {
        const { CostingSheet } = require('../models/CostingSheet');
        let sheet;
        if (id) {
          await CostingSheet.findByIdAndUpdate(id, input, { new: true });
          sheet = await CostingSheet.findById(id);
        } else {
          sheet = new CostingSheet(input);
          await sheet.save();
          sheet = await CostingSheet.findById(sheet._id);
        }
        if (!sheet) throw new Error('Failed to save costing sheet');
        // Ensure all required fields are present
        if (!sheet.selectedCurrency) sheet.selectedCurrency = 'USD';
        if (!sheet.profitMargin && sheet.profitMargin !== 0) sheet.profitMargin = 0;
        if (!sheet.costBreakdown) sheet.costBreakdown = { materials: [], labor: [], overheads: [] };
        if (!sheet.taxConfig) sheet.taxConfig = { vatRate: 0, customsDuty: 0, otherTaxes: 0 };
        // Patch totals for materials and labor
        if (sheet.costBreakdown.materials) {
          sheet.costBreakdown.materials = sheet.costBreakdown.materials.map((m: any) => ({
            ...m,
            total: (Number(m.quantity) || 0) * (Number(m.unitCost) || 0)
          }));
        }
        if (sheet.costBreakdown.labor) {
          sheet.costBreakdown.labor = sheet.costBreakdown.labor.map((l: any) => ({
            ...l,
            total: ((Number(l.timeMinutes) || 0) / 60) * (Number(l.ratePerHour) || 0)
          }));
        }
        return sheet;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to save sheet: ${err.message}`);
      }
    },
    deleteCostingSheet: async (_: any, { id }: { id: string }) => {
      try {
        const { CostingSheet } = require('../models/CostingSheet');
        const deleted = await CostingSheet.findByIdAndDelete(id);
        if (!deleted) throw new Error('Costing sheet not found');
        return deleted;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to delete costing sheet: ${err.message}`);
      }
    },
    deleteInventoryItem: async (_: any, { id }: { id: string }) => {
      try {
        const InventoryItem = require('../models/InventoryItem').default;
        const deleted = await InventoryItem.findByIdAndUpdate(
          id,
          { deleted: true, lastUpdated: new Date().toISOString() },
          { new: true }
        );
        if (!deleted) throw new Error('Inventory item not found');

        const InventoryHistory = require('../models/InventoryHistory').default;
        await InventoryHistory.create({
          itemId: id,
          action: 'DELETE',
          quantityChange: 0,
          previousStock: deleted.currentStock,
          newStock: deleted.currentStock,
          note: 'Item deleted',
          user: null
        });

        return deleted;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to soft delete inventory item: ${err.message}`);
      }
    },
    updateInventoryItem: async (_: any, { id, input }: { id: string, input: any }) => {
      try {
        const InventoryItem = require('../models/InventoryItem').default;
        const current = await InventoryItem.findById(id);
        if (!current) throw new Error('Inventory item not found');

        // Calculate totalValue if currentStock or unitCost is being updated
        if (input.currentStock !== undefined || input.unitCost !== undefined) {
          input.totalValue = 
            (input.currentStock !== undefined ? input.currentStock : current.currentStock) *
            (input.unitCost !== undefined ? input.unitCost : current.unitCost);
        }
        // Always update lastUpdated
        input.lastUpdated = new Date().toISOString();
        const updated = await InventoryItem.findByIdAndUpdate(id, input, { new: true });
        if (!updated) throw new Error('Inventory item not found');

        const InventoryHistory = require('../models/InventoryHistory').default;
        await InventoryHistory.create({
          itemId: id,
          action: 'EDIT',
          quantityChange: (input.currentStock !== undefined && updated)
            ? (updated.currentStock - current.currentStock)
            : 0,
          previousStock: current.currentStock,
          newStock: updated.currentStock,
          note: 'Item edited',
          user: null // Optionally, set user info if available
        });

        return updated;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to update inventory item: ${err.message}`);
      }
    },
    createInventoryItem: async (_: any, { input }: { input: any }) => {
      try {
        const InventoryItem = require('../models/InventoryItem').default;
        const item = new InventoryItem(input);
        await item.save();

        const InventoryHistory = require('../models/InventoryHistory').default;
        await InventoryHistory.create({
          itemId: item.id,
          action: 'CREATE',
          quantityChange: item.currentStock,
          previousStock: 0,
          newStock: item.currentStock,
          note: 'Item created',
          user: null
        });

        return item;
      } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to create inventory item: ${err.message}`);
      }
    },
    // Placeholder for reorder mutation and history recording (to be implemented in reorder step)
  },
  Order: {
    product: async (parent: { productId: string }) => {
      const Product = require('../models/Product').default;
      const product = await Product.findById(parent.productId);
      if (product) return product;
      // Return a dummy fallback product if not found
      return {
        id: 'unknown',
        name: 'Unknown Product',
        sku: '',
        category: '',
        season: '',
        designer: '',
        status: 'CONCEPT',
        developmentStage: 'IDEATION',
        samples: [],
        designFiles: [],
        actualHours: 0,
        priority: 'LOW',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }
};