import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// GraphQL Queries and Mutations
const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      sku
      category
      status
      developmentStage
      createdAt
      samples {
        id
        type
        status
        createdAt
      }
      designFiles {
        id
        fileName
        fileType
        isLatest
        uploadedAt
      }
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
    }
  }
`;

// Component
const ProductDevelopment: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);
  const [createProduct, { loading: creatingProduct }] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      refetch();
      setIsModalOpen(false); // Close modal on success
    },
    onError: (error) => {
      // Display a more informative error message
      alert(`Error creating product: ${error.message}`);
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', category: '', season: '', designer: '', priority: 'MEDIUM' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (value: string) => {
    setNewProduct((prev) => ({ ...prev, priority: value }));
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return alert('Product name is required.');

    await createProduct({ variables: { input: newProduct } });
    setNewProduct({ name: '', sku: '', category: '', season: '', designer: '', priority: 'MEDIUM' }); // Reset form
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading products: {error.message}</p>;

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-4 md:grid-cols-10 gap-4 items-center w-full">
        <h1 className="text-3xl font-bold col-span-2 md:col-span-8">Product Development</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
          <div className="col-span-2 md:col-span-2 justify-self-end">
            <Button>
              <Plus className="h-12 px-6 text-lg" /> Add New Product
            </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Fill in the details for the new product.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProduct}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" value={newProduct.name} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sku" className="text-right">SKU</Label>
                  <Input id="sku" name="sku" value={newProduct.sku} onChange={handleInputChange} className="col-span-3" type="number" inputMode="numeric" pattern="[0-9]*" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Input id="category" name="category" value={newProduct.category} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="season" className="text-right">Season</Label>
                  <Input id="season" name="season" value={newProduct.season} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="designer" className="text-right">Designer</Label>
                  <Input id="designer" name="designer" value={newProduct.designer} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">Priority</Label>
                  <Select name="priority" value={newProduct.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={creatingProduct}>
                  {creatingProduct ? 'Adding...' : 'Add Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="samples">Sample Tracking</TabsTrigger>
          <TabsTrigger value="approvals">Design Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {data?.products.map((product: any) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600">SKU: {product.sku || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Category: {product.category || 'N/A'}</p>
                  {/* Combined Status/Stage Dropdown */}
                  <div className="flex items-center gap-2">
                    <Label>Status/Stage:</Label>
                    <Select
                      value={`${product.status}|${product.developmentStage}`}
                      onValueChange={(val) => {/* TODO: call update mutation */}}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CONCEPT|IDEATION">Concept / Ideation</SelectItem>
                        <SelectItem value="DESIGN|INITIAL_DESIGN">Design / Initial Design</SelectItem>
                        <SelectItem value="SAMPLING|PROTO_SAMPLE">Sampling / Proto Sample</SelectItem>
                        <SelectItem value="APPROVED|FINAL_APPROVAL">Approved / Final Approval</SelectItem>
                        <SelectItem value="PRODUCTION_READY|TECH_PACK">Production Ready / Tech Pack</SelectItem>
                        <SelectItem value="DISCONTINUED|FINAL_APPROVAL">Discontinued / Final Approval</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Edit/Delete Buttons */}
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => {/* TODO: open edit dialog */}}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => {/* TODO: call delete mutation */}}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="samples">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>All Samples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.products.flatMap((p: any) => p.samples.map((s: any) => ({ ...s, productName: p.name }))).map((sample: any) => (
                <div key={sample.id} className="border p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{sample.productName}</p>
                    <p className="text-sm text-gray-500">Type: {sample.type}</p>
                  </div>
                  <Badge>{sample.status.replace(/_/g, ' ')}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>All Design Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.products.flatMap((p: any) => p.designFiles.map((f: any) => ({ ...f, productName: p.name }))).map((file: any) => (
                <div key={file.id} className="border p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{file.fileName}</p>
                    <p className="text-sm text-gray-500">Product: {file.productName}</p>
                  </div>
                  {file.isLatest && <Badge variant="secondary">Latest</Badge>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDevelopment;