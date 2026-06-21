import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL:process.env.NEXT_PUBLIC_CLIENT_URL,
    plugins: [
        adminClient()
    ]
});
