import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DeckDetail() {
  const { deckName } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDeck = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/users/decks/${encodeURIComponent(deckName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();

        // Enrich cards with full DB details
        const enrichedCards = await Promise.all(
          data.deck.cards.map(async (card) => {
            const cardRes = await fetch(
              `${import.meta.env.VITE_API_URL}/card/${encodeURIComponent(card.id)}`
            );
            if (cardRes.ok) {
              const cardData = await cardRes.json();
              return {
                ...card,
                ...cardData, // merge full DB card data
              };
            }
            return card; // fallback to saved data
          })
        );

        setDeck({ ...data.deck, cards: enrichedCards });
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

  useEffect(() => {
    fetchDeck();
  }, [deckName, navigate]);

  const handleDelete = async () => {
    if (!window.confirm(`❌ Delete deck "${deck.name}"? This cannot be undone.`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/users/decks/${encodeURIComponent(deckName)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        alert("✅ Deck deleted successfully.");
        navigate("/account");
      } else {
        const error = await res.json();
        alert(`❌ Failed to delete deck: ${error.detail}`);
      }
    } catch (err) {
      console.error("Error deleting deck:", err);
      alert("❌ Error deleting deck.");
    }
  };

  const handleEdit = () => {
    navigate(`/decks/edit/${encodeURIComponent(deck.name)}`);
  };

  if (loading) {
    return <p className="text-center mt-8">Loading deck...</p>;
  }

  if (!deck) {
    return <p className="text-center mt-8">❌ Deck not found.</p>;
  }

  const totalCards = deck.cards.reduce((sum, c) => sum + c.count, 0);

  // 🖤 Color devotion (from enriched DB data)
  const colorCounts = {};
  deck.cards.forEach((c) => {
    const color = c.color || "Colorless";
    colorCounts[color] = (colorCounts[color] || 0) + c.count;
  });

  // 📦 Card type counts (from enriched DB data)
  const typeCounts = {};
  deck.cards.forEach((c) => {
    const type = c.cardType || "Unknown";
    typeCounts[type] = (typeCounts[type] || 0) + c.count;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">{deck.name}</h1>
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
              onClick={handleEdit}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-3"
            >
              ✏️ Edit Deck
            </button>
            <button
              onClick={handleDelete}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              🗑 Delete Deck
            </button>

            {/* 🔥 Color Devotion */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Color Devotion</h3>
              <ul className="text-gray-700 space-y-1">
                {Object.entries(colorCounts).map(([color, count]) => (
                  <li key={color}>
                    <span className="font-medium">{color}:</span> {count}
                  </li>
                ))}
              </ul>
            </div>

            {/* 🔥 Card Types */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Card Types</h3>
              <ul className="text-gray-700 space-y-1">
                {Object.entries(typeCounts).map(([type, count]) => (
                  <li key={type}>
                    <span className="font-medium">{type}:</span> {count}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg p-4 overflow-y-auto max-h-[70vh]">
            <h2 className="text-2xl font-semibold mb-4">
              Cards ({totalCards})
            </h2>
            <ul className="space-y-3">
              {deck.cards.map((card, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-4 border rounded p-3 hover:shadow transition relative"
                >
                  <img
                    src={card.images?.small || card.image_url || "/placeholder.png"}
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
    </div>
  );
}
