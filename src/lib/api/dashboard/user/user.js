
import { protectedFetch } from "@/lib/core/server";

export const getUserOverview = async () => {
    try {
        const data = await protectedFetch("/api/user/overview");
        return data;
    } catch (error) {
        throw error;
    }
};

export const getUserBookedClasses = async () => {
    try {
        const data = await protectedFetch("/api/user/booked-classes");
        return data;
    } catch (error) {
        throw error;
    }
};