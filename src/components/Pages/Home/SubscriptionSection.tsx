/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCreateUserSubscriptionMutation, useGetSubscriptionPlanQuery } from "@/redux/service/admin/subscriptionPlan";
import PricingCard from "./PricingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { redirect } from "next/navigation";

// 🔽 Fallback / Mock Subscription Plans
const fallbackPlans = [
  {
    id: "plan_fallback_basic",
    name: "BASIC_PLAN",
    price: 9.99,
    description: "Perfect for freelancers starting out.",
    featuresList: [
      "10 Task Posts per Month",
      "Basic Profile Visibility",
      "Email Support",
      "No Commission on Earnings",
    ],
    plan: "BASIC_PLAN",
    stripePriceId: "price_fallback_basic",
  },
  {
    id: "plan_fallback_pro",
    name: "PRO_PLAN",
    price: 29.99,
    description: "Best for active freelancers and agencies.",
    featuresList: [
      "Unlimited Task Posts",
      "Featured Profile Badge",
      "Priority Support",
      "Analytics Dashboard",
      "No Commission on Earnings",
    ],
    plan: "PRO_PLAN",
    stripePriceId: "price_fallback_pro",
  },
  {
    id: "plan_fallback_elite",
    name: "ELITE_PLAN",
    price: 59.99,
    description: "For top-tier professionals and teams.",
    featuresList: [
      "Unlimited Everything",
      "VIP Profile Placement",
      "24/7 Dedicated Support",
      "Advanced Analytics",
      "Team Collaboration Tools",
      "No Commission on Earnings",
    ],
    plan: "ELITE_PLAN",
    stripePriceId: "price_fallback_elite",
  },
];

// Map plan codes to display names
const PLAN_DISPLAY_NAMES: Record<string, string> = {
  PRO_PLAN: "Pro Plan",
  ELITE_PLAN: "Elite Plan",
  BASIC_PLAN: "Basic Plan",
};

const PLAN_HIGHLIGHTED: Record<string, boolean> = {
  PRO_PLAN: true,
  ELITE_PLAN: false,
  BASIC_PLAN: false,
};

export default function SubscriptionSection() {
  const { data: plansData, isLoading, isError } = useGetSubscriptionPlanQuery({});
  const [createUserSubscription] = useCreateUserSubscriptionMutation();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Use real data or fallback
  const subscriptionPlans = isError || !plansData?.success || !plansData?.data?.data?.length
    ? fallbackPlans
    : plansData.data.data;

  // Transform API or fallback data to match PricingCard
  const formattedPlans = subscriptionPlans.map((plan) => ({
    id: plan.id,
    monthlyPrice: plan.price,
    planName: plan.name || PLAN_DISPLAY_NAMES[plan.plan] || plan.plan,
    description: plan.description,
    features: plan.featuresList,
    highlighted: PLAN_HIGHLIGHTED[plan.plan] ?? false,
    stripePriceId: plan.stripePriceId,
  }));

  // Handle subscription: create session and redirect to Stripe
  const handleSubscribe = async (priceId: string) => {
    try {
      // Check if we're using a fallback plan
      const isFallback = priceId.startsWith("price_fallback_");

      if (isFallback) {
        toast.info("Demo Mode: Redirect to Stripe would happen in production.");
        window.open("https://stripe.com/demo-checkout", "_blank", "noopener,noreferrer");
        return;
      }

      if (!accessToken) {
        toast.info("Please log in to subscribe.");
        redirect("/login");
        return;
      }

      const res = await createUserSubscription({ subscriptionPlanId: priceId }).unwrap();
      const sessionUrl = res?.data?.session?.sessionUrl;

      if (res?.success && sessionUrl) {
        window.open(sessionUrl, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error(res?.message || "Failed to get checkout URL");
      }
    } catch (error: any) {
      const errorMsg = error?.data?.message || "Failed to start checkout. Please try again.";
      toast.error(errorMsg);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <section className="w-full py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Loading Plans...</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 border rounded-xl bg-white shadow-sm">
                <Skeleton className="h-8 w-32 mx-auto mb-4" />
                <Skeleton className="h-6 w-48 mx-auto mb-6" />
                <div className="space-y-2 mb-8">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-12 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error State (but show fallback)
  if (isError || !plansData?.success) {
    return (
      <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Membership Plans
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Give your visitors a smooth online experience with a solid UX design.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
            {formattedPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                price={plan.monthlyPrice}
                period="monthly"
                planName={plan.planName}
                description={plan.description}
                features={plan.features}
                highlighted={plan.highlighted}
                stripePriceId={plan.stripePriceId}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Displaying demo plans due to temporary service unavailability.
          </div>
        </div>
      </section>
    );
  }

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
          {formattedPlans.length > 0 ? (
            formattedPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                price={plan.monthlyPrice}
                period="monthly"
                planName={plan.planName}
                description={plan.description}
                features={plan.features}
                highlighted={plan.highlighted}
                stripePriceId={plan.stripePriceId}
                onSubscribe={handleSubscribe}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No subscription plans available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}