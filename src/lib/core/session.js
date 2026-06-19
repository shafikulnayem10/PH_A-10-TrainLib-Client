import { redirect } from "next/navigation";

export const getUserSession = async () => {
    if (typeof window === "undefined") {
        const { headers } = await import("next/headers");
        const { auth } = await import("../auth");
        const session = await auth.api.getSession({
            headers: await headers()
        });
        return session?.user || null;
    } else {
        const { authClient } = await import("../auth-client");
        const { data } = await authClient.useSession();
        return data?.user || null;
    }
};

export const getUserToken = async () => {
    if (typeof window === "undefined") {
        const { headers } = await import("next/headers");
        const { auth } = await import("../auth");
        const session = await auth.api.getSession({
            headers: await headers()
        });
        return session?.session?.token || null;
    } else {
        const { authClient } = await import("../auth-client");
        const session = authClient.getActions().getStore().get("session");
        return session?.token || null;
    }
};

export const requireRole = async (role) => {
    const user = await getUserSession();
    if (!user) {
        if (typeof window !== "undefined") {
            window.location.href = '/auth/signin';
            return new Promise(() => {});
        } else {
            redirect('/auth/signin');
        }
    }
    if (user?.role !== role) {
        if (typeof window !== "undefined") {
            window.location.href = '/unauthorized';
            return new Promise(() => {});
        } else {
            redirect('/unauthorized');
        }
    }
    return user;
};