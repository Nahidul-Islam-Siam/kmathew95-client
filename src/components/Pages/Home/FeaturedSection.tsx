import { MonitorPlay, LayoutGrid, HandCoins, Headphones } from "lucide-react";
import FeatureCard from "./FeaturedCard";
import TextArea from "antd/es/input/TextArea";
import { Button } from "@/components/ui/button";
 

export default function FeatureSection() {
  const features = [
    {
      icon: MonitorPlay,
      title: "Post a job",
      description: "It is a long established fact that a reader will be distracted by the readable content.",
    },
    {
      icon: LayoutGrid,
      title: "Find Trader",
      description: "It is a long established fact that a reader will be distracted by the readable content.",
    },
    {
      icon: HandCoins,
      title: "Pay safely",
      description: "It is a long established fact that a reader will be distracted by the readable content.",
    },
    {
      icon: Headphones,
      title: "We're here to help",
      description: "It is a long established fact that a reader will be distracted by the readable content.",
    },
  ];

  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white font-dm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        {/* <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1C2A47] mb-4">
            What We Do?
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            It is a long established fact that a reader will be distracted by readable content
          </p>
        </div> */}
        <div className="flex justify-center items-center mb-12">
          <div className="text-center">
            <h1 className="text-[#E57931] text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
             What We Do?
            </h1>
            <h2 className="text-gray-600 text-base">It is a long established fact that a reader will be distracted by readable content</h2>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="transition-all duration-300 hover:scale-[1.03] hover:z-10"
            >
              <FeatureCard
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}