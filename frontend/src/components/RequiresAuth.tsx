import { useAuthStore } from "../stores/authStore";
import { Navigate, Outlet } from "react-router";

export default function RequiresAuth() {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
