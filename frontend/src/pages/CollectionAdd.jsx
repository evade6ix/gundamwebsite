import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CollectionAdd() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cards?name=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setCards(data.cards || []);
    } catch (err) {
      console.error("Error searching cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCollection = async (card) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/collection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cardId: card.id }),
      });
      if (res.ok) {
        alert(`✅ ${card.name} added to your collection!`);
      } else {
        const error = await res.json();
        alert(`❌ ${error.detail}`);
      }
    } catch (err) {
      console.error("Failed to add card:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add Cards to Collection</h1>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
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

      {loading && <p>Loading cards...</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="border rounded p-2 text-center hover:shadow cursor-pointer"
            onClick={() => addToCollection(card)}
          >
            <img
              src={card.image_url}
              alt={card.name}
              className="w-full h-48 object-contain mb-2"
            />
            <p className="font-semibold">{card.name}</p>
            <p className="text-sm text-gray-600">{card.set?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
