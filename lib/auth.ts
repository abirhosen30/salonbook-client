import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { betterAuth } from "better-auth"
import { jwt, bearer } from "better-auth/plugins"
import { MongoClient } from "mongodb"

const mongoUrl =
  process.env.MONGODB_URL ||
  "mongodb://localhost:27017/salonbook"
const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  "fallback_secret_salonbook_production_3000"

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient
}
const mongoClient = globalForMongo.mongoClient ?? new MongoClient(mongoUrl)

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient
}

const baseURL =
  process.env.BETTER_AUTH_URL?.startsWith("http") && !process.env.BETTER_AUTH_URL.includes("localhost")
    ? process.env.BETTER_AUTH_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.BETTER_AUTH_URL || "http://localhost:3000";

const trustedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://salonbook-client-henna.vercel.app",
  "https://*.vercel.app",
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
].filter(Boolean) as string[];

export const auth = betterAuth({
  database: mongodbAdapter(mongoClient.db("salonbook"), {
    client: mongoClient,
    transaction: false,
  }),
  secret: authSecret,
  baseURL,
  trustedOrigins,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
    },
  },
  plugins: [
    jwt(),
    bearer(),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})
