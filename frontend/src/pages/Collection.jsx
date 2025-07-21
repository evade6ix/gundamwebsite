import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Collection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [collection, setCollection] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [shareLink, setShareLink] = useState(null);

  const CARDS_PER_PAGE = 20;

  // ✅ Auto-load user's saved collection + share link on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        // Load collection
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/collection`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const savedCollection = {};
          (data.cards || []).forEach((card) => {
            savedCollection[card.id] = { ...card };
          });
          setCollection(savedCollection);
        } else {
          console.error("Failed to load collection");
        }

        // Load shareable link
        const shareRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/collection/share`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (shareRes.ok) {
          const shareData = await shareRes.json();
          setShareLink(`${window.location.origin}/collection/view/${shareData.shareId}`);
        } else {
          console.error("Failed to load share link");
        }
      } catch (err) {
        console.error("Error fetching collection or share link:", err);
      } finally {
        setLoadingCollection(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSearch = async (e, page = 1) => {
    e?.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cards?name=${encodeURIComponent(query)}&page=${page}&limit=${CARDS_PER_PAGE}`
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

  const saveCollectionToDB = async (updatedCollection) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      await fetch(`${import.meta.env.VITE_API_URL}/auth/collection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cards: Object.values(updatedCollection).map((c) => ({
            id: c.id,
            name: c.name,
            count: c.count,
          })),
        }),
      });
    } catch (err) {
      console.error("Failed to auto-save collection:", err);
    }
  };

  const addToCollection = (card) => {
    const currentCount = collection[card.id]?.count || 0;
    const updatedCollection = {
      ...collection,
      [card.id]: {
        ...card,
        count: currentCount + 1,
      },
    };
    setCollection(updatedCollection);
    saveCollectionToDB(updatedCollection);
  };

  const removeFromCollection = (cardId) => {
    const updatedCollection = { ...collection };
    if (updatedCollection[cardId].count > 1) {
      updatedCollection[cardId].count -= 1;
    } else {
      delete updatedCollection[cardId];
    }
    setCollection(updatedCollection);
    saveCollectionToDB(updatedCollection);
  };

  if (loadingCollection) {
    return <p className="text-center mt-8">Loading your collection...</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-6">My Collection</h1>

        {/* Shareable Link */}
        {shareLink && (
          <div className="flex items-center gap-2 mb-4">
            <label className="font-medium text-gray-700">Shareable Link:</label>
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 px-3 py-2 border rounded bg-gray-100 text-gray-800"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                alert("✅ Link copied to clipboard!");
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
        )}

        {/* Search */}
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
          <div className="grid grid-cols-5 gap-4">
            {searchResults.map((card) => (
              <div
                key={card.id}
                className="p-2 border rounded hover:shadow"
              >
                <img
                  src={card.images?.small || card.image_url || "/placeholder.png"}
                  alt={card.name}
                  className="w-full h-40 object-contain rounded cursor-pointer"
                  onClick={() => addToCollection(card)}
                />
                <div className="mt-2">
                  <h3 className="text-lg font-medium">{card.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {card.set?.name || card.set_name} / {card.cardType || "Unknown"} / {card.rarity || "N/A"}
                  </p>
                  {collection[card.id] && (
                    <>
                      <p className="text-gray-800 text-sm mt-1">
                        Copies: {collection[card.id].count}
                      </p>
                      <button
                        onClick={() => removeFromCollection(card.id)}
                        className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </>
                  )}
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
    </div>
  );
}
