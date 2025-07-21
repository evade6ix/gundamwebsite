import { getUserName, getUserFromToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Account() {
  const navigate = useNavigate();
  const userEmail = getUserFromToken();
  const userName = getUserName();

  useEffect(() => {
    if (!userEmail) {
      navigate("/login"); // force login if no token
    }
  }, [userEmail, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!userEmail) return null; // Prevent rendering while redirecting

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, {userName}!</h1>
        <p className="mb-2 text-gray-700">Email: {userEmail}</p>
      </div>
    </div>
  );
}
