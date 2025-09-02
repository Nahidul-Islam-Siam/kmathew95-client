import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

import Image from "next/image";
import { Trader } from "@/redux/service/favourite";

interface FavoriteTradersProps {
  traders: Trader[];
  onDelete: (id: string) => void;
}


const FavoriteTraders = ({ traders, onDelete }: FavoriteTradersProps) => {
  const handleDelete = (id: string) => {
    onDelete(id);
  };
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {traders.map((trader) => (
          <div
            key={trader.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row items-center p-4 gap-4">
              {/* Company Logo */}
              <div className="flex-shrink-0 w-24 h-24 border-3 rounded-full border-blue-600 flex items-center justify-center">
                <Image
                  src="/images/profiles/avatar1.png"
                  alt={`${trader.name} logo`}
                  width={300}
                  height={300}
                  className="rounded-full object-contain"
                />
              </div>

              {/* Job Details */}
              <div className="flex-1 w-full">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {trader.name}
                </h3>
                <p className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2 my-2">
                  {trader.title}
                </p>
                <div className="flex flex-wrap justify-between items-center mt-2">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-orange-500 text-xl">★</span>
                    <span className="font-semibold text-gray-900">4.5/5</span>
                  </div>

                  <Button
                  
                    size="extraSmall"
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full"
                    onClick={() => handleDelete(trader.id)}
                  >
                    Remove
                  </Button>

                  <Link href={`/all-traders/${trader.id}`}>
                    <Button
                      size="extraSmall"
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded-full"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteTraders;
