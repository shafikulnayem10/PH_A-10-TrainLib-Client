import { protectedFetch } from "@/lib/core/server";

export const getAdminOverview = async () => {
    return await protectedFetch("/api/admin/overview");
};