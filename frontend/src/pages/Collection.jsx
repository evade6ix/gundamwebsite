import { useEffect, useState } from "react";
import { getUserFromToken } from "../utils/auth";

export default function Collection() {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUserFromToken();

  useEffect(() => {
    async function fetchCollection() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setCollection(data.collection || []);
      setLoading(false);
    }

    if (user) {
      fetchCollection();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center mt-10 text-lg text-gray-600">
        Please log in to view your collection.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Collection</h1>
      {loading ? (
        <p className="text-gray-600">Loading collection...</p>
      ) : collection.length === 0 ? (
        <p className="text-gray-600">No cards in your collection yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {collection.map((card, index) => (
            <div key={index} className="bg-white shadow rounded p-2 text-center">
              <img
                src={card.image_url || "/placeholder.jpg"}
                alt={card.name}
                className="w-full h-40 object-contain mb-2"
              />
              <p className="text-sm font-medium">{card.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
