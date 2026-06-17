import { redirect } from "next/navigation";



export const getUserSession = async () => {
    if (typeof window === "undefined") {
        const { headers } = await import("next/headers");
        const { auth } = await import("../auth"); 
        
        const session = await auth.api.getSession({
            headers: await headers() 
        });
        return session?.user || null;
    }
    return null;
};

export const getUserToken = async () => {
    if (typeof window === "undefined") {
        const { headers } = await import("next/headers");
        const { auth } = await import("../auth");
        
        const session = await auth.api.getSession({
            headers: await headers()
        });
        return session?.session?.token || null;
    }
    return null;
};

export const requireRole = async (role) => {
    const user = await getUserSession();
    
    if (!user) {
        redirect('/login');
    }
    
    if (user?.role !== role) {
        redirect('/unauthorized');
    }
    
    return user;
};