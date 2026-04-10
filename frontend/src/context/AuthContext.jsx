import React, {createContext, useContext, useEffect, useState} from 'react';

const AuthContext = createContext(null);
const backend_url = import.meta.env.VITE_BACKEND_URL_VIHAAN;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [teamInfo, setTeamInfo] = useState(null);
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
            // console.log("Admin authenticated:", currentAdmin);
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

  useEffect(() => {
  if (user) {
    getTeamInfo().catch(err =>
      console.error("Failed to fetch team info:", err)
    );
  }
}, [user]);

  const fetchMe = async (token) => {
    const res = await fetch(`${backend_url}/api/user/me`, {
      method: "GET",
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ FIX
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
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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

  const getTeamInfo = async () => {
    const res = await fetch(`${backend_url}/api/user/team`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authTokenUser")}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch team info");
    }

    setTeamInfo(data.team);
    return data.team;
  };


  const checkUserByQr = async (code) => {
    const res = await fetch(`${backend_url}/api/user/scan/${code}` , {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("authTokenAdmin")}`,
      },
    })

    if(!res.ok){
      throw new Error("User not found");
    }
    return await res.json();

  }
 const linkUserQr = async (qrHash, rsvpCode) => {
    try {
      const reqBody = {
        rsvpCode,
        qrHash,
      }
      // MATCHES: router.post("/linkQr")
      const res = await fetch(
        `${backend_url}/api/user/linkQr`,
        {
          method: "POST",
          headers: {
           "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authTokenAdmin")}`,
          },
          body: JSON.stringify(reqBody)
        },
      );
      return await res.json();
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(backendMessage || "Invalid RSVP Code.");
    }
  };

  const markUserPresent = async (qrHash) => {
    try {
      const res = await fetch(
          `${backend_url}/api/user/scan/${qrHash}/present`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("authTokenAdmin")}`,
            },
          },
      );
      return await res.json();
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(backendMessage || "Present Not Marked");
    }
  };

  const updateUserFoodCount = async (qrHash) => {
    try {
      const reqBody = {
        foodCountInc: true
      }
      const res = await fetch(
          `${backend_url}/api/user/scan/${qrHash}/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("authTokenAdmin")}`,
            },
            body: JSON.stringify(reqBody)
          },
      );
      return await res.json();
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(backendMessage || "Food Count Not Marked");
    }
  };

  const decreaseUserFoodCount = async (qrHash) => {
    try {
      const reqBody = {
        foodCountDec: true
      }
      const res = await fetch(
          `${backend_url}/api/user/scan/${qrHash}/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("authTokenAdmin")}`,
            },
            body: JSON.stringify(reqBody)
          },
      );
      return await res.json();
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(backendMessage || "Food Count Not Marked");
    }
  };

  const updateUserBeddingTaken = async (qrHash, bedsheetTaken) => {
    try {
      const reqBody = {
        bedsheetTaken
      }
      const res = await fetch(
          `${backend_url}/api/user/scan/${qrHash}/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("authTokenAdmin")}`,
            },
            body: JSON.stringify(reqBody)
          },
      );
      return await res.json();
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(backendMessage || "Invalid Qr Hash Code.");
    }
  };

  const unCheckInUser = async (qrHash) => {
    try {
      const reqBody = {
        unCheckIn: true
      }
      const res = await fetch(
          `${backend_url}/api/user/scan/${qrHash}/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("authTokenAdmin")}`,
            },
            body: JSON.stringify(reqBody)
          },
      );
      return await res.json();
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(backendMessage || "Invalid Qr Hash Code.");
    }
  };

  const fetchRoomsForUser = async (qrHash) => {
    try {
      const res = await fetch(
          `${backend_url}/api/user/scan/${qrHash}/rooms`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("authTokenAdmin")}`,
            },
          },
      );
      const body = await res.json()
      return await body.rooms;
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(backendMessage || "Invalid Qr Hash Code.");
    }
  }

  const updateRoom = async (qrHash, room_number) => {
    try {
      const reqBody = {
        roomAllot: room_number,
      }
      const res = await fetch(
          `${backend_url}/api/user/scan/${qrHash}/update`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("authTokenAdmin")}`,
            },
            body: JSON.stringify(reqBody)
          },
      );
      return await res.json();
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(backendMessage || "Invalid Qr Hash Code.");
    }
  };

  // The value object contains everything we want to make available to our app
  const value = {
    user,
    admin,
    teamInfo,
    loading,
    login,
    logout,
    checkUserByQr,
    linkUserQr,
    markUserPresent,
    updateUserFoodCount,
    decreaseUserFoodCount,
    updateUserBeddingTaken,
    unCheckInUser,
    updateRoom,
    fetchRoomsForUser,
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

