import Image from "next/image";
import img from '@/assets/hero/Group 4302.png'

export default function ContactUsSection() {
    return (
      <section className="w-full bg-white py-12 md:py-16 lg:py-20 font-dm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h4 className="text-[#E57931] text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                For Trader
              </h4>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold text-[#1C2A47] mb-4 md:mb-6">
                Discover talent tailored to your needs.
              </h2>
              <p className="text-[#1A1A1A] text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0">
                Team up with the biggest crew of freelancers and get stuff done—whether you need something quick or a major overhaul!
              </p>
              <button className="bg-[#E57931] hover:bg-orange-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full shadow-md transition-all duration-300 font-medium text-sm sm:text-base md:text-lg">
                Contact Us
              </button>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-full h-auto rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={img}
                  alt="Freelancer at work"
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}