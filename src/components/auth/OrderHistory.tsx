import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

interface OrderHistoryProps {
  orders: any[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border p-4 rounded-lg">
                <p>Order #{order.id}</p>
                <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                <p>Total: ${order.total}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No orders yet</p>
        )}
      </CardContent>
    </Card>
  );
}