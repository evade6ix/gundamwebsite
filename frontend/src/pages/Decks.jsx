import { useEffect, useState } from "react";
import { getUserFromToken } from "../utils/auth";

export default function Decks() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUserFromToken();

  useEffect(() => {
    async function fetchDecks() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setDecks(data.decks || []);
      setLoading(false);
    }

    if (user) {
      fetchDecks();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center mt-10 text-lg text-gray-600">
        Please log in to view your decks.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Decks</h1>
      {loading ? (
        <p className="text-gray-600">Loading decks...</p>
      ) : decks.length === 0 ? (
        <p className="text-gray-600">No decks saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decks.map((deck, index) => (
            <div key={index} className="bg-white shadow rounded p-4">
              <h2 className="text-xl font-semibold mb-2">{deck.name}</h2>
              <p className="text-gray-700 mb-2">
                Cards: {deck.cards.length}/50
              </p>
              <p className="text-sm text-gray-500">
                Saved on {new Date(deck.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
