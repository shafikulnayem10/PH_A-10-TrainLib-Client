import { protectedFetch, serverMutation } from "@/lib/core/server";

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

// export async function applyAsTrainer(formData) {
//     try {
//         const data = await serverMutation("/api/user/apply-trainer", formData, "POST");
//         return data;
//     } catch (error) {
//         throw error;
//     }
// }

// export async function getTrainerApplicationStatus() {
//     try {
//         const data = await protectedFetch("/api/user/trainer-status");
//         return data;
//     } catch (error) {
//         throw error;
//     }
// }
