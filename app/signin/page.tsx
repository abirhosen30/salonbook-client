import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";
import Loader from "@/components/Loader";

export default function SignInPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<Loader />}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
