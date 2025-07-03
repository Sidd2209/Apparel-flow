
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, Plus, Edit, Star, Calendar, DollarSign } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  rating: number;
  onTimeDelivery: number;
  totalOrders: number;
  activeOrders: number;
}

interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  items: string[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
}

const SourcingManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'Cotton Mills Ltd',
      contact: 'John Smith',
      email: 'john@cottonmills.com',
      rating: 4.5,
      onTimeDelivery: 92,
      totalOrders: 45,
      activeOrders: 3
    },
    {
      id: '2',
      name: 'Textile Suppliers Inc',
      contact: 'Sarah Johnson',
      email: 'sarah@textiles.com',
      rating: 4.2,
      onTimeDelivery: 88,
      totalOrders: 67,
      activeOrders: 5
    }
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'PO-001',
      vendorId: '1',
      vendorName: 'Cotton Mills Ltd',
      items: ['Cotton Fabric - 500 yards', 'Thread - 20 spools'],
      totalAmount: 2750,
      status: 'shipped',
      orderDate: '2024-01-15',
      expectedDelivery: '2024-01-25',
      actualDelivery: '2024-01-24'
    },
    {
      id: 'PO-002',
      vendorId: '2',
      vendorName: 'Textile Suppliers Inc',
      items: ['Polyester Blend - 300 yards', 'Buttons - 1000 pieces'],
      totalAmount: 1850,
      status: 'pending',
      orderDate: '2024-01-18',
      expectedDelivery: '2024-01-28'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Truck className="h-6 w-6 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-900">Sourcing Management</h1>
      </div>

      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Vendor Directory</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.map((vendor) => (
                  <Card key={vendor.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{vendor.name}</h3>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Contact:</span> {vendor.contact}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {vendor.email}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">Rating:</span>
                        {renderStars(vendor.rating)}
                        <span className="text-sm text-gray-600">({vendor.rating})</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium">On-time Delivery</div>
                          <div className="text-green-600">{vendor.onTimeDelivery}%</div>
                        </div>
                        <div>
                          <div className="font-medium">Total Orders</div>
                          <div>{vendor.totalOrders}</div>
                        </div>
                      </div>

                      <Badge variant={vendor.activeOrders > 0 ? "default" : "secondary"}>
                        {vendor.activeOrders} Active Orders
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Purchase Orders</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create PO
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseOrders.map((po) => (
                  <Card key={po.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="font-semibold text-lg">{po.id}</div>
                        <div className="text-sm text-gray-600">{po.vendorName}</div>
                        <Badge className={getStatusColor(po.status)}>
                          {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                        </Badge>
                      </div>

                      <div>
                        <div className="font-medium mb-2">Items:</div>
                        <ul className="text-sm space-y-1">
                          {po.items.map((item, index) => (
                            <li key={index} className="text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium">${po.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Order: {po.orderDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Expected: {po.expectedDelivery}</span>
                        </div>
                        {po.actualDelivery && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm text-green-600">Delivered: {po.actualDelivery}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Track Shipment</Button>
                        {po.status === 'pending' && (
                          <Button variant="outline" size="sm">Cancel Order</Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <span>Average Delivery Time</span>
                      <span className="font-semibold">7.2 days</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>On-time Delivery Rate</span>
                      <span className="font-semibold text-green-600">90%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Total Active Vendors</span>
                      <span className="font-semibold">{vendors.length}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Active Purchase Orders</span>
                      <span className="font-semibold">{purchaseOrders.filter(po => po.status !== 'delivered' && po.status !== 'cancelled').length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Performing Vendors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendors
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3)
                    .map((vendor, index) => (
                      <div key={vendor.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="flex items-center gap-1">
                            {renderStars(vendor.rating)}
                          </div>
                        </div>
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium">PO-001 Delivered</div>
                    <div className="text-gray-600">Cotton Mills Ltd - 1 day early</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">New Vendor Added</div>
                    <div className="text-gray-600">Fabric Express Co.</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">PO-002 Approved</div>
                    <div className="text-gray-600">Textile Suppliers Inc</div>
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

export default SourcingManagement;
