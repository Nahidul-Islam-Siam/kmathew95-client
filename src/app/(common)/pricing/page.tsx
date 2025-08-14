import PricingPage from "@/components/Pages/Pricing/PricingPage";
import React from "react";

const pricing = () => {
  return (
    <div className="min-h-screen mx-auto container my-10">
      <h1 className="text-4xl flex flex-col text-center md:text-5xl font-bold text-gray-800 mb-6">
        <span>
          Choose the <span className="text-orange-500">Right Plan</span> for
        </span>
        <span className="mt-5">Your Skill Trade Journey</span>
      </h1>

      <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
        SkillSwitch offers flexible plans for every kind of user — whether
        you&apos;re just starting out or ready to go pro. Compare features and
        find the perfect fit to unlock more opportunities.
      </p>
      <div>
        <PricingPage />
      </div>
    </div>
  );
};

export default pricing;
