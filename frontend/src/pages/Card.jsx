import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Card() {
  const { id } = useParams();
  const [card, setCard] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/card/${id}`)
      .then((res) => res.json())
      .then((data) => setCard(data));
  }, [id]);

  if (!card) return <p className="text-center mt-10">Loading card details...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white text-center py-4 text-2xl font-bold">
        Gundam TCG
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center gap-10 p-8">
        <img
          src={card.image_url}
          alt={card.name}
          className="rounded shadow-lg max-w-xs w-full object-contain"
        />
        <div className="max-w-lg w-full">
          <h1 className="text-4xl font-bold mb-4">{card.name}</h1>
          <p className="text-gray-700 mb-2">
            <strong>Rarity:</strong> {card.rarity}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Color:</strong> {card.color}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Type:</strong> {card.cardType}
          </p>
          <p className="text-gray-600 mt-4">
            {card.description || "No description available."}
          </p>
          <Link
            to="/search"
            className="inline-block mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Search
          </Link>
        </div>
      </main>
    </div>
  );
}
