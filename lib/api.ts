import { signOut, authClient } from "./auth-client";
import { Service, Appointment, User, Transaction } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

// Helper for acquiring Better Auth token if available
async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    // Attempt to read JWT token from better-auth client plugin if available
    const tokenFn = (authClient as Record<string, unknown>).token as (() => Promise<string>) | undefined;
    if (typeof tokenFn === "function") {
      const token = await tokenFn();
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    }
  } catch {
    // Fall back to cookie-based session
  }
  return {};
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeaders = await getAuthHeader();

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Send session cookies across origins
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options.headers,
    },
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      json?.message || json?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return (json?.data !== undefined ? json.data : json) as T;
}

// ==========================================
// Authentication APIs
// ==========================================

export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    await signOut();
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => null);
    return { success: true, message: "Logged out successfully" };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to logout";
    return { success: false, message: errorMsg };
  }
}

// ==========================================
// Services APIs
// ==========================================

export async function getFeaturedServices(): Promise<Service[]> {
  return apiFetch<Service[]>("/services?status=active&limit=6");
}

export interface GetServicesParams {
  category?: string;
  search?: string;
  sort?: string;
  status?: "active" | "inactive" | "all";
}

export async function getServices(params: GetServicesParams = {}): Promise<Service[]> {
  const searchParams = new URLSearchParams();

  if (params.category && params.category !== "All") {
    searchParams.set("category", params.category);
  }
  if (params.search && params.search.trim()) {
    searchParams.set("search", params.search.trim());
  }
  if (params.sort && params.sort !== "default") {
    searchParams.set("sort", params.sort);
  }
  if (params.status) {
    searchParams.set("status", params.status);
  } else {
    searchParams.set("status", "active");
  }

  const queryStr = searchParams.toString();
  const endpoint = `/services${queryStr ? `?${queryStr}` : ""}`;
  return apiFetch<Service[]>(endpoint);
}

export async function getServiceById(id: string): Promise<Service | null> {
  return apiFetch<Service>(`/services/${id}`);
}

export async function createService(data: {
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
}): Promise<Service> {
  return apiFetch<Service>("/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateService(
  id: string,
  data: Partial<Omit<Service, "_id" | "createdAt">>
): Promise<Service> {
  return apiFetch<Service>(`/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteService(id: string): Promise<{ deletedId: string }> {
  return apiFetch<{ deletedId: string }>(`/services/${id}`, {
    method: "DELETE",
  });
}

// ==========================================
// Image Upload API (ImgBB)
// ==========================================

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const authHeaders = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/uploads/image`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...authHeaders,
    },
    body: formData,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok || !json?.success) {
    const errorMsg =
      json?.message || "Failed to upload image to hosting service.";
    throw new Error(errorMsg);
  }

  return json.data.url;
}

// ==========================================
// Appointment APIs
// ==========================================

export async function createAppointment(data: {
  serviceId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  serviceName?: string;
  serviceImage?: string;
  category?: string;
  servicePrice?: number;
}): Promise<Appointment> {
  return apiFetch<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMyAppointments(): Promise<Appointment[]> {
  return apiFetch<Appointment[]>("/appointments/my");
}

export async function cancelAppointment(
  id: string
): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>(
    `/appointments/${id}/cancel`,
    {
      method: "PATCH",
    }
  );
}

// ==========================================
// Stripe Payment APIs
// ==========================================

export async function createCheckoutSession(
  appointmentId: string
): Promise<{ url: string; sessionId?: string }> {
  return apiFetch<{ url: string; sessionId?: string }>(
    "/payments/create-checkout-session",
    {
      method: "POST",
      body: JSON.stringify({ appointmentId }),
    }
  );
}

// ==========================================
// Customer Dashboard APIs
// ==========================================

export type CustomerStats = {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
};

export async function getCustomerStats(): Promise<CustomerStats> {
  return apiFetch<CustomerStats>("/customer/stats");
}

export async function getCustomerProfile(): Promise<User> {
  return apiFetch<User>("/customer/profile");
}

export async function updateCustomerProfile(data: {
  name?: string;
  image?: string;
  phone?: string;
}): Promise<User> {
  return apiFetch<User>("/customer/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ==========================================
// Admin Dashboard APIs
// ==========================================

export type AdminStats = {
  totalRegisteredCustomers: number;
  totalActiveServices: number;
  totalAppointmentRequests: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  totalSuccessfulPayments: number;
  totalRevenue: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>("/admin/dashboard/stats");
}

export async function getAdminAppointments(
  status?: string,
  date?: string
): Promise<Appointment[]> {
  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (date) params.set("date", date);
  const q = params.toString();
  return apiFetch<Appointment[]>(`/admin/appointments${q ? `?${q}` : ""}`);
}

export async function updateAdminAppointmentStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled"
): Promise<Appointment> {
  return apiFetch<Appointment>(`/admin/appointments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getAdminUsers(): Promise<User[]> {
  return apiFetch<User[]>("/admin/users");
}

export async function toggleAdminUserBlock(
  id: string,
  isBlocked: boolean
): Promise<{ id: string; isBlocked: boolean }> {
  return apiFetch<{ id: string; isBlocked: boolean }>(
    `/admin/users/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ isBlocked }),
    }
  );
}

export async function getAdminTransactions(): Promise<Transaction[]> {
  return apiFetch<Transaction[]>("/admin/transactions");
}
