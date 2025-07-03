
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, AlertTriangle, Package, TrendingUp, Search } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: 'raw-materials' | 'wip' | 'finished-goods';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  location: string;
  lastUpdated: string;
  supplier?: string;
}

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'INV-001',
      name: 'Cotton Fabric - White',
      category: 'raw-materials',
      currentStock: 500,
      minStock: 200,
      maxStock: 1000,
      unit: 'yards',
      unitCost: 3.50,
      totalValue: 1750,
      location: 'Warehouse A - Section 1',
      lastUpdated: '2024-01-15',
      supplier: 'Cotton Mills Ltd'
    },
    {
      id: 'INV-002',
      name: 'Summer T-Shirt - Size M',
      category: 'finished-goods',
      currentStock: 150,
      minStock: 50,
      maxStock: 500,
      unit: 'pieces',
      unitCost: 12.00,
      totalValue: 1800,
      location: 'Warehouse B - Section 2',
      lastUpdated: '2024-01-14'
    },
    {
      id: 'INV-003',
      name: 'Denim Jacket - In Progress',
      category: 'wip',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: 'pieces',
      unitCost: 25.00,
      totalValue: 1125,
      location: 'Production Floor - Station 3',
      lastUpdated: '2024-01-13'
    },
    {
      id: 'INV-004',
      name: 'Polyester Thread - Black',
      category: 'raw-materials',
      currentStock: 25,
      minStock: 100,
      maxStock: 500,
      unit: 'spools',
      unitCost: 2.25,
      totalValue: 56.25,
      location: 'Warehouse A - Section 3',
      lastUpdated: '2024-01-12',
      supplier: 'Thread Supply Co'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return 'low';
    if (item.currentStock >= item.maxStock) return 'excess';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      low: 'bg-red-100 text-red-800',
      excess: 'bg-yellow-100 text-yellow-800',
      normal: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'raw-materials': 'bg-blue-100 text-blue-800',
      'wip': 'bg-purple-100 text-purple-800',
      'finished-goods': 'bg-green-100 text-green-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => getStockStatus(item) === 'low');
  const excessStockItems = inventory.filter(item => getStockStatus(item) === 'excess');
  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Inventory Overview</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{inventory.length}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                ${totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
              <div className="text-sm text-gray-600">Low Stock Alerts</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{excessStockItems.length}</div>
              <div className="text-sm text-gray-600">Excess Stock</div>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search">Search Inventory</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by name or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Category Filter</Label>
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-48 p-2 border rounded-md"
                  >
                    <option value="all">All Categories</option>
                    <option value="raw-materials">Raw Materials</option>
                    <option value="wip">Work in Progress</option>
                    <option value="finished-goods">Finished Goods</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredInventory.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <div className="font-semibold text-lg">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.location}</div>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(getStockStatus(item))}>
                            {getStockStatus(item).toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-sm text-gray-500">Stock Levels</div>
                        <div className="text-lg font-semibold">
                          {item.currentStock} {item.unit}
                        </div>
                        <div className="text-sm text-gray-600">
                          Min: {item.minStock} | Max: {item.maxStock}
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-sm text-gray-500">Unit Cost</div>
                        <div className="text-sm">${item.unitCost}</div>
                        <div className="font-medium text-sm text-gray-500 mt-1">Total Value</div>
                        <div className="text-sm font-semibold">${item.totalValue.toLocaleString()}</div>
                      </div>

                      <div>
                        <div className="font-medium text-sm text-gray-500">Last Updated</div>
                        <div className="text-sm">{item.lastUpdated}</div>
                        {item.supplier && (
                          <>
                            <div className="font-medium text-sm text-gray-500 mt-1">Supplier</div>
                            <div className="text-sm">{item.supplier}</div>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">Adjust Stock</Button>
                        <Button variant="outline" size="sm">View History</Button>
                        <Button variant="outline" size="sm">Reorder</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.map((item) => (
                    <Card key={item.id} className="p-3 border-l-4 border-red-500">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            Current: {item.currentStock} {item.unit} (Min: {item.minStock})
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Reorder</Button>
                      </div>
                    </Card>
                  ))}
                  {lowStockItems.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No low stock alerts
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-yellow-600" />
                  Excess Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {excessStockItems.map((item) => (
                    <Card key={item.id} className="p-3 border-l-4 border-yellow-500">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            Current: {item.currentStock} {item.unit} (Max: {item.maxStock})
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Review</Button>
                      </div>
                    </Card>
                  ))}
                  {excessStockItems.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No excess stock alerts
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-medium">Cotton Fabric - White</div>
                      <div className="text-sm text-gray-600">Stock In</div>
                    </div>
                    <div>
                      <div className="text-green-600">+200 yards</div>
                      <div className="text-sm text-gray-600">From supplier</div>
                    </div>
                    <div>
                      <div className="text-sm">2024-01-15</div>
                    </div>
                    <div>
                      <div className="text-sm">John Smith</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-medium">Summer T-Shirt - Size M</div>
                      <div className="text-sm text-gray-600">Stock Out</div>
                    </div>
                    <div>
                      <div className="text-red-600">-50 pieces</div>
                      <div className="text-sm text-gray-600">To shipping</div>
                    </div>
                    <div>
                      <div className="text-sm">2024-01-14</div>
                    </div>
                    <div>
                      <div className="text-sm">Sarah Johnson</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-medium">Polyester Thread - Black</div>
                      <div className="text-sm text-gray-600">Adjustment</div>
                    </div>
                    <div>
                      <div className="text-blue-600">-5 spools</div>
                      <div className="text-sm text-gray-600">Inventory count</div>
                    </div>
                    <div>
                      <div className="text-sm">2024-01-13</div>
                    </div>
                    <div>
                      <div className="text-sm">Mike Chen</div>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Raw Materials</span>
                    <span className="font-semibold">
                      {inventory.filter(i => i.category === 'raw-materials').length} items
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Work in Progress</span>
                    <span className="font-semibold">
                      {inventory.filter(i => i.category === 'wip').length} items
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Finished Goods</span>
                    <span className="font-semibold">
                      {inventory.filter(i => i.category === 'finished-goods').length} items
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Value Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Raw Materials</span>
                    <span className="font-semibold">
                      ${inventory.filter(i => i.category === 'raw-materials')
                        .reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Work in Progress</span>
                    <span className="font-semibold">
                      ${inventory.filter(i => i.category === 'wip')
                        .reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Finished Goods</span>
                    <span className="font-semibold">
                      ${inventory.filter(i => i.category === 'finished-goods')
                        .reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Stock Turnover Rate</span>
                    <span className="font-semibold text-green-600">4.2x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. Days on Hand</span>
                    <span className="font-semibold">87 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stock Accuracy</span>
                    <span className="font-semibold text-green-600">97.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
