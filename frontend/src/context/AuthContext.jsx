import { createContext, useContext, useState, useEffect } from "react";
import { getUserName, isLoggedIn } from "../utils/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Initialize user state from local storage or cookies
  useEffect(() => {
    if (isLoggedIn()) {
      setUser(getUserName());
    }
  }, []);

  const loginUser = (name) => setUser(name);
  const logoutUser = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
