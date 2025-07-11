import { v4 as uuidv4 } from 'uuid';
import InventoryItem from '../models/InventoryItem';
import { CostingSheet } from '../models/CostingSheet';
import Product from '../models/Product';
import Order from '../models/Order';
import { ProductionPlan } from '../models/ProductionPlan';
import { Resource } from '../models/Resource';
import { User } from '../models/User';

function ensureSubdocIds(costBreakdown: any) {
  ['materials', 'labor', 'overheads'].forEach(sub => {
    if (costBreakdown && Array.isArray(costBreakdown[sub])) {
      costBreakdown[sub].forEach((item: any) => {
        // Use _id if present, else generate a random string
        if (!item.id && item._id) {
          item.id = item._id.toString();
        } else if (!item.id && !item._id) {
          item.id = Math.random().toString(36).substring(2, 15);
        }
      });
    }
  });
  return costBreakdown;
}

// Mock models - replace with actual DB models
const mockVendors: any[] = [
  {
    id: '1',
    name: 'Fabric Solutions Inc.',
    contactPerson: 'John Doe',
    email: 'john.doe@fabricsolutions.com',
    rating: 4.5,
    onTimeDeliveryPercentage: 98,
    totalOrders: 50,
    activeOrders: 5,
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Premium Textiles Co.',
    contactPerson: 'Jane Smith',
    email: 'jane.smith@premiumtextiles.com',
    rating: 4.8,
    onTimeDeliveryPercentage: 95,
    totalOrders: 75,
    activeOrders: 10,
    status: 'PREFERRED',
  },
];

// --- Combined Mock Data ---
// Products and Orders are now managed in MongoDB
const samples: any[] = [];
const designFiles: any[] = [];

const mockPurchaseOrders: any[] = [
  {
    id: 'po1',
    poNumber: 'PO-001',
    vendorId: '1',
    items: [
      {
        name: 'Cotton Fabric',
        quantity: 1000,
        unitPrice: 5.50,
      },
    ],
    totalAmount: 5500,
    status: 'DELIVERED',
    orderDate: '2023-10-01',
    expectedDeliveryDate: '2023-10-15',
    actualDeliveryDate: '2023-10-14',
  },
  {
    id: 'po2',
    poNumber: 'PO-002',
    vendorId: '2',
    items: [
      {
        name: 'Silk Fabric',
        quantity: 500,
        unitPrice: 12.00,
      },
    ],
    totalAmount: 6000,
    status: 'SHIPPED',
    orderDate: '2023-10-05',
    expectedDeliveryDate: '2023-10-20',
    actualDeliveryDate: null,
  },
];

// Helper function to map departments to their preferred homepages
const getHomepageForDepartment = (department: string): string => {
  switch (department) {
    case 'DESIGN':
      return '/product-dev';
    case 'SOURCING':
      return '/sourcing';
    case 'PRODUCTION':
      return '/production-scheduler';
    case 'SALES':
      return '/orders';
    case 'INVENTORY':
      return '/inventory';
    default:
      return '/';
  }
};

