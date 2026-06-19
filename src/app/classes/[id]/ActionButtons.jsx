'use client';

import { useState } from "react";
import { Button } from "@heroui/react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from '@/lib/hooks/useSession';
import { addClassToFavorites } from "@/lib/api/classes";

export default function ActionButtons({ classId, initialIsBooked, initialIsFavorite, userEmail, classData }) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(initialIsBooked);
  const router = useRouter();

  const isBlocked = session?.user?.softBanned === true;

  const handleBookNowClick = () => {
    if (isBlocked) {
      toast.error('Action restricted by Admin. Your account has been blocked.', {
        duration: 5000,
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #fecaca',
        },
      });
      return;
    }

    if (isBooked) {
      toast.error("You have already booked this class");
      return;
    }

    toast.loading("Redirecting to payment...");
    router.push(`/payment/${classId}`);
  };

  const handleFavoriteToggle = async () => {
    if (isBlocked) {
      toast.error('Action restricted by Admin. Your account has been blocked.', {
        duration: 5000,
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #fecaca',
        },
      });
      return;
    }

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
      <Button 
        onClick={handleBookNowClick}
        variant={isBooked ? "flat" : "solid"}
        color={isBooked ? "default" : "primary"}
        className={`w-full text-white font-extrabold h-12 rounded-xl transition-all ${
          isBlocked ? "bg-gray-400 cursor-not-allowed text-gray-200" : 
          isBooked ? "bg-gray-400 cursor-not-allowed text-gray-200" : "bg-blue-600"
        }`}
        disabled={isBlocked || isBooked}
      >
        {isBlocked ? "ACCOUNT RESTRICTED" : isBooked ? "ALREADY BOOKED" : "BOOK NOW"}
      </Button>

      <Button
        onClick={handleFavoriteToggle}
        isLoading={isFavoriteLoading}
        variant={isFavorite ? "solid" : "bordered"}
        className={`w-full h-12 rounded-xl font-extrabold border-blue-600 transition-all ${
          isFavorite 
            ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100" 
            : "text-blue-600 hover:bg-blue-50"
        } ${isBlocked ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isBlocked}
      >
        <Heart className={isFavorite ? "fill-current text-rose-600" : ""} size={16} />
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </Button>
    </div>
  );
}