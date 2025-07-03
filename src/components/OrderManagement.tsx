
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Plus, Search, Calendar, DollarSign, User } from 'lucide-react';
import { Order, OrderStatus, Priority } from '@/types';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'Fashion Forward Ltd',
      orderNumber: 'FF-2024-001',
      productType: 'Summer Collection - T-Shirts',
      quantity: 500,
      deadline: '2024-02-15',
      status: 'in-progress',
      priority: 'high',
      assignedTo: 'Sarah Johnson',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12',
      totalValue: 12500
    },
    {
      id: 'ORD-002',
      customerName: 'Urban Style Co',
      orderNumber: 'US-2024-003',
      productType: 'Winter Jackets',
      quantity: 200,
      deadline: '2024-03-01',
      status: 'sampling',
      priority: 'medium',
      assignedTo: 'Mike Chen',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-11',
      totalValue: 18000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      sampling: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      production: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-gray-100 text-gray-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.productType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-6 w-6 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Overview</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search">Search Orders</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by customer, order number, or product..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Status Filter</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="sampling">Sampling</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority Filter</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <div className="font-semibold text-lg">{order.orderNumber}</div>
                        <div className="text-sm text-gray-600">{order.customerName}</div>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-sm text-gray-500">Product</div>
                        <div className="text-sm">{order.productType}</div>
                        <div className="text-sm text-gray-600">Qty: {order.quantity}</div>
                      </div>

                      <div>
                        <div className="font-medium text-sm text-gray-500">Timeline</div>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {order.deadline}</span>
                        </div>
                        <div className="text-xs text-gray-500">Created: {order.createdAt}</div>
                      </div>

                      <div>
                        <div className="font-medium text-sm text-gray-500">Financial</div>
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          <DollarSign className="h-4 w-4" />
                          <span>${order.totalValue.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <User className="h-3 w-3" />
                          <span>{order.assignedTo}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Update Status</Button>
                        <Button variant="outline" size="sm">Contact Customer</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{orders.length}</div>
                <div className="text-sm text-green-600">+12% from last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {orders.filter(o => o.status === 'in-progress').length}
                </div>
                <div className="text-sm text-blue-600">Active orders</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${orders.reduce((sum, order) => sum + order.totalValue, 0).toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Revenue pipeline</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">On-Time Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">94%</div>
                <div className="text-sm text-green-600">Performance rate</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Communication Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="font-medium">Recent Communications</div>
                  <div className="text-sm text-gray-600 mt-2">
                    • Order FF-2024-001: Status update sent to Fashion Forward Ltd
                  </div>
                  <div className="text-sm text-gray-600">
                    • Order US-2024-003: Sample approval request sent
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button>Send Status Updates</Button>
                  <Button variant="outline">Schedule Follow-up</Button>
                  <Button variant="outline">Export Reports</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManagement;
