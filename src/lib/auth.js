import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);

await client.connect();

const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailAndPassword: {
        enabled: true,
    },
   
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    database: mongodbAdapter(db),  
    user: {
        additionalFields: {
            role: {
                type: "string",  
                default: "user" 
            }
        }
    },
    plugins: [
        admin()
    ]
});