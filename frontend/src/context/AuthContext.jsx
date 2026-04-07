import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);
const backend_url = import.meta.env.VITE_BACKEND_URL_VIHAAN;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);//make sure that this loading state will re render child components too which can cause some states to not get updated after the authcontext functions so preffered to use loading sepeartely

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedTokenUser = localStorage.getItem("authTokenUser");
        const storedTokenAdmin = localStorage.getItem("authTokenAdmin");

        if (storedTokenUser) {
          const currentUser = await fetchMe(storedTokenUser);
          if (currentUser) {
            setUser(currentUser);
            localStorage.removeItem("authTokenAdmin");
            setAdmin(null);
            return;
          }
          localStorage.removeItem("authTokenUser");
          setUser(null);
        }

        if (storedTokenAdmin) {
          const currentAdmin = await fetchMeAdmin(storedTokenAdmin);
          if (currentAdmin) {
            setAdmin(currentAdmin);
            localStorage.removeItem("authTokenUser");
            setUser(null);
            return;
          }
          localStorage.removeItem("authTokenAdmin");
          setAdmin(null);
        }
      } catch (error) {
        console.error("Failed to initialize authentication", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchMe = async (token) => {
    const res = await fetch(`${backend_url}/api/user/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Failed to send request");
    }

    return data.user ?? data;
  };

  const fetchMeAdmin = async (token) => {
    const res = await fetch(`${backend_url}/api/admin/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Failed to send request");
    }

    return data.admin ?? data;
  };

  const login = async (identifier, password, role = "user") => {
    const isAdmin = role === "admin";
    const endpoint = isAdmin ? "/api/admin/login" : "/api/user/login";
    const payload = isAdmin
      ? { username: identifier, password }
      : { email: identifier, code: password };

  
      const res = await fetch(`${backend_url}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      // console.log("Login response:", data);
      if (!res.ok) {
        throw new Error(data.error || data.errors?.[0] || "Login failed");
      }

      if (isAdmin) {
        localStorage.setItem("authTokenAdmin", data.token);
        localStorage.removeItem("authTokenUser");
        setAdmin(data.admin ?? data);
        setUser(null);
      } else {
        localStorage.setItem("authTokenUser", data.token);
        localStorage.removeItem("authTokenAdmin");
        setUser(data.user ?? data);
        setAdmin(null);
      }

      return data;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("authTokenUser");
    localStorage.removeItem("authTokenAdmin");
    setAdmin(null);
    setUser(null);
  };

  const checkUserByQr = async (code) => {
    const res = await fetch(`${backend_url}/scan/code` , {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("authTokenAdmin"),
      },
      params: JSON.stringify({code}),
    })

    if(!res.ok){
      throw new Error("User not found");
    }
    const data = await res.json();
    return data;

  }

  // The value object contains everything we want to make available to our app
  const value = {
    user,
    admin,
    loading,
    login,
    logout,
    checkUserByQr,
    isAuthenticated: !!user || !!admin,
  };



  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>} 
    </AuthContext.Provider>
  );
};

// 3. Create a Custom Hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

