import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, user, admin } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function VolunteerProtectedRoute() {
  const { isAuthenticated, admin, user } = useAuth();  

    if(user){
        return <Navigate to="/userDashboard" replace />;
    }

    if (!isAuthenticated || !admin) {
    return <Navigate to="/volunteer-login" replace />;
  }

  return <Outlet />;
}

export function AdminProtectedRoute() {
  const { isAuthenticated, admin, user } = useAuth();
//   console.log(admin)

  if(user) {
    return <Navigate to="/userDashboard" replace />;
  }

  if (admin && admin.role !== "SUPER_ADMIN") {
    return <Navigate to="/volunteerDashboard" replace />;
  }

  if (!isAuthenticated || !admin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}