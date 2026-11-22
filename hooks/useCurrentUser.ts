"use client";

import { useSession } from "@/lib/auth-client";

export function useCurrentUser() {
  const { data: session, isPending } = useSession();

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || undefined,
        role: (session.user.role as "customer" | "admin") || "customer",
        isBlocked: Boolean((session.user as Record<string, unknown>).isBlocked),
        phone: undefined,
      }
    : null;

  return { user, loading: isPending };
}
