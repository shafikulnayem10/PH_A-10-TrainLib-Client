import { protectedFetch } from "@/lib/core/server";

export const getTrainerOverview = async () => {
    return await protectedFetch("/api/trainer/overview");
};
