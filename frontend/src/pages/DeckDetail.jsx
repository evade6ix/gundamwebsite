import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DeckDetail() {
  const { deckName } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/decks/${encodeURIComponent(deckName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setDeck(data.deck);
        } else {
          console.error("Deck not found");
          navigate("/account");
        }
      } catch (err) {
        console.error("Error fetching deck:", err);
        navigate("/account");
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [deckName, navigate]);

  if (loading) {
    return <p className="text-center mt-8">Loading deck...</p>;
  }

  if (!deck) {
    return <p className="text-center mt-8">❌ Deck not found.</p>;
  }

  const totalCards = deck.cards.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">{deck.name}</h1>
        <p className="text-lg text-gray-600">🃏 {totalCards} cards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="lg:col-span-1 bg-white shadow rounded-lg p-4">
          <h2 className="text-2xl font-semibold mb-3">Deck Overview</h2>
          <p className="text-gray-700 mb-2">
            Created: {new Date(deck.created_at).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-2">
            Total Cards: <span className="font-bold">{totalCards}</span>
          </p>
          <button
            onClick={() => alert("Edit deck coming soon!")}
            className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ✏️ Edit Deck
          </button>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-4 overflow-y-auto max-h-[70vh]">
          <h2 className="text-2xl font-semibold mb-4">Cards</h2>
          <ul className="space-y-3">
            {deck.cards.map((card, idx) => (
              <li
                key={idx}
                className="flex items-center gap-4 border rounded p-3 hover:shadow transition"
              >
                <img
                  src={card.image_url}
                  alt={card.name}
                  className="w-16 h-20 object-contain rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{card.name}</h3>
                  <p className="text-gray-500">Copies: {card.count}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
