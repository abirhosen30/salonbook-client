export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Appointment {
  _id: string;
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
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
}

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "customer" | "admin";
  isBlocked: boolean;
  phone?: string;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  serviceName: string;
  appointmentDate: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
}

export const dummyServices: Service[] = [
  {
    _id: "srv-1",
    serviceName: "Luxe Balayage & Glossing",
    category: "Hair Coloring",
    description: "Multi-dimensional sun-kissed custom hand-painted color and conditioning gloss for effortless radiance.",
    price: 185,
    duration: 120,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2026-01-10T10:00:00.000Z",
  },
  {
    _id: "srv-2",
    serviceName: "Signature Botanical Hair & Scalp Ritual",
    category: "Hair Treatment",
    description: "Deep steam therapy with organic rosemary and keratin infusion for restorative shine and root health.",
    price: 95,
    duration: 60,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2026-01-12T10:00:00.000Z",
  },
  {
    _id: "srv-3",
    serviceName: "Precision Master Cut & Blowout",
    category: "Haircut & Styling",
    description: "Bespoke sculptural dry cut tailored to your facial architecture and natural hair movement, finished with our signature blowout.",
    price: 75,
    duration: 45,
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2026-01-14T10:00:00.000Z",
  },
  {
    _id: "srv-4",
    serviceName: "Hydra-Luxe Radiance Facial",
    category: "Facial & Skincare",
    description: "Deep sonic pore extraction, peptide infusion and cold cryogenic lifting massage for luminous, poreless skin.",
    price: 130,
    duration: 75,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    _id: "srv-5",
    serviceName: "Velvet Couture Gel & Pedicure",
    category: "Manicure & Pedicure",
    description: "Botanical soak, gentle cuticle revival, exfoliating brown sugar scrub, and long-wear biocompatible gel finish.",
    price: 85,
    duration: 90,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2026-01-18T10:00:00.000Z",
  },
  {
    _id: "srv-6",
    serviceName: "Aromatherapy Hot Stone Relief",
    category: "Spa & Massage",
    description: "Warm basalt stones and organic lavender-eucalyptus oil melting neck, shoulder and back tension effortlessly.",
    price: 120,
    duration: 60,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2026-01-20T10:00:00.000Z",
  },
  {
    _id: "srv-7",
    serviceName: "Bridal Glamour & Airbrush Makeup",
    category: "Makeup",
    description: "Sweat-proof, HD-camera ready airbrushed complexion design including lash styling and evening glamour.",
    price: 150,
    duration: 90,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80",
    status: "active",
    createdAt: "2026-01-22T10:00:00.000Z",
  },
  {
    _id: "srv-8",
    serviceName: "Japanese Hair Smoothing Restructure",
    category: "Hair Treatment",
    description: "Long-lasting silk restructuring protocol that seals the cuticle and eliminates humidity frizz.",
    price: 220,
    duration: 150,
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80",
    status: "inactive",
    createdAt: "2026-01-25T10:00:00.000Z",
  },
];

export const dummyUsers: UserItem[] = [
  {
    _id: "u-1",
    name: "Elena Rostova",
    email: "elena@example.com",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "customer",
    isBlocked: false,
    phone: "+1 (555) 019-2834",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    _id: "u-2",
    name: "Admin Director",
    email: "admin@salonbook.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "admin",
    isBlocked: false,
    phone: "+1 (555) 018-9999",
    createdAt: "2026-01-01T08:00:00.000Z",
  },
  {
    _id: "u-3",
    name: "Julianna Mercer",
    email: "julianna@example.com",
    role: "customer",
    isBlocked: false,
    phone: "+1 (555) 432-8765",
    createdAt: "2026-01-05T12:00:00.000Z",
  },
  {
    _id: "u-4",
    name: "Sophia Caldwell",
    email: "sophia@example.com",
    role: "customer",
    isBlocked: false,
    phone: "+1 (555) 789-1234",
    createdAt: "2026-01-07T14:00:00.000Z",
  },
  {
    _id: "u-5",
    name: "Blocked User",
    email: "blocked@example.com",
    role: "customer",
    isBlocked: true,
    phone: "+1 (555) 000-0000",
    createdAt: "2026-01-08T15:00:00.000Z",
  },
];

