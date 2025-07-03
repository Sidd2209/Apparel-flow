
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { Product, DevelopmentStage, ProductStatus } from '@/types';

const ProductDevelopment: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'PRD-001',
      name: 'Summer Breeze T-Shirt',
      sku: 'SBT-001',
      category: 'Apparel',
      season: 'Summer 2024',
      designer: 'Emily Chen',
      status: 'design',
      developmentStage: 'tech-pack',
      samples: [
        {
          id: 'SMP-001',
          productId: 'PRD-001',
          version: 1,
          status: 'approved',
          feedback: 'Great fit, approved for production',
          createdAt: '2024-01-10',
          approvedBy: 'Sarah Johnson'
        }
      ],
      designFiles: [
        {
          id: 'DF-001',
          productId: 'PRD-001',
          fileName: 'summer-tshirt-v2.pdf',
          fileType: 'PDF',
          version: 2,
          uploadedBy: 'Emily Chen',
          uploadedAt: '2024-01-12',
          isLatest: true
        }
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-12'
    },
    {
      id: 'PRD-002',
      name: 'Urban Denim Jacket',
      sku: 'UDJ-002',
      category: 'Outerwear',
      season: 'Fall 2024',
      designer: 'Marcus Rivera',
      status: 'sampling',
      developmentStage: 'proto-sample',
      samples: [
        {
          id: 'SMP-002',
          productId: 'PRD-002',
          version: 1,
          status: 'revision-needed',
          feedback: 'Sleeve length needs adjustment',
          createdAt: '2024-01-08'
        }
      ],
      designFiles: [],
      createdAt: '2023-12-15',
      updatedAt: '2024-01-08'
    }
  ]);

  const getStatusColor = (status: ProductStatus) => {
    const colors = {
      concept: 'bg-gray-100 text-gray-800',
      design: 'bg-blue-100 text-blue-800',
      sampling: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      'production-ready': 'bg-indigo-100 text-indigo-800',
      discontinued: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStageProgress = (stage: DevelopmentStage) => {
    const stages = {
      ideation: 10,
      'initial-design': 25,
      'tech-pack': 50,
      'proto-sample': 70,
      'fit-sample': 85,
      'final-approval': 100
    };
    return stages[stage] || 0;
  };

  const getSampleStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'revision-needed':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'ready-review':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-6 w-6 text-yellow-600" />
        <h1 className="text-3xl font-bold text-gray-900">Product Development Tracker</h1>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="samples">Sample Tracking</TabsTrigger>
          <TabsTrigger value="approvals">Design Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Pipeline</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Product
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {products.map((product) => (
                  <Card key={product.id} className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{product.name}</h3>
                          <div className="text-sm text-gray-600">
                            {product.category} • {product.season} • Designer: {product.designer}
                          </div>
                          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                        </div>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Development Progress</span>
                          <span className="text-sm text-gray-600">
                            {product.developmentStage.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <Progress value={getStageProgress(product.developmentStage)} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="font-medium text-sm text-gray-500">Samples</div>
                          <div className="text-lg font-semibold">{product.samples.length}</div>
                          <div className="flex gap-1 mt-1">
                            {product.samples.map((sample) => (
                              <div key={sample.id} className="flex items-center gap-1">
                                {getSampleStatusIcon(sample.status)}
                                <span className="text-xs">v{sample.version}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="font-medium text-sm text-gray-500">Design Files</div>
                          <div className="text-lg font-semibold">{product.designFiles.length}</div>
                          {product.designFiles.length > 0 && (
                            <div className="text-xs text-gray-600">
                              Latest: {product.designFiles.find(f => f.isLatest)?.fileName}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="font-medium text-sm text-gray-500">Last Updated</div>
                          <div className="text-sm">{product.updatedAt}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Update Status</Button>
                        <Button variant="outline" size="sm">Upload Files</Button>
                        <Button variant="outline" size="sm">Request Sample</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="samples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample Tracking Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.flatMap(product => 
                  product.samples.map(sample => (
                    <Card key={sample.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="font-semibold">{products.find(p => p.id === sample.productId)?.name}</div>
                          <div className="text-sm text-gray-600">Version {sample.version}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {getSampleStatusIcon(sample.status)}
                            <Badge className={sample.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                            sample.status === 'revision-needed' ? 'bg-orange-100 text-orange-800' : 
                                            'bg-blue-100 text-blue-800'}>
                              {sample.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm">{sample.feedback}</div>
                          {sample.approvedBy && (
                            <div className="text-xs text-gray-500">Approved by: {sample.approvedBy}</div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Created: {sample.createdAt}</div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Approvals & Revisions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {products.flatMap(p => p.samples).filter(s => s.status === 'approved').length}
                    </div>
                    <div className="text-sm text-gray-600">Approved Samples</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {products.flatMap(p => p.samples).filter(s => s.status === 'revision-needed').length}
                    </div>
                    <div className="text-sm text-gray-600">Pending Revisions</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {products.flatMap(p => p.samples).filter(s => s.status === 'ready-review').length}
                    </div>
                    <div className="text-sm text-gray-600">Ready for Review</div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDevelopment;
