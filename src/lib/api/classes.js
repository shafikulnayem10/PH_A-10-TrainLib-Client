import { serverFetch, protectedFetch, serverMutation } from "../core/server";

export const getFeaturedClasses = async () => {
  return serverFetch("/featured-classes");
};

export const getAllClasses = async (queryString) => {
  return serverFetch(`/all-classes?${queryString}`);
};

export const getClassDetails = async (id) => {
  return serverFetch(`/api/classes/${id}`);
};

export const checkClassBookingStatus = async (classId, userEmail) => {
  return protectedFetch(`/api/bookings/check?classId=${classId}&email=${encodeURIComponent(userEmail)}`);
};

export const addClassToFavorites = async (favoriteData) => {
  return serverMutation("/api/favorites", favoriteData, "POST");
};

export const checkClassFavoriteStatus = async (classId, userEmail) => {
  return protectedFetch(`/api/favorites/check?classId=${classId}&email=${encodeURIComponent(userEmail)}`);
};
