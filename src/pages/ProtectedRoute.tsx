import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const ADMIN_EMAILS = [
  "evankwak1@gmail.com",
  "tivialas.info@gmail.com",
  // add more admin emails here
];

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsub();
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const email = user.email?.toLowerCase() ?? "";
  const isAdmin = ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold mb-3">Access Denied</h1>
        <p className="text-white/70">
          This Google account is not allowed to access the admin panel.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}