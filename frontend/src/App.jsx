import Home from "./pages/home.jsx";
import AuthPage from "./pages/authpage.jsx";
import AdminAuth from "./pages/adminauth.jsx";
import VolunteerDashboard from "./pages/VolunteerDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import "./App.css";
import { ProtectedRoute, VolunteerProtectedRoute, AdminProtectedRoute } from "./utils/protectedRoute.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import VolunteerLogin from "./pages/VolunteerLogin.jsx";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/admin" element={<AdminAuth />} />
            <Route path="/volunteer-login" element={<VolunteerLogin />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/userDashboard" element={<UserDashboard />} />
            </Route>
            <Route element={<VolunteerProtectedRoute />}>
              <Route path="/volunteerDashboard" element={<VolunteerDashboard />} />
            </Route>

            <Route element={<AdminProtectedRoute />}>
              <Route path="/adminDashboard" element={<SuperAdminDashboard />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;