export const resolvers = {
  Query: {
    products: async () => await Product.find(),
    product: async (_: any, { id }: { id: string }) => await Product.findById(id),
    orders: async (_: any, { status, priority }: { status?: string; priority?: string }) => {
      const filter: any = {};
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      return await Order.find(filter).populate('productId');
    },
    order: async (_: any, { id }: { id: string }) => await Order.findById(id).populate('productId'),
    vendors: () => mockVendors,
    purchaseOrders: () =>
      mockPurchaseOrders.map((po: any) => ({
        ...po,
        totalAmount: po.items.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0),
      })),
    sourcingPerformance: () => ({
      averageDeliveryTimeDays: 14.5,
      onTimeDeliveryRate: 98.7,
      totalActiveVendors: mockVendors.filter((v: any) => v.status !== 'INACTIVE').length,
      activePurchaseOrders: mockPurchaseOrders.filter(
        (po: any) => po.status !== 'DELIVERED' && po.status !== 'CANCELLED'
      ).length,
      topPerformingVendors: [...mockVendors].sort((a: any, b: any) => b.rating - a.rating).slice(0, 2),
    }),
    productionPlans: async () => await ProductionPlan.find(),
    resources: async () => await Resource.find(),
    inventoryItems: async () => {
      try {
        return await InventoryItem.find();
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        throw new Error('Failed to fetch inventory items');
      }
    },
    inventoryItem: async ({ id }: { id: string }) => {
      try {
        return await InventoryItem.findById(id);
      } catch (error) {
        console.error(`Error fetching inventory item with id ${id}:`, error);
        throw new Error('Failed to fetch inventory item');
      }
    },
    costingSheets: async () => {
      // Definitive Fix: Use .lean() for performance and defensive checks for robustness.
      const sheets = await CostingSheet.find().lean();
      return sheets.map(sheet => {
        // Ensure the ID is a string, as lean() doesn't transform it automatically.
        sheet.id = sheet._id.toString();
        if (sheet.costBreakdown) {
          // Safely patch subdocuments, ensuring arrays exist before mapping.
          sheet.costBreakdown = ensureSubdocIds(sheet.costBreakdown);
        }
        return sheet;
      });
    },
    costingSheet: async (_: any, { id }: { id: string }) => {
      // Use .lean() and defensive checks for single item fetch.
      const sheet = await CostingSheet.findById(id).lean();
      if (sheet) {
        sheet.id = sheet._id.toString();
        if (sheet.costBreakdown) {
          sheet.costBreakdown = ensureSubdocIds(sheet.costBreakdown);
        }
      }
      return sheet;
    },
    me: async (parent: any, args: any, context: any) => {
      // In a real app, you'd get the user ID from the context (e.g., from a JWT)
      // For now, we'll simulate a logged-in user.
      if (!context.userId) return null;
      return await User.findById(context.userId);
    },
    user: async (_: any, { googleId }: { googleId: string }) => {
      return await User.findOne({ googleId });
    },
  },
  Mutation: {
    createProduct: async (_: any, { input }: { input: any }) => {
      const newProduct = new Product({
        ...input,
        status: input.status || 'CONCEPT',
        developmentStage: input.developmentStage || 'IDEATION',
      });
      await newProduct.save();
      return newProduct;
    },
    createOrder: async (_: any, { input }: { input: any }) => {
      const product = await Product.findById(input.productId);
      if (!product) throw new Error(`Product with ID ${input.productId} not found.`);
      
      const newOrder = new Order({
        ...input,
        orderNumber: `ORD-${Date.now()}`,
      });
      await newOrder.save();
      // Manually populate the 'product' field to ensure the full object is returned
      const populatedOrder = await newOrder.populate('productId');
      return populatedOrder;
    },
    updateOrderStatus: async (_: any, { id, status }: { id: string; status: string }) => {
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      if (!order) throw new Error('Order not found');
      return order.populate('productId');
    },
    createVendor: (_: any, { input }: { input: any }) => {
      const newVendor = {
        id: uuidv4(),
        ...input,
        rating: 0,
        onTimeDeliveryPercentage: 0,
        totalOrders: 0,
        activeOrders: 0,
        status: 'ACTIVE',
      };
      mockVendors.push(newVendor);
      return newVendor;
    },
    createPurchaseOrder: (_: any, { input }: { input: any }) => {
      const totalAmount = input.items.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0);
      const newPO = {
        id: uuidv4(),
        poNumber: `PO-${String(mockPurchaseOrders.length + 1).padStart(3, '0')}`,
        ...input,
        totalAmount,
        status: input.status || 'PENDING',
        orderDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        actualDeliveryDate: null,
      };
      mockPurchaseOrders.push(newPO);
      return newPO;
    },
    createProductionPlan: async (_: any, { input }: { input: any }) => {
      const newPlan = new ProductionPlan(input);
      await newPlan.save();
      // Return a plain object to ensure virtuals like 'id' are applied correctly
      return newPlan.toObject();
    },
    createResource: async (_: any, { input }: { input: any }) => {
      const newResource = new Resource(input);
      await newResource.save();
      return newResource;
    },
    createInventoryItem: async (_: any, { input }: { input: any }) => {
      try {
        const { name, currentStock, unitCost, ...rest } = input;

        const newItem = new InventoryItem({
          ...rest,
          name,
          currentStock,
          unitCost,
          totalValue: currentStock * unitCost,
          lastUpdated: new Date().toISOString(),
        });

        const savedItem = await newItem.save();
        return savedItem;
      } catch (error) {
        console.error('Error creating inventory item:', error);
        throw new Error('Failed to create inventory item');
      }
    },
    updateInventoryItem: async (_: any, { id, input }: { id: string; input: any }) => {
      try {
        const updatedItem = await InventoryItem.findByIdAndUpdate(id, input, {
          new: true, // Return the updated document
        });
        if (!updatedItem) {
          throw new Error('Inventory item not found');
        }
        return updatedItem;
      } catch (error) {
        console.error(`Error updating inventory item with id ${id}:`, error);
        throw new Error('Failed to update inventory item');
      }
    },
    deleteInventoryItem: async (_: any, { id }: { id: string }) => {
      try {
        const deletedItem = await InventoryItem.findByIdAndDelete(id);
        if (!deletedItem) {
          throw new Error('Inventory item not found');
        }
        return deletedItem;
      } catch (error) {
        console.error(`Error deleting inventory item with id ${id}:`, error);
        throw new Error('Failed to delete inventory item');
      }
    },
    saveCostingSheet: async (_: any, { id, input }: { id?: string; input: any }) => {
      // Ensure totals are calculated on the backend for data integrity
      if (input.costBreakdown) {
        if (input.costBreakdown.materials) {
          input.costBreakdown.materials = input.costBreakdown.materials.map((m: any) => ({ ...m, total: (m.quantity || 0) * (m.unitCost || 0) }));
        }
        if (input.costBreakdown.labor) {
          input.costBreakdown.labor = input.costBreakdown.labor.map((l: any) => ({ ...l, total: ((l.timeMinutes || 0) / 60) * (l.ratePerHour || 0) }));
        }
      }

      if (id) {
        // Update existing sheet
        const updatedSheet = await CostingSheet.findByIdAndUpdate(id, input, { new: true });
        if (!updatedSheet) {
          throw new Error('Costing sheet not found');
        }
        return updatedSheet;
      } else {
        // Create new sheet
        const newSheet = new CostingSheet(input);
        await newSheet.save();
        return newSheet;
      }
    },
    deleteCostingSheet: async (_: any, { id }: { id: string }) => {
      try {
        const deletedSheet = await CostingSheet.findByIdAndDelete(id);
        if (!deletedSheet) {
          throw new Error('Costing sheet not found');
        }
        return deletedSheet.id;
      } catch (error) {
        console.error(`Error deleting costing sheet with id ${id}:`, error);

        throw new Error('Failed to delete costing sheet');
      }
    },
    updateUserProfile: async (_: any, { input }: { input: any }, context: any) => {
      console.log('=== UPDATE USER PROFILE START ===');
      console.log('Input received:', input);

      const { googleId, email, username, department } = input;

      if (!googleId || !email) {
        throw new Error('Google ID and email are required to update profile.');
      }

      console.log('Looking for user with googleId:', googleId);
      let user = await User.findOne({ googleId });

      if (user) {
        console.log('Found existing user, updating fields');
        // Update existing user
        user.username = username;
        user.department = department;
        user.preferredHomepage = getHomepageForDepartment(department);
      } else {
        console.log('Creating new user');
        // Create new user with preferredHomepage set
        user = new User({ 
          googleId, 
          email, 
          username, 
          department,
          preferredHomepage: getHomepageForDepartment(department)
        });
      }

      console.log('User object before save:', user);
      console.log('Is user new:', user.isNew);
      console.log('Is department modified:', user.isModified('department'));
      console.log('Department value:', user.department);

      await user.save(); // This will trigger the pre-save hook
      
      console.log('User object after save:', user);
      console.log('=== UPDATE USER PROFILE END ===');

      return user;
    },
  },
  Order: {
    product: (order: any) => order.productId, // The 'productId' field is already populated by the query resolver
  },
  PurchaseOrder: {
    vendor: (purchaseOrder: any) => mockVendors.find((vendor: any) => vendor.id === purchaseOrder.vendorId),
  },
};

export default resolvers;