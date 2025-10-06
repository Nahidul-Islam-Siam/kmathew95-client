// PricingCard.tsx
import { Button } from "@/components/ui/button";
import { Card } from "antd";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PricingCardProps {
  price: number;
  period: string;
  planName: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  stripePriceId: string;
  onSubscribe: (priceId: string) => Promise<void>; // This will redirect internally
}

export default function PricingCard({
  price,
  period,
  planName,
  description,
  features,
  highlighted = false,
  stripePriceId,
  onSubscribe,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;

    setLoading(true);
    try {
      // This will trigger redirect inside `onSubscribe`
      await onSubscribe(stripePriceId);
    } catch (error) {
      // Error is already handled in `onSubscribe` with toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={`w-full mx-auto rounded-xl shadow-lg p-6 transition-all duration-300 ${
        highlighted ? "border-2 border-orange-500 scale-105" : "border border-gray-200"
      }`}
      style={{ maxWidth: "350px" }}
    >
      <div className="text-center">
        {/* Price */}
        <h3 className="text-4xl font-bold text-gray-900 mb-1">
          ${price}
          <span className="text-base font-normal text-gray-600"> / {period}</span>
        </h3>

        {/* Plan Name */}
        <h4 className="text-xl font-semibold text-gray-900 mb-2">{planName}</h4>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">{description}</p>

        {/* Features */}
        <ul className="space-y-3 text-gray-700 text-base mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full bg-orange-100 border border-orange-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Subscribe Button */}
        <Button
          className={`w-full py-6 rounded-full font-medium transition-all focus:outline-none focus:ring-2 ${
            highlighted
              ? "bg-slate-800 hover:bg-slate-700 text-white focus:ring-slate-500"
              : "bg-orange-100 hover:bg-orange-200 text-orange-800 focus:ring-orange-300"
          }`}
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
            </>
          ) : (
            "Buy Now"
          )}
        </Button>
      </div>
    </Card>
  );
}