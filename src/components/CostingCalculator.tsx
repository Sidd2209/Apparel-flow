
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plus, Trash2 } from 'lucide-react';

interface MaterialCost {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  total: number;
}

interface LaborCost {
  id: string;
  operation: string;
  timeMinutes: number;
  ratePerMinute: number;
  total: number;
}

interface OverheadCost {
  id: string;
  type: string;
  percentage: number;
  amount: number;
}

const CostingCalculator: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [materials, setMaterials] = useState<MaterialCost[]>([
    { id: '1', name: 'Cotton Fabric', quantity: 2, unitCost: 5.50, total: 11.00 }
  ]);
  const [labor, setLabor] = useState<LaborCost[]>([
    { id: '1', operation: 'Cutting', timeMinutes: 15, ratePerMinute: 0.25, total: 3.75 }
  ]);
  const [overheads, setOverheads] = useState<OverheadCost[]>([
    { id: '1', type: 'Factory Overhead', percentage: 15, amount: 0 }
  ]);
  const [profitMargin, setProfitMargin] = useState(20);

  const addMaterial = () => {
    const newMaterial: MaterialCost = {
      id: Date.now().toString(),
      name: '',
      quantity: 0,
      unitCost: 0,
      total: 0
    };
    setMaterials([...materials, newMaterial]);
  };

  const updateMaterial = (id: string, field: keyof MaterialCost, value: string | number) => {
    setMaterials(materials.map(material => {
      if (material.id === id) {
        const updated = { ...material, [field]: value };
        if (field === 'quantity' || field === 'unitCost') {
          updated.total = updated.quantity * updated.unitCost;
        }
        return updated;
      }
      return material;
    }));
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const addLabor = () => {
    const newLabor: LaborCost = {
      id: Date.now().toString(),
      operation: '',
      timeMinutes: 0,
      ratePerMinute: 0,
      total: 0
    };
    setLabor([...labor, newLabor]);
  };

  const updateLabor = (id: string, field: keyof LaborCost, value: string | number) => {
    setLabor(labor.map(laborItem => {
      if (laborItem.id === id) {
        const updated = { ...laborItem, [field]: value };
        if (field === 'timeMinutes' || field === 'ratePerMinute') {
          updated.total = updated.timeMinutes * updated.ratePerMinute;
        }
        return updated;
      }
      return laborItem;
    }));
  };

  const removeLabor = (id: string) => {
    setLabor(labor.filter(l => l.id !== id));
  };

  const updateOverhead = (id: string, field: keyof OverheadCost, value: string | number) => {
    setOverheads(overheads.map(overhead => ({ ...overhead, [field]: value })));
  };

  // Calculations
  const totalMaterialCost = materials.reduce((sum, material) => sum + material.total, 0);
  const totalLaborCost = labor.reduce((sum, laborItem) => sum + laborItem.total, 0);
  const directCost = totalMaterialCost + totalLaborCost;
  
  const calculatedOverheads = overheads.map(overhead => ({
    ...overhead,
    amount: (directCost * overhead.percentage) / 100
  }));
  
  const totalOverheadCost = calculatedOverheads.reduce((sum, overhead) => sum + overhead.amount, 0);
  const totalCost = directCost + totalOverheadCost;
  const profitAmount = (totalCost * profitMargin) / 100;
  const sellingPrice = totalCost + profitAmount;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calculator className="h-6 w-6 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Costing Calculator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Cotton T-Shirt"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Material Costs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Material Costs</CardTitle>
              <Button onClick={addMaterial} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Material
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {materials.map((material) => (
                <div key={material.id} className="grid grid-cols-5 gap-2 items-end">
                  <div>
                    <Label>Material</Label>
                    <Input
                      value={material.name}
                      onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                      placeholder="Material name"
                    />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={material.quantity}
                      onChange={(e) => updateMaterial(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Unit Cost ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={material.unitCost}
                      onChange={(e) => updateMaterial(material.id, 'unitCost', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Total ($)</Label>
                    <Input value={material.total.toFixed(2)} readOnly className="bg-gray-100" />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeMaterial(material.id)}
                    disabled={materials.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Labor Costs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Labor Costs</CardTitle>
              <Button onClick={addLabor} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Operation
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {labor.map((laborItem) => (
                <div key={laborItem.id} className="grid grid-cols-5 gap-2 items-end">
                  <div>
                    <Label>Operation</Label>
                    <Input
                      value={laborItem.operation}
                      onChange={(e) => updateLabor(laborItem.id, 'operation', e.target.value)}
                      placeholder="Operation name"
                    />
                  </div>
                  <div>
                    <Label>Time (min)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={laborItem.timeMinutes}
                      onChange={(e) => updateLabor(laborItem.id, 'timeMinutes', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Rate/min ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={laborItem.ratePerMinute}
                      onChange={(e) => updateLabor(laborItem.id, 'ratePerMinute', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Total ($)</Label>
                    <Input value={laborItem.total.toFixed(2)} readOnly className="bg-gray-100" />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeLabor(laborItem.id)}
                    disabled={labor.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Overhead Costs */}
          <Card>
            <CardHeader>
              <CardTitle>Overhead Costs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {overheads.map((overhead) => (
                <div key={overhead.id} className="grid grid-cols-4 gap-2 items-end">
                  <div>
                    <Label>Type</Label>
                    <Input
                      value={overhead.type}
                      onChange={(e) => updateOverhead(overhead.id, 'type', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Percentage (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={overhead.percentage}
                      onChange={(e) => updateOverhead(overhead.id, 'percentage', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Amount ($)</Label>
                    <Input 
                      value={((directCost * overhead.percentage) / 100).toFixed(2)} 
                      readOnly 
                      className="bg-gray-100" 
                    />
                  </div>
                  <div></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Cost Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Cost Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Material Cost:</span>
                  <Badge variant="outline">${totalMaterialCost.toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Labor Cost:</span>
                  <Badge variant="outline">${totalLaborCost.toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Direct Cost:</span>
                  <Badge>${directCost.toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Overhead Cost:</span>
                  <Badge variant="outline">${totalOverheadCost.toFixed(2)}</Badge>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total Cost:</span>
                    <Badge variant="secondary">${totalCost.toFixed(2)}</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Profit Margin (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="flex justify-between">
                  <span>Profit Amount:</span>
                  <Badge variant="outline">${profitAmount.toFixed(2)}</Badge>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Selling Price:</span>
                    <Badge className="bg-green-600 text-white text-lg">
                      ${sellingPrice.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CostingCalculator;
