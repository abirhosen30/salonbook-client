import { signOut } from "./auth-client";
import { dummyServices, dummyAppointments, Service, Appointment } from "./dummyData";

const wait = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO(me): POST /auth/logout - clears authentication session / returns success message
export async function logout() {
  await signOut();
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

// TODO(me): GET /api/services/:id - sends id / returns service details
export async function getServiceById(id: string): Promise<Service | null> {
  await wait(300);
  const found = dummyServices.find((service) => service._id === id);
  return found || null;
}

// TODO(me): POST /api/appointments - sends appointment data / returns created appointment
export async function createAppointment(data: {
  serviceId: string;
  customerId: string;
  serviceName: string;
  serviceImage: string;
  category: string;
  customerName: string;
  customerEmail: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  servicePrice: number;
}): Promise<Appointment> {
  await wait(500);

  const isSlotTaken = dummyAppointments.some(
    (item) =>
      item.appointmentDate === data.appointmentDate &&
      item.timeSlot === data.timeSlot &&
      item.status !== "cancelled"
  );

  if (isSlotTaken) {
    throw new Error("This time slot is already booked. Please choose another slot.");
  }

  const newAppointment: Appointment = {
    _id: "apt-" + (dummyAppointments.length + 1),
    serviceId: data.serviceId,
    customerId: data.customerId,
    serviceName: data.serviceName,
    serviceImage: data.serviceImage,
    category: data.category,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    appointmentDate: data.appointmentDate,
    timeSlot: data.timeSlot,
    message: data.message,
    servicePrice: data.servicePrice,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: new Date().toISOString(),
  };

  dummyAppointments.unshift(newAppointment);
  return newAppointment;
}

// TODO(me): POST /api/upload - sends FormData with image file / returns image url
export async function uploadImage(file: File): Promise<string> {
  await wait(400);
  if (typeof window !== "undefined") {
    return URL.createObjectURL(file);
  }
  return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
}

export type CustomerStats = {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
};

// TODO(me): GET /api/customer/stats - sends user session / returns stats counts
export async function getCustomerStats(): Promise<CustomerStats> {
  await wait(300);
  const total = dummyAppointments.length;
  const pending = dummyAppointments.filter((a) => a.status === "pending").length;
  const confirmed = dummyAppointments.filter((a) => a.status === "confirmed").length;
  const cancelled = dummyAppointments.filter((a) => a.status === "cancelled").length;

  return { total, pending, confirmed, cancelled };
}

// TODO(me): GET /api/customer/appointments - sends user session / returns list of customer appointments
export async function getMyAppointments(): Promise<Appointment[]> {
  await wait(400);
  return [...dummyAppointments];
}

// TODO(me): PATCH /api/appointments/:id/cancel - sends appointment id / returns updated appointment or success message
export async function cancelAppointment(id: string): Promise<{ success: boolean; message: string }> {
  await wait(400);
  const index = dummyAppointments.findIndex((item) => item._id === id);
  if (index !== -1) {
    dummyAppointments[index] = {
      ...dummyAppointments[index],
      status: "cancelled",
    };
  }
  return { success: true, message: "Appointment cancelled successfully" };
}

// TODO(me): POST /api/payment/create-checkout-session - sends appointmentId / returns stripe session url
export async function createCheckoutSession(appointmentId: string): Promise<{ url: string }> {
  await wait(500);
  const apt = dummyAppointments.find((item) => item._id === appointmentId);
  if (apt) {
    apt.paymentStatus = "paid";
  }
  // Returns simulated checkout return url
  return { url: `/dashboard/customer/appointments?payment_success=true` };
}
