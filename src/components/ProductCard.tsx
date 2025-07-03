
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Product } from '@/types';
import { User, Calendar, FileText } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const stageProgress = {
  ideation: 10,
  'initial-design': 25,
  'tech-pack': 40,
  'proto-sample': 60,
  'fit-sample': 80,
  'final-approval': 100,
};

const statusColors = {
  concept: 'bg-gray-500',
  design: 'bg-blue-500',
  sampling: 'bg-purple-500',
  approved: 'bg-green-500',
  'production-ready': 'bg-emerald-500',
  discontinued: 'bg-red-500',
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const progress = stageProgress[product.developmentStage];
  const activeSamples = product.samples.filter(s => s.status !== 'approved' && s.status !== 'rejected').length;

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {product.name}
          </CardTitle>
          <Badge className={`${statusColors[product.status]} text-white`}>
            {product.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{product.sku} • {product.category}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Development Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 capitalize">
            Current stage: {product.developmentStage.replace('-', ' ')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span>{product.designer}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{product.season}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span>{product.designFiles.length} files</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-600 font-medium">
              {activeSamples} active samples
            </span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            Updated {new Date(product.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
