import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DeckBuilder() {
  const navigate = useNavigate();
  const { deckName } = useParams(); // 👈 get deck name from URL
  const isEditMode = !!deckName;

  const [name, setName] = useState(deckName || ""); // 👈 prefill name in edit mode
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deck, setDeck] = useState({});
  const [loading, setLoading] = useState(false);
  const [hoverCard, setHoverCard] = useState(null);

  // 🚀 Fetch existing deck for editing
  useEffect(() => {
    if (isEditMode) {
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

            // Format deck data into {id: {card}}
            const formattedDeck = {};
            data.deck.cards.forEach((card) => {
              formattedDeck[card.id] = {
                ...card,
                count: card.count,
              };
            });

            setDeck(formattedDeck);
            setName(data.deck.name);
          } else {
            console.error("Deck not found");
            navigate("/account");
          }
        } catch (err) {
          console.error("Error loading deck:", err);
        }
      };

      fetchDeck();
    }
  }, [deckName, isEditMode, navigate]);

  const handleSearch = async (e, page = 1) => {
    e?.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cards?name=${encodeURIComponent(query)}&page=${page}&limit=10`
      );
      const data = await res.json();
      setSearchResults(data.cards || []);
      setCurrentPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error searching cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToDeck = (card) => {
    const currentCount = deck[card.id]?.count || 0;
    const totalCards = Object.values(deck).reduce((sum, c) => sum + c.count, 0);

    if (totalCards >= 50) {
      alert("❌ Deck limit reached (50 cards).");
      return;
    }
    if (currentCount >= 4) {
      alert("❌ Max 4 copies per card.");
      return;
    }

    setDeck({
      ...deck,
      [card.id]: {
        ...card,
        count: currentCount + 1,
      },
    });
  };

  const removeFromDeck = (cardId) => {
    const updatedDeck = { ...deck };
    if (updatedDeck[cardId].count > 1) {
      updatedDeck[cardId].count -= 1;
    } else {
      delete updatedDeck[cardId];
    }
    setDeck(updatedDeck);
  };

  const saveDeck = async () => {
    if (!name.trim()) {
      alert("❌ Enter a deck name.");
      return;
    }

    const totalCards = Object.values(deck).reduce((sum, c) => sum + c.count, 0);
    if (totalCards < 10) {
      alert("❌ Deck must have at least 10 cards.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const endpoint = isEditMode
        ? `${import.meta.env.VITE_API_URL}/auth/users/decks/${encodeURIComponent(deckName)}`
        : `${import.meta.env.VITE_API_URL}/auth/decks`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          cards: Object.values(deck).map((c) => ({
            id: c.id,
            name: c.name,
            count: c.count,
          })),
        }),
      });

      if (res.ok) {
        alert(`✅ Deck ${isEditMode ? "updated" : "saved"} successfully!`);
        navigate("/account");
      } else {
        const error = await res.json();
        alert(`❌ ${error.detail}`);
      }
    } catch (err) {
      console.error("Failed to save deck:", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">
            {isEditMode ? "Edit Deck" : "New Deck Builder"}
          </h1>
          <input
            type="text"
            placeholder="Deck Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-4 py-2 w-1/3 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Search */}
          <div className="lg:col-span-1 bg-white shadow rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-3">Search Cards</h2>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search for cards"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border rounded px-4 py-2 bg-white text-gray-800"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            {/* Search Results */}
            {loading ? (
              <p className="text-gray-500">Searching...</p>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {searchResults.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center gap-3 p-2 border rounded hover:shadow cursor-pointer relative"
                    onClick={() => addToDeck(card)}
                    onMouseEnter={() => setHoverCard(card)}
                    onMouseLeave={() => setHoverCard(null)}
                  >
                    <img
                      src={card.images?.small || card.image_url || "/placeholder.png"}
                      alt={card.name}
                      className="w-12 h-16 object-contain rounded"
                    />
                    <div>
                      <h3 className="text-lg font-medium">{card.name}</h3>
                      <p className="text-gray-500 text-sm">
                        {card.set?.name || card.set_name} / {card.cardType || "Unknown"} / {card.rarity || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={(e) => handleSearch(e, currentPage - 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                ← Prev
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={(e) => handleSearch(e, currentPage + 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Right Panel: Deck List */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg p-4 max-w-3xl">
            <h2 className="text-2xl font-semibold mb-4">
              Deck List ({Object.values(deck).reduce((sum, c) => sum + c.count, 0)}/50)
            </h2>
            {Object.values(deck).length === 0 ? (
              <p className="text-gray-500">No cards added yet.</p>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                {Object.values(deck).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 p-2 border rounded hover:shadow relative"
                    onMouseEnter={() => setHoverCard(c)}
                    onMouseLeave={() => setHoverCard(null)}
                  >
                    <img
                      src={c.images?.small || c.image_url || "/placeholder.png"}
                      alt={c.name}
                      className="w-12 h-16 object-contain rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{c.name}</h3>
                      <p className="text-gray-500 text-sm">Copies: {c.count}</p>
                    </div>
                    <button
                      onClick={() => removeFromDeck(c.id)}
                      className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={saveDeck}
              className="mt-6 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Deck
            </button>
          </div>
        </div>
      </div>

     {/* Fixed Hover Preview Pane */}
{hoverCard && (
  <div className="fixed right-8 top-48 w-96 z-50 bg-white border rounded-xl shadow-2xl p-4">
    <img
      src={hoverCard.images?.large || hoverCard.image_url || "/placeholder.png"}
      alt={hoverCard.name}
      className="w-full h-auto rounded-xl mb-4 shadow-lg"
    />
    <h4 className="font-bold text-xl mb-2">{hoverCard.name}</h4>
    {hoverCard.rarity && (
      <p className="text-gray-700 text-base mb-1">
        <span className="font-semibold">Rarity:</span> {hoverCard.rarity}
      </p>
    )}
    {hoverCard.cardType && (
      <p className="text-gray-700 text-base">
        <span className="font-semibold">Type:</span> {hoverCard.cardType}
      </p>
    )}
  </div>
)}
</div>
);
}
