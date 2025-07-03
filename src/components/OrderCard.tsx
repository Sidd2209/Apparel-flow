
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/types';
import { Calendar, User, Package } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusUpdate?: (orderId: string, newStatus: string) => void;
}

const statusColors = {
  pending: 'bg-gray-500',
  'in-progress': 'bg-blue-500',
  sampling: 'bg-purple-500',
  approved: 'bg-green-500',
  production: 'bg-orange-500',
  shipped: 'bg-teal-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-red-500',
};

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusUpdate }) => {
  const isOverdue = new Date(order.deadline) < new Date() && order.status !== 'delivered';

  return (
    <Card className={`transition-all hover:shadow-md ${isOverdue ? 'border-red-200 bg-red-50/50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {order.orderNumber}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={`${priorityColors[order.priority]} text-white`}>
              {order.priority}
            </Badge>
            <Badge className={`${statusColors[order.status]} text-white`}>
              {order.status}
            </Badge>
          </div>
        </div>
        <p className="text-gray-600">{order.customerName}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span>{order.productType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Qty:</span>
            <span>{order.quantity.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {new Date(order.deadline).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span>{order.assignedTo}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-lg font-semibold text-green-600">
            ${order.totalValue.toLocaleString()}
          </span>
          {onStatusUpdate && (
            <Button size="sm" variant="outline">
              Update Status
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
