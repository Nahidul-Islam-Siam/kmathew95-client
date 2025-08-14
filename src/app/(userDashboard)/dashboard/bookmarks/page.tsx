import FavoriteJob from "@/components/Pages/FavoritePage/FavoriteJob";
import FavoriteTraders from "@/components/Pages/FavoritePage/FavoriteTraders";
import { Heart } from "lucide-react";
import React from "react";

const BookMark = () => {
  return (
    <div className=" min-h-screen pb-10">
      <h1 className="text-center text-3xl font-bold"> Favorite </h1>
      <div className="flex flex-col  space-y-10 mt-10">
        <div>
          <h1 className="text-2xl font-bold mb-7">
            <span className="flex items-center gap-2">
              <Heart /> Favorite Job
            </span>
          </h1>
          <div className="overflow-x-auto
           border-1 rounded-md py-6 md:px-10 max-h-[calc(60vh)]">
            <FavoriteJob />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-7">
            <span className="flex items-center gap-2">
              <Heart /> Favorite Traders
            </span>
          </h1>
          <div className="overflow-x-auto border-1 rounded-md py-6 md:px-10 max-h-[calc(60vh)]">
            <FavoriteTraders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookMark;
