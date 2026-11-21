import { setCurrentUser } from "./auth-client";
import { dummyServices, Service } from "./dummyData";

const wait = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO(backend): POST /auth/logout - clears authentication session / returns success message
export async function logout() {
  await wait(300);
  setCurrentUser(null);
  return { success: true, message: "Logged out successfully" };
}

// TODO(backend): GET /services?status=active&limit=6 - returns 6 active featured services
export async function getFeaturedServices(): Promise<Service[]> {
  await wait(400);
  return dummyServices
    .filter((service) => service.status === "active")
    .slice(0, 6);
}

// TODO(backend): GET /services?status=active - returns all active services
export async function getServices(): Promise<Service[]> {
  await wait(400);
  return dummyServices.filter((service) => service.status === "active");
}
