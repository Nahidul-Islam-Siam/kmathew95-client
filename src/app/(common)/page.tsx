
import ContactUsSection from "@/components/Pages/Home/ContactUs";
import FeatureSection from "@/components/Pages/Home/FeaturedSection";
import Hero from "@/components/Pages/Home/HeroSection";
import TraderCategorySection from "@/components/Pages/Home/CategorySection";
import StatsSection from "@/components/Pages/Home/StatsCard";
// import TrendingServices from "@/components/Pages/Home/TrendingSection";
import RatedTraderSection from "@/components/Pages/Home/RatedTraderSection";
import TestimonialSection from "@/components/Pages/Home/TestimonialSection";
import SubscriptionSection from "@/components/Pages/Home/SubscriptionSection";
import AllServicesPage from "@/components/Pages/AllServices/AllServicesPage";

const HompPage = () => {
  return <div className="">
    <Hero />
    <FeatureSection />
    {/* <AllServicesPage /> */}
    {/* <TrendingServices /> */}
    <ContactUsSection />
    <StatsSection />
    <TraderCategorySection />
    <RatedTraderSection />
    <TestimonialSection />
    <SubscriptionSection />
  </div>
};

export default HompPage; 
