import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Card() {
  const { id } = useParams();
  const [card, setCard] = useState(null);

  useEffect(() => {
    async function fetchCard() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/card/${id}`);
        const data = await res.json();
        setCard(data);
      } catch (err) {
        console.error("Failed to fetch card:", err);
      }
    }
    fetchCard();
  }, [id]);

  if (!card) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Card Image */}
        <div className="md:w-1/3 flex justify-center">
          {card.image_url ? (
            <img
              src={card.image_url}
              alt={card.name}
              className="rounded-lg shadow-lg max-h-[500px]"
            />
          ) : (
            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Card Details */}
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{card.name}</h1>
          <p className="text-gray-600 mb-2">Rarity: <span className="font-medium">{card.rarity || "N/A"}</span></p>
          <p className="text-gray-600 mb-2">Color: <span className="font-medium">{card.color || "N/A"}</span></p>
          <p className="text-gray-600 mb-4">Type: <span className="font-medium">{card.type || "N/A"}</span></p>
          <p className="text-gray-800">{card.text || "No description available."}</p>

          <Link
            to="/search"
            className="inline-block mt-6 px-5 py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
          >
            Back to Search
          </Link>
        </div>
      </div>
    </div>
  );
}