export const dummyAppointments: Appointment[] = [
  {
    _id: "apt-1",
    serviceId: "srv-1",
    customerId: "u-1",
    serviceName: "Luxe Balayage & Glossing",
    serviceImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    category: "Hair Coloring",
    customerName: "Elena Rostova",
    customerEmail: "elena@example.com",
    appointmentDate: "2026-12-01",
    timeSlot: "11:00 AM",
    message: "Looking for subtle caramel highlights.",
    servicePrice: 185,
    status: "confirmed",
    paymentStatus: "unpaid",
    createdAt: "2026-11-20T10:00:00.000Z",
  },
  {
    _id: "apt-2",
    serviceId: "srv-4",
    customerId: "u-1",
    serviceName: "Hydra-Luxe Radiance Facial",
    serviceImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80",
    category: "Facial & Skincare",
    customerName: "Elena Rostova",
    customerEmail: "elena@example.com",
    appointmentDate: "2026-12-05",
    timeSlot: "2:00 PM",
    servicePrice: 130,
    status: "pending",
    paymentStatus: "unpaid",
    createdAt: "2026-11-21T09:30:00.000Z",
  },
  {
    _id: "apt-3",
    serviceId: "srv-3",
    customerId: "u-3",
    serviceName: "Precision Master Cut & Blowout",
    serviceImage: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=80",
    category: "Haircut & Styling",
    customerName: "Julianna Mercer",
    customerEmail: "julianna@example.com",
    appointmentDate: "2026-11-28",
    timeSlot: "3:00 PM",
    servicePrice: 75,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2026-11-19T14:15:00.000Z",
  },
  {
    _id: "apt-4",
    serviceId: "srv-5",
    customerId: "u-4",
    serviceName: "Velvet Couture Gel & Pedicure",
    serviceImage: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80",
    category: "Manicure & Pedicure",
    customerName: "Sophia Caldwell",
    customerEmail: "sophia@example.com",
    appointmentDate: "2026-11-25",
    timeSlot: "10:00 AM",
    servicePrice: 85,
    status: "cancelled",
    paymentStatus: "unpaid",
    createdAt: "2026-11-18T16:00:00.000Z",
  },
  {
    _id: "apt-5",
    serviceId: "srv-6",
    customerId: "u-1",
    serviceName: "Aromatherapy Hot Stone Relief",
    serviceImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80",
    category: "Spa & Massage",
    customerName: "Elena Rostova",
    customerEmail: "elena@example.com",
    appointmentDate: "2026-11-15",
    timeSlot: "4:00 PM",
    servicePrice: 120,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2026-11-10T11:00:00.000Z",
  },
];

export const dummyTransactions: Transaction[] = [
  {
    _id: "tx-1",
    appointmentId: "apt-3",
    customerId: "u-3",
    customerName: "Julianna Mercer",
    serviceName: "Precision Master Cut & Blowout",
    appointmentDate: "2026-11-28",
    amount: 75,
    currency: "USD",
    stripeSessionId: "cs_test_a1b2c3d4e5f6g7h8",
    status: "paid",
    createdAt: "2026-11-19T14:20:00.000Z",
  },
  {
    _id: "tx-2",
    appointmentId: "apt-5",
    customerId: "u-1",
    customerName: "Elena Rostova",
    serviceName: "Aromatherapy Hot Stone Relief",
    appointmentDate: "2026-11-15",
    amount: 120,
    currency: "USD",
    stripeSessionId: "cs_test_z9y8x7w6v5u4t3s2",
    status: "paid",
    createdAt: "2026-11-10T11:05:00.000Z",
  },
  {
    _id: "tx-3",
    appointmentId: "apt-1",
    customerId: "u-1",
    customerName: "Elena Rostova",
    serviceName: "Luxe Balayage & Glossing",
    appointmentDate: "2026-12-01",
    amount: 185,
    currency: "USD",
    stripeSessionId: "cs_test_m5n4o3p2q1r0s9t8",
    status: "failed",
    createdAt: "2026-11-20T10:15:00.000Z",
  },
  {
    _id: "tx-4",
    appointmentId: "apt-6",
    customerId: "u-4",
    customerName: "Sophia Caldwell",
    serviceName: "Signature Botanical Hair & Scalp Ritual",
    appointmentDate: "2026-11-12",
    amount: 95,
    currency: "USD",
    stripeSessionId: "cs_test_j1k2l3m4n5o6p7q8",
    status: "paid",
    createdAt: "2026-11-08T09:00:00.000Z",
  },
];
