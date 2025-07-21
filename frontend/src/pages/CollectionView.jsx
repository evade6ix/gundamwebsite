import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function CollectionView() {
  const { shareId } = useParams();
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedCollection = async () => {
      try {
        // Get shared collection from backend
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/collection/shared/${encodeURIComponent(shareId)}`
        );
        if (!res.ok) {
          console.error("Failed to load shared collection");
          setLoading(false);
          return;
        }

        const data = await res.json();
        const rawCards = data.cards || [];

        // Enrich cards with full details from DB
        const enrichedCards = await Promise.all(
          rawCards.map(async (card) => {
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

        setCollection(enrichedCards);
      } catch (err) {
        console.error("Error fetching shared collection:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedCollection();
  }, [shareId]);

  if (loading) {
    return <p className="text-center mt-8">Loading shared collection...</p>;
  }

  if (!collection.length) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-600">❌ This shared collection was not found or has expired.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-blue-600 underline hover:text-blue-800"
        >
          Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-6">Shared Collection</h1>
        <p className="text-center text-gray-600 mb-8">This collection is view-only.</p>
        <div className="grid grid-cols-5 gap-4">
          {collection.map((card) => (
            <div
              key={card.id}
              className="p-2 border rounded hover:shadow cursor-default"
            >
              <img
                src={card.images?.small || card.image_url || "/placeholder.png"}
                alt={card.name}
                className="w-full h-40 object-contain rounded"
              />
              <div className="mt-2">
                <h3 className="text-lg font-medium">{card.name}</h3>
                <p className="text-gray-500 text-sm">Copies: {card.count}</p>
                <p className="text-gray-500 text-sm">
                  {card.set?.name || card.set_name} / {card.cardType || "Unknown"} / {card.rarity || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
