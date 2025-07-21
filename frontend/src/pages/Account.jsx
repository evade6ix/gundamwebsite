import { getUserName, getUserFromToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Account() {
  const navigate = useNavigate();
  const userEmail = getUserFromToken();
  const userName = getUserName();
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    if (!userEmail) {
      navigate("/login"); // force login
      return;
    }

    const fetchDecks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/decks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setDecks(data.decks);
        } else {
          console.error("Failed to fetch decks:", data.detail);
        }
      } catch (err) {
        console.error("Error fetching decks:", err);
      }
    };

    fetchDecks();
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
        <p className="mb-4 text-gray-700">Email: {userEmail}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Your Decks</h2>
        {decks.length === 0 ? (
          <p className="text-gray-600">You haven’t saved any decks yet.</p>
        ) : (
          <ul className="space-y-3">
            {decks.map((deck, index) => (
              <li
                key={index}
                className="border rounded p-3 text-left hover:bg-gray-50"
              >
                <h3 className="font-bold text-lg">{deck.name}</h3>
                <p className="text-sm text-gray-600">
                  {deck.cards.reduce((sum, c) => sum + c.count, 0)} cards
                </p>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
