"use client"

import PricingCard from "./PricingCard"

export default function SubscriptionSection() {
  const plans = [
    {
      id: "basic",
      planName: "Basic Plan",
      description: "One time fee for one listing or task highlighted in search results.",
      monthlyPrice: 29,
      features: [
        "1 Listing",
        "30 Days Visibility",
        "Highlighted in Search Results",
        "4 Revisions",
        "9 days Delivery Time",
        "Products Support",
      ],
      highlighted: false,
    },
    {
      id: "pro",
      planName: "Pro Plan",
      description: "One time fee for one listing or task highlighted in search results.",
      monthlyPrice: 49,
      features: [
        "1 Listing",
        "30 Days Visibility",
        "Highlighted in Search Results",
        "4 Revisions",
        "9 days Delivery Time",
        "Products Support",
      ],
      highlighted: true,
    },
    {
      id: "elite",
      planName: "Elite Plan",
      description: "One time fee for one listing or task highlighted in search results.",
      monthlyPrice: 129,
      features: [
        "1 Listing",
        "30 Days Visibility",
        "Highlighted in Search Results",
        "4 Revisions",
        "9 days Delivery Time",
        "Products Support",
      ],
      highlighted: false,
    },
  ]

  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Membership Plans
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Give your visitors a smooth online experience with a solid UX design.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className="transition-all duration-300 hover:scale-[1.02] hover:z-10"
            >
              <PricingCard
                price={plan.monthlyPrice}
                period="monthly"
                planName={plan.planName}
                description={plan.description}
                features={plan.features}
                highlighted={plan.highlighted}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
