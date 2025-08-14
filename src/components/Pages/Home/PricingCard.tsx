import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Card } from "antd"

interface PricingCardProps {
  price: number
  period: string
  planName: string
  description: string
  features: string[]
  highlighted?: boolean
}

export default function PricingCard({
  price,
  period,
  planName,
  description,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <Card
      className={`w-full mx-auto rounded-xl shadow-lg p-6 flex flex-col items-center text-center ${
        highlighted ? "border-2 border-orange-500" : "border border-gray-200"
      }`}
    >
      <CardContent className="flex flex-col items-center p-0 w-full mx-auto">
        <h3 className="text-4xl font-bold text-gray-900 mb-1">
          ${price}
          <span className="text-base font-normal text-gray-600"> / {period}</span>
        </h3>
        <h4 className="text-xl font-semibold text-gray-900 mb-2">{planName}</h4>
        <p className="text-sm text-gray-600 mb-6 max-w-[200px]">{description}</p>

        <ul className="space-y-3 text-gray-700 text-base mb-8 w-full">
          {features.map((feature, index) => (
            <li key={index} className="flex justify-center items-center">
              {feature}
            </li>
          ))}
        </ul>

        <Button
          variant="default"
          className={`w-full py-6 rounded-full text-base font-medium transition-colors duration-200 ${
            highlighted
              ? "bg-slate-800 hover:bg-slate-700 text-white"
              : "bg-orange-100 hover:bg-orange-200 text-orange-800"
          }`}
        >
          Buy Now
        </Button>
      </CardContent>
    </Card>
  )
}
