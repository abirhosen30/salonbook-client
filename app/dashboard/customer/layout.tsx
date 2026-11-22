import ProtectedRoute from "@/components/auth/ProtectedRoute";

type Props = {
  children: React.ReactNode;
};

// Customer Layout: Ensures only users with the "customer" role can access /dashboard/customer/*
export default function CustomerLayout({ children }: Props) {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      {children}
    </ProtectedRoute>
  );
}
