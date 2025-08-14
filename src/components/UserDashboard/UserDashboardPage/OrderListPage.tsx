import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Order {
  id: string;
  plan: string;
  orderNumber: string;
  status: "Paid" | "Unpaid";
}

const orders: Order[] = [
  {
    id: "1",
    plan: "Professional Plan",
    orderNumber: "#326",
    status: "Paid",
  },
  {
    id: "2",
    plan: "Professional Plan",
    orderNumber: "#326",
    status: "Paid",
  },
  {
    id: "3",
    plan: "Professional Plan",
    orderNumber: "#326",
    status: "Unpaid",
  },
  {
    id: "4",
    plan: "Professional Plan",
    orderNumber: "#326",
    status: "Paid",
  },
];

export default function OrderListPage() {
  return (
    <Card className="w-full my-10 mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Order</h2>
          <p className="text-sm text-gray-500">Date: 14 April, 2025</p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex flex-col space-y-1">
                <p className="font-medium text-gray-900">{order.plan}</p>
                <p className="text-sm text-gray-500">
                  Order: {order.orderNumber}
                </p>
              </div>
              <Badge
                variant={order.status === "Paid" ? "default" : "outline"}
                className={
                  order.status === "Paid"
                    ? "bg-slate-800 hover:bg-slate-700 text-white"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                }
              >
                {order.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
