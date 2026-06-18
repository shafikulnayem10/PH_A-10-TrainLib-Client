"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

import { addClassToFavorites } from "@/lib/api/classes";

export default function ActionButtons({ classId, initialIsBooked, initialIsFavorite, userEmail, classData }) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const handleFavoriteToggle = async () => {
    setIsFavoriteLoading(true);
    try {
 
      const payload = {
        classId: classId,
        userEmail: userEmail,
        className: classData?.name || classData?.className,
        image: classData?.image,
        category: classData?.category,
        trainerName: classData?.trainerName
      };

      const response = await addClassToFavorites(payload);

      if (response.success) {
      
        setIsFavorite(response.isFavorite);
        
        if (response.isFavorite) {
          toast.success("Successfully added to your favorites!");
        } else {
          toast.success("Successfully removed from your favorites!");
        }
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update favorite status.");
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Book Now Button */}
      <Button className="w-full bg-blue-600 text-white font-extrabold h-12 rounded-xl">
        BOOK NOW
      </Button>

      {/* Favorite Button */}
      <Button
        onClick={handleFavoriteToggle}
        isLoading={isFavoriteLoading}
        variant={isFavorite ? "solid" : "bordered"}
        className={`w-full h-12 rounded-xl font-extrabold border-blue-600 transition-all ${
          isFavorite 
            ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100" 
            : "text-blue-600 hover:bg-blue-50"
        }`}
      >
        <Heart className={isFavorite ? "fill-current text-rose-600" : ""} size={16} />
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </Button>
    </div>
  );
}