import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI || process.env.BETTER_AUTH_URL!);
const db = client.db("BazarDor-Database");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    client,
  }),
});

// import { betterAuth } from "better-auth";

// export const auth = betterAuth({
//   //...
// });
