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
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, {userName}!</h1>
        <p className="mb-6 text-gray-700">Email: {userEmail}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Collection Section */}
          <div className="border rounded p-4">
            <h2 className="text-2xl font-semibold mb-3">📦 Collection</h2>
            <p className="text-gray-600 mb-2">Manage your cards here.</p>
            <button
              onClick={() => navigate("/collection/add")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add to Collection
            </button>
          </div>

          {/* Decks Section */}
          <div className="border rounded p-4">
            <h2 className="text-2xl font-semibold mb-3">🃏 Decks</h2>
            <p className="text-gray-600 mb-2">Build and view your decks.</p>
            <button
              onClick={() => navigate("/decks/new")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              New Deck
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
