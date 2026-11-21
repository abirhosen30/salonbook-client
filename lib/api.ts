import { setCurrentUser } from "./auth-client";

const wait = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO(backend): POST /auth/logout - clears authentication session / returns success message
export async function logout() {
  await wait(300);
  setCurrentUser(null);
  return { success: true, message: "Logged out successfully" };
}
