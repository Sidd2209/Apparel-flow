import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, DollarSign, Plus, Trash2 } from 'lucide-react';

interface CostBreakdown {
  materials: MaterialCost[];
  labor: LaborCost[];
  overheads: OverheadCost[];
}

interface MaterialCost {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  currency: string;
  total: number;
}

interface LaborCost {
  id: string;
  operation: string;
  timeMinutes: number;
  ratePerHour: number;
  currency: string;
  total: number;
}

interface OverheadCost {
  id: string;
  category: string;
  amount: number;
  currency: string;
  type: 'fixed' | 'percentage';
}

interface TaxConfiguration {
  vatRate: number;
  customsDuty: number;
  otherTaxes: number;
  currency: string;
}

const CostingCalculator: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates] = useState({
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    INR: 82.5,
    CNY: 7.2
  });

  const [taxConfig, setTaxConfig] = useState<TaxConfiguration>({
    vatRate: 10,
    customsDuty: 5,
    otherTaxes: 2,
    currency: 'USD'
  });

  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown>({
    materials: [
      {
        id: '1',
        name: 'Cotton Fabric',
        quantity: 2.5,
        unit: 'yards',
        unitCost: 8.50,
        currency: 'USD',
        total: 21.25
      }
    ],
    labor: [
      {
        id: '1',
        operation: 'Cutting',
        timeMinutes: 15,
        ratePerHour: 12,
        currency: 'USD',
        total: 3.00
      }
    ],
    overheads: [
      {
        id: '1',
        category: 'Factory Overhead',
        amount: 15,
        currency: 'USD',
        type: 'percentage'
      }
    ]
  });

  const [profitMargin, setProfitMargin] = useState(30);

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (fromCurrency === toCurrency) return amount;
    const usdAmount = amount / exchangeRates[fromCurrency as keyof typeof exchangeRates];
    return usdAmount * exchangeRates[toCurrency as keyof typeof exchangeRates];
  };

  const calculateTotalMaterialCost = () => {
    return costBreakdown.materials.reduce((sum, material) => {
      const convertedCost = convertCurrency(material.total, material.currency, selectedCurrency);
      return sum + convertedCost;
    }, 0);
  };

  const calculateTotalLaborCost = () => {
    return costBreakdown.labor.reduce((sum, labor) => {
      const convertedCost = convertCurrency(labor.total, labor.currency, selectedCurrency);
      return sum + convertedCost;
    }, 0);
  };

  const calculateTotalOverheadCost = () => {
    const baseCost = calculateTotalMaterialCost() + calculateTotalLaborCost();
    return costBreakdown.overheads.reduce((sum, overhead) => {
      let overheadAmount = 0;
      if (overhead.type === 'percentage') {
        overheadAmount = (baseCost * overhead.amount) / 100;
      } else {
        overheadAmount = convertCurrency(overhead.amount, overhead.currency, selectedCurrency);
      }
      return sum + overheadAmount;
    }, 0);
  };

  const calculateSubtotal = () => {
    return calculateTotalMaterialCost() + calculateTotalLaborCost() + calculateTotalOverheadCost();
  };

  const calculateTaxes = () => {
    const subtotal = calculateSubtotal();
    const vatAmount = (subtotal * taxConfig.vatRate) / 100;
    const customsAmount = (subtotal * taxConfig.customsDuty) / 100;
    const otherTaxAmount = (subtotal * taxConfig.otherTaxes) / 100;
    return vatAmount + customsAmount + otherTaxAmount;
  };

  const calculateTotalCost = () => {
    return calculateSubtotal() + calculateTaxes();
  };

  const calculateSellingPrice = () => {
    const totalCost = calculateTotalCost();
    return totalCost * (1 + profitMargin / 100);
  };

  const addMaterial = () => {
    const newMaterial: MaterialCost = {
      id: Date.now().toString(),
      name: '',
      quantity: 0,
      unit: 'pieces',
      unitCost: 0,
      currency: selectedCurrency,
      total: 0
    };
    setCostBreakdown(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));
  };

  const addLabor = () => {
    const newLabor: LaborCost = {
      id: Date.now().toString(),
      operation: '',
      timeMinutes: 0,
      ratePerHour: 0,
      currency: selectedCurrency,
      total: 0
    };
    setCostBreakdown(prev => ({
      ...prev,
      labor: [...prev.labor, newLabor]
    }));
  };

  const addOverhead = () => {
    const newOverhead: OverheadCost = {
      id: Date.now().toString(),
      category: '',
      amount: 0,
      currency: selectedCurrency,
      type: 'fixed'
    };
    setCostBreakdown(prev => ({
      ...prev,
      overheads: [...prev.overheads, newOverhead]
    }));
  };

  const currencySymbol = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CNY: '¥'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calculator className="h-6 w-6 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Multi-Currency Costing Calculator</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Base Currency</Label>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
              <SelectItem value="INR">INR - Indian Rupee</SelectItem>
              <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Profit Margin (%)</Label>
          <Input
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(Number(e.target.value))}
            placeholder="30"
          />
        </div>
      </div>

      <Tabs defaultValue="materials" className="space-y-6">
        <TabsList>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="labor">Labor</TabsTrigger>
          <TabsTrigger value="overheads">Overheads</TabsTrigger>
          <TabsTrigger value="taxes">Tax Configuration</TabsTrigger>
          <TabsTrigger value="summary">Cost Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Material Costs</CardTitle>
              <Button onClick={addMaterial}>
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costBreakdown.materials.map((material, index) => (
                  <Card key={material.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <Label>Material Name</Label>
                        <Input
                          value={material.name}
                          onChange={(e) => {
                            const updated = [...costBreakdown.materials];
                            updated[index].name = e.target.value;
                            setCostBreakdown(prev => ({ ...prev, materials: updated }));
                          }}
                          placeholder="e.g., Cotton Fabric"
                        />
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={material.quantity}
                          onChange={(e) => {
                            const updated = [...costBreakdown.materials];
                            updated[index].quantity = Number(e.target.value);
                            updated[index].total = updated[index].quantity * updated[index].unitCost;
                            setCostBreakdown(prev => ({ ...prev, materials: updated }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <Select
                          value={material.unit}
                          onValueChange={(value) => {
                            const updated = [...costBreakdown.materials];
                            updated[index].unit = value;
                            setCostBreakdown(prev => ({ ...prev, materials: updated }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yards">Yards</SelectItem>
                            <SelectItem value="meters">Meters</SelectItem>
                            <SelectItem value="pieces">Pieces</SelectItem>
                            <SelectItem value="kg">Kilograms</SelectItem>
                            <SelectItem value="lbs">Pounds</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Unit Cost</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={material.unitCost}
                          onChange={(e) => {
                            const updated = [...costBreakdown.materials];
                            updated[index].unitCost = Number(e.target.value);
                            updated[index].total = updated[index].quantity * updated[index].unitCost;
                            setCostBreakdown(prev => ({ ...prev, materials: updated }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <Select
                          value={material.currency}
                          onValueChange={(value) => {
                            const updated = [...costBreakdown.materials];
                            updated[index].currency = value;
                            setCostBreakdown(prev => ({ ...prev, materials: updated }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                            <SelectItem value="CNY">CNY</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <div className="flex-1">
                          <Label>Total</Label>
                          <div className="text-lg font-semibold">
                            {currencySymbol[material.currency as keyof typeof currencySymbol]}{material.total.toFixed(2)}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = costBreakdown.materials.filter(m => m.id !== material.id);
                            setCostBreakdown(prev => ({ ...prev, materials: updated }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labor" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Labor Costs</CardTitle>
              <Button onClick={addLabor}>
                <Plus className="h-4 w-4 mr-2" />
                Add Labor
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costBreakdown.labor.map((labor, index) => (
                  <Card key={labor.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <Label>Operation</Label>
                        <Input
                          value={labor.operation}
                          onChange={(e) => {
                            const updated = [...costBreakdown.labor];
                            updated[index].operation = e.target.value;
                            setCostBreakdown(prev => ({ ...prev, labor: updated }));
                          }}
                          placeholder="e.g., Cutting"
                        />
                      </div>
                      <div>
                        <Label>Time (minutes)</Label>
                        <Input
                          type="number"
                          value={labor.timeMinutes}
                          onChange={(e) => {
                            const updated = [...costBreakdown.labor];
                            updated[index].timeMinutes = Number(e.target.value);
                            updated[index].total = (updated[index].timeMinutes / 60) * updated[index].ratePerHour;
                            setCostBreakdown(prev => ({ ...prev, labor: updated }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Rate per Hour</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={labor.ratePerHour}
                          onChange={(e) => {
                            const updated = [...costBreakdown.labor];
                            updated[index].ratePerHour = Number(e.target.value);
                            updated[index].total = (updated[index].timeMinutes / 60) * updated[index].ratePerHour;
                            setCostBreakdown(prev => ({ ...prev, labor: updated }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <Select
                          value={labor.currency}
                          onValueChange={(value) => {
                            const updated = [...costBreakdown.labor];
                            updated[index].currency = value;
                            setCostBreakdown(prev => ({ ...prev, labor: updated }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                            <SelectItem value="CNY">CNY</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <div className="flex-1">
                          <Label>Total</Label>
                          <div className="text-lg font-semibold">
                            {currencySymbol[labor.currency as keyof typeof currencySymbol]}{labor.total.toFixed(2)}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = costBreakdown.labor.filter(l => l.id !== labor.id);
                            setCostBreakdown(prev => ({ ...prev, labor: updated }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overheads" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Overhead Costs</CardTitle>
              <Button onClick={addOverhead}>
                <Plus className="h-4 w-4 mr-2" />
                Add Overhead
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costBreakdown.overheads.map((overhead, index) => (
                  <Card key={overhead.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={overhead.category}
                          onChange={(e) => {
                            const updated = [...costBreakdown.overheads];
                            updated[index].category = e.target.value;
                            setCostBreakdown(prev => ({ ...prev, overheads: updated }));
                          }}
                          placeholder="e.g., Factory Overhead"
                        />
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={overhead.amount}
                          onChange={(e) => {
                            const updated = [...costBreakdown.overheads];
                            updated[index].amount = Number(e.target.value);
                            setCostBreakdown(prev => ({ ...prev, overheads: updated }));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <Select
                          value={overhead.currency}
                          onValueChange={(value) => {
                            const updated = [...costBreakdown.overheads];
                            updated[index].currency = value;
                            setCostBreakdown(prev => ({ ...prev, overheads: updated }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                            <SelectItem value="CNY">CNY</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={overhead.type}
                          onValueChange={(value) => {
                            const updated = [...costBreakdown.overheads];
                            updated[index].type = value as 'fixed' | 'percentage';
                            setCostBreakdown(prev => ({ ...prev, overheads: updated }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = costBreakdown.overheads.filter(o => o.id !== overhead.id);
                            setCostBreakdown(prev => ({ ...prev, overheads: updated }));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>VAT/Sales Tax Rate (%)</Label>
                    <Input
                      type="number"
                      value={taxConfig.vatRate}
                      onChange={(e) => setTaxConfig(prev => ({ ...prev, vatRate: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Customs Duty Rate (%)</Label>
                    <Input
                      type="number"
                      value={taxConfig.customsDuty}
                      onChange={(e) => setTaxConfig(prev => ({ ...prev, customsDuty: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Other Taxes Rate (%)</Label>
                    <Input
                      type="number"
                      value={taxConfig.otherTaxes}
                      onChange={(e) => setTaxConfig(prev => ({ ...prev, otherTaxes: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-semibold mb-4">Tax Preview</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT ({taxConfig.vatRate}%):</span>
                      <span>{currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{((calculateSubtotal() * taxConfig.vatRate) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customs ({taxConfig.customsDuty}%):</span>
                      <span>{currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{((calculateSubtotal() * taxConfig.customsDuty) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Taxes ({taxConfig.otherTaxes}%):</span>
                      <span>{currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{((calculateSubtotal() * taxConfig.otherTaxes) / 100).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 font-semibold flex justify-between">
                      <span>Total Taxes:</span>
                      <span>{currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{calculateTaxes().toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Materials:</span>
                    <span className="font-semibold">
                      {currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{calculateTotalMaterialCost().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor:</span>
                    <span className="font-semibold">
                      {currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{calculateTotalLaborCost().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overheads:</span>
                    <span className="font-semibold">
                      {currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{calculateTotalOverheadCost().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes:</span>
                    <span className="font-semibold">
                      {currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{calculateTaxes().toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Cost:</span>
                      <span className="text-red-600">
                        {currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{calculateTotalCost().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-semibold">
                      {currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{calculateTotalCost().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin ({profitMargin}%):</span>
                    <span className="font-semibold text-green-600">
                      {currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{(calculateTotalCost() * (profitMargin / 100)).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Selling Price:</span>
                      <span className="text-green-600">
                        {currencySymbol[selectedCurrency as keyof typeof currencySymbol]}{calculateSellingPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Multi-Currency Summary</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(exchangeRates).map(([currency, rate]) => (
                        <div key={currency} className="flex justify-between">
                          <span>{currency}:</span>
                          <span>
                            {currencySymbol[currency as keyof typeof currencySymbol]}
                            {convertCurrency(calculateSellingPrice(), selectedCurrency, currency).toFixed(2)}
                          </span>
                        </div>
                      ))}
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

export default CostingCalculator;
