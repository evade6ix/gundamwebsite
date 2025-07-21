import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeckBuilder() {
  const [deckName, setDeckName] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [deck, setDeck] = useState({});
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cards?name=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setSearchResults(data.cards || []);
    } catch (err) {
      console.error("Error searching cards:", err);
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
      alert("❌ You can only have up to 4 copies of a card.");
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
    if (!deckName.trim()) {
      alert("Please give your deck a name.");
      return;
    }

    const totalCards = Object.values(deck).reduce((sum, c) => sum + c.count, 0);
    if (totalCards < 10) {
      alert("❌ Deck must have at least 10 cards to save.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/decks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: deckName.trim(),
          cards: Object.values(deck).map((c) => ({
            id: c.id,
            name: c.name,
            count: c.count,
          })),
        }),
      });
      if (res.ok) {
        alert("✅ Deck saved successfully!");
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">New Deck Builder</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Deck Name"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
        />
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search for cards"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Results */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-3">Search Results</h2>
          <div className="grid grid-cols-2 gap-3">
            {searchResults.map((card) => (
              <div
                key={card.id}
                className="border rounded p-2 text-center hover:shadow cursor-pointer"
                onClick={() => addToDeck(card)}
              >
                <img
                  src={card.image_url}
                  alt={card.name}
                  className="w-full h-32 object-contain mb-1"
                />
                <p className="font-medium">{card.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deck List */}
        <div className="md:col-span-2 border rounded p-4">
          <h2 className="text-xl font-semibold mb-3">
            Deck List ({Object.values(deck).reduce((sum, c) => sum + c.count, 0)}/50)
          </h2>
          {Object.values(deck).length === 0 && (
            <p className="text-gray-600">No cards added yet.</p>
          )}
          <ul className="space-y-2">
            {Object.values(deck).map((c) => (
              <li key={c.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-gray-500">Copies: {c.count}</p>
                </div>
                <button
                  onClick={() => removeFromDeck(c.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={saveDeck}
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Deck
          </button>
        </div>
      </div>
    </div>
  );
}
