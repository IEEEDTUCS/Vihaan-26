import Home from "./pages/home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import AdminAuth from "./pages/adminauth.jsx";
import VolunteerDashboard from "./components/VolunteerDashboard.jsx";
import "./App.css";
// import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <div>
     <Router>
       <AuthProvider>
      <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/admin" element={<AdminAuth />} />
             <Route path="/volunteerDashboard" element={<VolunteerDashboard />} />
      </Routes>
      </AuthProvider>
     </Router>
    </div>
  )
}

export default App;