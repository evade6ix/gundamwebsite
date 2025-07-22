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
  const [showCollectionOnly, setShowCollectionOnly] = useState(false);

  const CARDS_PER_PAGE = 20;

  // ✅ Load user's saved collection + share link + preload all cards
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
        }
      } catch (err) {
        console.error("Error loading collection or share link:", err);
      } finally {
        setLoadingCollection(false);
      }
    };

    fetchData();
handleSearch(); // 👈 Auto-load first page of all cards
}, [navigate, showCollectionOnly]); // 👈 Also re-run when toggle changes

const handleSearch = async (e, page = 1) => {
  if (e) e.preventDefault();

  try {
    setLoading(true);

    let endpoint = `${import.meta.env.VITE_API_URL}/cards?page=${page}&limit=${CARDS_PER_PAGE}`;

    if (showCollectionOnly) {
      const ids = Object.keys(collection).join(",");
      if (ids) {
        // New: request full details for all saved card IDs
        endpoint = `${import.meta.env.VITE_API_URL}/cards?ids=${encodeURIComponent(ids)}`;
      } else {
        // No cards in collection
        setSearchResults([]);
        setCurrentPage(1);
        setTotalPages(1);
        setLoading(false);
        return;
      }
    } else if (query.trim()) {
      endpoint += `&name=${encodeURIComponent(query)}`;
    }

    const res = await fetch(endpoint);
    const data = await res.json();
    setSearchResults(data.cards || []);
    setCurrentPage(data.page || 1);
    setTotalPages(data.totalPages || 1);
  } catch (err) {
    console.error("Error fetching cards:", err);
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

  const displayedCards = searchResults;


  if (loadingCollection) {
    return <p className="text-center mt-8">Loading your collection...</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
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
              onClick={() => navigator.clipboard.writeText(shareLink)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
        )}

        {/* Toggle Button + Disclaimer */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setShowCollectionOnly(!showCollectionOnly)}
            className={`px-4 py-2 rounded ${
              showCollectionOnly ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800"
            }`}
          >
            {showCollectionOnly ? "Showing: My Collection" : "Showing: All Cards"}
          </button>
          <p className="text-gray-500">Click a card to add it to your collection.</p>
        </div>

        {/* Search */}
        {!showCollectionOnly && (
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
        )}

        {/* Search Results */}
        {loading ? (
          <p className="text-gray-500">Loading cards...</p>
        ) : (
          <div className="grid grid-cols-5 gap-6">
            {displayedCards.map((card) => (
              <div
                key={card.id}
                className="p-4 border rounded-lg hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <img
                  src={card.images?.small || card.image_url || "/placeholder.png"}
                  alt={card.name}
                  className="w-full h-60 object-contain rounded-lg mb-3 cursor-pointer"
                  onClick={() => addToCollection(card)}
                />
                <div>
                  <h3 className="text-xl font-semibold">{card.name}</h3>
                  <p className="text-gray-600 text-base">
                    {card.set?.name || card.set_name} / {card.cardType || "Unknown"} / {card.rarity || "N/A"}
                  </p>
                  {collection[card.id] && (
                    <>
                      <p className="text-gray-800 text-base mt-2">
                        Copies: {collection[card.id].count}
                      </p>
                      <button
                        onClick={() => removeFromCollection(card.id)}
                        className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
        {!showCollectionOnly && (
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={(e) => handleSearch(e, currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              ← Prev
            </button>
            <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={(e) => handleSearch(e, currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
