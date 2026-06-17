import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const authHeader = async () => {
    const token = await getUserToken();
    return token ? { authorization: `Bearer ${token}` } : {};
};


export const serverFetch = async (path) => {
    const res = await fetch(`${serverUrl}${path}`);
    return handleStatusCode(res);
};

export const protectedFetch = async (path) => {
    const res = await fetch(`${serverUrl}${path}`, {
        headers: await authHeader(),
    });
    return handleStatusCode(res);
};

export const serverMutation = async (path, data, method = 'POST') => {
    const res = await fetch(`${serverUrl}${path}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...(await authHeader()),
        },
        body: JSON.stringify(data),
    });
    return handleStatusCode(res);
};


const handleStatusCode = async (res) => {
    if (res.status === 401) {
        redirect('/unauthorized');
    } else if (res.status === 403) {
        redirect('/forbidden');
    }
    
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
};