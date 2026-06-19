'use server';

import { protectedFetch } from "@/lib/core/server";

export async function fetchAdminOverviewAction() {
    try {
        return await protectedFetch("/api/admin/overview");
    } catch (error) {
        console.error("Fetch admin overview error:", error);
        return { 
            success: false, 
            stats: { totalUsers: 0, totalClasses: 0, totalBookings: 0 },
            profile: null,
            message: 'Failed to fetch admin overview.' 
        };
    }
}