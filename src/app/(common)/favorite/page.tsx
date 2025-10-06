"use client";
import FavoriteJob from "@/components/Pages/FavoritePage/FavoriteJob";
import FavoriteTraders from "@/components/Pages/FavoritePage/FavoriteTraders";
import { useDeleteFavoriteMutation, useGetAllFavoritesQuery } from "@/redux/service/favourite";
import { Heart } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

const Favorite = () => {
  const { data, isLoading, isError } = useGetAllFavoritesQuery();
  const [deleteFavorite] = useDeleteFavoriteMutation();

  // Extract the list of favorite items: data.data.data
  const favorites = data?.data?.data || [];

  // Filter by type
  const favoriteJobs = favorites.filter((fav) => fav.type === "TASK");
  const favoriteTraders = favorites.filter((fav) => fav.type === "TRADER");


  const handleDelete = async (id: string) => {
    try {
      const response = await deleteFavorite({ id }).unwrap();
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your favorite has been deleted.",
        });
        // Optionally, refetch the favorites or update the UI
        // For example, you could call the getAllFavorites query again
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete your favorite.",
        });
      }
    } catch (error) {
      toast.error("Failed to delete favorite.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 min-h-screen flex justify-center">
        <p className="text-lg text-gray-600">Loading your favorites...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10 min-h-screen flex justify-center">
        <p className="text-red-500">Failed to load favorites. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 min-h-screen">
      <h1 className="text-center text-3xl font-bold mb-10 text-gray-800">My Favorites</h1>

      <div className="flex flex-col space-y-12">
        {/* Favorite Jobs */}
        <section>
          <h2 className="text-2xl font-bold mb-7 flex items-center gap-2 text-gray-800">
            <Heart className="text-red-500" size={24} /> Favorite Jobs
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white py-6 px-10 max-h-[60vh] shadow-sm">
            {favoriteJobs.length > 0 ? (
              <FavoriteJob jobs={favoriteJobs} onDelete={handleDelete} />
            ) : (
              <p className="text-gray-500 text-center py-6">You haven&apos;t favorited any jobs yet.</p>
            )}
          </div>
        </section>

        {/* Favorite Traders */}
        <section>
          <h2 className="text-2xl font-bold mb-7 flex items-center gap-2 text-gray-800">
            <Heart className="text-red-500" size={24} /> Favorite Traders
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white py-6 px-10 max-h-[60vh] shadow-sm">
            {favoriteTraders.length > 0 ? (
              <FavoriteTraders traders={favoriteTraders} onDelete={handleDelete} />
            ) : (
              <p className="text-gray-500 text-center py-6">You haven&apos;t favorited any traders yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Favorite;