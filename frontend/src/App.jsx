import Home from "./pages/home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import AdminAuth from "./pages/adminauth.jsx";
import VolunteerDashboard from "./components/VolunteerDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import VolunteerLogin from "./components/VolunteerLogin.jsx";

function App() {
  return (
    <div>
     <Router>
       <AuthProvider>
      <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/admin" element={<AdminAuth />} />
            <Route path="/volunteer-login" element={<VolunteerLogin />}/>
             <Route path="/volunteerDashboard" element={<VolunteerDashboard />} />
            <Route path="/userDashboard" element={<UserDashboard />} />
            <Route path="/adminDashboard" element={<SuperAdminDashboard />} />
      </Routes>
      </AuthProvider>
     </Router>
    </div>
  )
}

export default App;