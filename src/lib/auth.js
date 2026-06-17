import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);


await client.connect();

const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: mongodbAdapter(db),  
    user: {
        additionalFields: {
            role: {
                type: "string",  
                default: "seeker"
            }
        }
    },
      
    plugins: [
        admin()
    ]
});