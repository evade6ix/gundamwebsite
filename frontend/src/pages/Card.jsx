import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Card() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCard() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/card/${id}`);
        const data = await res.json();
        setCard(data);
      } catch (err) {
        console.error("Failed to fetch card:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCard();
  }, [id]);

  if (loading) return <p className="p-6">Loading card...</p>;
  if (!card || card.error) return <p className="p-6">Card not found.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <Link
        to="/search"
        className="text-secondary hover:text-accent mb-4 inline-block"
      >
        ← Back to Search
      </Link>

      <div className="flex flex-col md:flex-row gap-8 bg-white rounded shadow p-6">
        <div className="md:w-1/2 flex justify-center">
          <img
            src={card.images?.large || card.image_url}
            alt={card.name}
            className="rounded-lg shadow-lg w-full max-w-sm"
          />
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4 text-black">{card.name}</h1>
          <p className="text-gray-700 mb-2">{card.set?.name}</p>
          <div className="grid grid-cols-2 gap-4 text-black">
            <p><strong>Rarity:</strong> {card.rarity}</p>
            <p><strong>Color:</strong> {card.color}</p>
            <p><strong>Type:</strong> {card.cardType}</p>
            <p><strong>AP:</strong> {card.ap || "N/A"}</p>
            <p><strong>HP:</strong> {card.hp || "N/A"}</p>
            <p><strong>Zone:</strong> {card.zone || "N/A"}</p>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Effect</h2>
            <p className="text-gray-700">{card.effect || "No effect listed."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
