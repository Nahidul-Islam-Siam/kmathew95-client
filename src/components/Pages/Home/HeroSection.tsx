import Image from "next/image";
import hero1 from "@/assets/hero/Rectangle 158.png";
import hero2 from "@/assets/hero/Rectangle 157.png";
import { SearchBar } from "./SearchBar";


export default function Hero() {
    return (
        <div className="min-h-screen bg-[#1C2A47] relative overflow-hidden">

            {/* Hero Content */}
            <div className="container mx-auto md:py-16 py-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="space-y-4 text-center md:text-left">
                            <h1 className="text-orange-500 text-4xl md:text-5xl font-bold">No Money ?</h1>
                            <h2 className="text-white text-4xl md:text-5xl font-bold">No Problem</h2>
                            <p className="text-gray-300 text-lg max-w-md">
                                It is a long established fact that a reader will be distracted by the readable content
                            </p>
                        </div>

                        {/* Checklist Section */}
                 <    SearchBar/>
                    </div>

                    {/* Right Content - Image Collage */}
                    <div className="relative">
                        <div className="flex flex-row md:flex-row items-end gap-3">
                            <div className="relative w-full lg:w-1/2">
                                <Image
                                    src={hero1}
                                    alt="People collaborating and working together"
                                    width={500}
                                    height={500}
                                    className="object-cover rounded-md w-full"
                                    priority
                                />
                            </div>
                            <div className="relative w-full lg:w-1/2">
                                <Image
                                    src={hero2}
                                    alt="People collaborating and working together"
                                    width={500}
                                    height={600}
                                    className="object-cover rounded-md w-full"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}