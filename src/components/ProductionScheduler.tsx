
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar, Plus, Clock, Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProductionPlan {
  id: string;
  productName: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
  progress: number;
  assignedWorkers: number;
  estimatedHours: number;
  actualHours: number;
  priority: 'low' | 'medium' | 'high';
}

interface Resource {
  id: string;
  name: string;
  type: 'machine' | 'worker' | 'material';
  capacity: number;
  allocated: number;
  available: number;
  efficiency: number;
}

const ProductionScheduler: React.FC = () => {
  const [productionPlans, setProductionPlans] = useState<ProductionPlan[]>([
    {
      id: 'PP-001',
      productName: 'Cotton T-Shirts',
      quantity: 500,
      startDate: '2024-01-20',
      endDate: '2024-01-30',
      status: 'in-progress',
      progress: 65,
      assignedWorkers: 8,
      estimatedHours: 240,
      actualHours: 156,
      priority: 'high'
    },
    {
      id: 'PP-002',
      productName: 'Denim Jeans',
      quantity: 300,
      startDate: '2024-01-25',
      endDate: '2024-02-05',
      status: 'planned',
      progress: 0,
      assignedWorkers: 12,
      estimatedHours: 360,
      actualHours: 0,
      priority: 'medium'
    },
    {
      id: 'PP-003',
      productName: 'Polo Shirts',
      quantity: 200,
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      status: 'delayed',
      progress: 40,
      assignedWorkers: 6,
      estimatedHours: 160,
      actualHours: 120,
      priority: 'high'
    }
  ]);

  const [resources, setResources] = useState<Resource[]>([
    {
      id: 'R-001',
      name: 'Cutting Machines',
      type: 'machine',
      capacity: 10,
      allocated: 7,
      available: 3,
      efficiency: 92
    },
    {
      id: 'R-002',
      name: 'Sewing Operators',
      type: 'worker',
      capacity: 25,
      allocated: 20,
      available: 5,
      efficiency: 88
    },
    {
      id: 'R-003',
      name: 'Quality Inspectors',
      type: 'worker',
      capacity: 8,
      allocated: 6,
      available: 2,
      efficiency: 95
    },
    {
      id: 'R-004',
      name: 'Cotton Fabric',
      type: 'material',
      capacity: 1000,
      allocated: 650,
      available: 350,
      efficiency: 100
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'machine': return '⚙️';
      case 'worker': return '👷';
      case 'material': return '📦';
      default: return '📋';
    }
  };

  const calculateOverallProgress = () => {
    if (productionPlans.length === 0) return 0;
    const totalProgress = productionPlans.reduce((sum, plan) => sum + plan.progress, 0);
    return Math.round(totalProgress / productionPlans.length);
  };

  const getActiveProjects = () => {
    return productionPlans.filter(plan => plan.status === 'in-progress').length;
  };

  const getDelayedProjects = () => {
    return productionPlans.filter(plan => plan.status === 'delayed').length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Production Scheduler</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold">{calculateOverallProgress()}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold">{getActiveProjects()}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workers</p>
                <p className="text-2xl font-bold">{resources.find(r => r.name === 'Sewing Operators')?.capacity || 0}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delayed Projects</p>
                <p className="text-2xl font-bold text-red-600">{getDelayedProjects()}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList>
          <TabsTrigger value="schedule">Production Schedule</TabsTrigger>
          <TabsTrigger value="resources">Resource Management</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Production Plans</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Production Plan
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productionPlans.map((plan) => (
                  <Card key={plan.id} className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(plan.priority)}`}></div>
                          <h3 className="font-semibold text-lg">{plan.productName}</h3>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Plan ID: {plan.id}
                        </div>
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                        </Badge>
                      </div>

                      <div>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Quantity:</span> {plan.quantity} units
                          </div>
                          <div>
                            <span className="font-medium">Workers:</span> {plan.assignedWorkers}
                          </div>
                          <div>
                            <span className="font-medium">Priority:</span> 
                            <span className={`ml-1 ${plan.priority === 'high' ? 'text-red-600' : plan.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                              {plan.priority.charAt(0).toUpperCase() + plan.priority.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Start:</span> {plan.startDate}
                          </div>
                          <div>
                            <span className="font-medium">End:</span> {plan.endDate}
                          </div>
                          <div>
                            <span className="font-medium">Hours:</span> {plan.actualHours}/{plan.estimatedHours}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Progress</span>
                            <span className="text-sm">{plan.progress}%</span>
                          </div>
                          <Progress value={plan.progress} className="w-full" />
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button variant="outline" size="sm">Update</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((resource) => (
                  <Card key={resource.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getResourceTypeIcon(resource.type)}</span>
                        <div>
                          <h3 className="font-semibold">{resource.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Utilization</span>
                            <span>{Math.round((resource.allocated / resource.capacity) * 100)}%</span>
                          </div>
                          <Progress value={(resource.allocated / resource.capacity) * 100} />
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <div className="font-medium">Capacity</div>
                            <div>{resource.capacity}</div>
                          </div>
                          <div>
                            <div className="font-medium">Allocated</div>
                            <div>{resource.allocated}</div>
                          </div>
                          <div>
                            <div className="font-medium">Available</div>
                            <div className="text-green-600">{resource.available}</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Efficiency:</span>
                          <Badge variant={resource.efficiency >= 90 ? "default" : "secondary"}>
                            {resource.efficiency}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Capacity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Overall Capacity Utilization</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <Progress value={78} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Peak Production Hours</span>
                      <span>8 AM - 5 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Daily Output</span>
                      <span>425 units</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bottleneck Resource</span>
                      <span className="text-red-600">Cutting Machines</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacity Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-medium text-yellow-800">High Utilization Alert</div>
                    <div className="text-sm text-yellow-700">
                      Cutting machines at 70% capacity. Consider adding shifts.
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800">Optimization Opportunity</div>
                    <div className="text-sm text-blue-700">
                      Quality inspectors have 25% available capacity for additional work.
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800">Efficiency Gain</div>
                    <div className="text-sm text-green-700">
                      Sewing operators efficiency improved by 5% this month.
                    </div>
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

export default ProductionScheduler;
