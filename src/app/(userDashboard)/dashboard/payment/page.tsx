import { Button } from "@/components/ui/button";

interface PaymentItem {
  id: string;
  name: string;
  amount: number;
}

const fakePaymentData: PaymentItem[] = [
  { id: "1", name: "Build A Dashboard", amount: 22 },
  { id: "2", name: "Subscription / Elite", amount: 49 },
  { id: "3", name: "Boost Post", amount: 22 },
  { id: "4", name: "Build A Dashboard", amount: 22 },
];

export default function payment() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="text-center mb-10 mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment</h1>
        <p className="text-base text-gray-600">We are glad to see you again!</p>
      </div>

      {/* Payment History Section */}
      <div className="w-full max-w-5xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Payment History
        </h2>
        <div className="space-y-4">
          {fakePaymentData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            >
              <span className="text-lg font-medium text-gray-700">
                {item.name}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-800">
                  ${item.amount}
                </span>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
