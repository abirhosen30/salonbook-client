"use client";

import { useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "customer" | "admin";
  isBlocked: boolean;
  phone?: string;
}

// Change this hardcoded value to test: null, customer, or admin
const initialUser: User | null = {
  id: "u1",
  name: "Elena Rostova",
  email: "elena@example.com",
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "customer",
  isBlocked: false,
  phone: "+1 (555) 019-2834",
};

let activeUser: User | null = initialUser;
const subscribers = new Set<() => void>();

export function setCurrentUser(user: User | null) {
  activeUser = user;
  subscribers.forEach((callback) => callback());
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(activeUser);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = () => {
      setUser(activeUser);
    };

    subscribers.add(handleUpdate);
    return () => {
      subscribers.delete(handleUpdate);
    };
  }, []);

  return { user, loading };
}
