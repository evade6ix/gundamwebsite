import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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

  if (!card) return <p className="text-center mt-10 text-lg">Loading card...</p>;
  if (card.error) return <p className="text-center mt-10 text-lg text-red-500">Card not found</p>;

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 py-10">
      <img
        src={card.image_url}
        alt={card.name}
        className="w-full max-w-md rounded shadow-lg mb-6"
      />
      <h1 className="text-4xl font-bold mb-4">{card.name}</h1>
      <p className="mb-2 text-gray-400">{card.rarity} • {card.color} • {card.cardType}</p>
      <p className="max-w-2xl text-center text-lg">{card.effect}</p>

      <Link
        to="/search"
        className="mt-6 bg-secondary text-white px-5 py-2 rounded hover:bg-accent hover:text-black transition"
      >
        Back to Search
      </Link>
    </div>
  );
}
