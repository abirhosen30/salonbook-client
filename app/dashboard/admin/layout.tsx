import ProtectedRoute from "@/components/auth/ProtectedRoute";

type Props = {
  children: React.ReactNode;
};

// Admin Layout: Ensures only users with the "admin" role can access /dashboard/admin/*
export default function AdminLayout({ children }: Props) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      {children}
    </ProtectedRoute>
  );
}
