import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { betterAuth } from "better-auth"
import { jwt, bearer } from "better-auth/plugins"
import { MongoClient } from "mongodb"

const mongoUrl = process.env.MONGODB_URL
const authSecret = process.env.BETTER_AUTH_SECRET

if (!mongoUrl) {
  throw new Error("Missing required MONGODB_URL environment variable")
}

if (!authSecret) {
  throw new Error("Missing required BETTER_AUTH_SECRET environment variable")
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient
}
const mongoClient = globalForMongo.mongoClient ?? new MongoClient(mongoUrl)

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient
}

export const auth = betterAuth({
  database: mongodbAdapter(mongoClient.db("salonbook"), {
    client: mongoClient,
    transaction: false,
  }),
  secret: authSecret,
  baseURL: process.env.BETTER_AUTH_URL,
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
