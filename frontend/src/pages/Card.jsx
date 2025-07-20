import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Card() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  async function fetchCard() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/card/${id}`);
      const data = await res.json();
      setCard(data);
    } catch (err) {
      console.error("Failed to fetch card:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCard();
  }, [id]);

  if (loading) return <p>Loading card...</p>;
  if (!card) return <p>Card not found.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <Link to="/">← Back to Search</Link>
      <h1>{card.name}</h1>
      <img src={card.image_url} alt={card.name} style={{ width: "300px", display: "block", margin: "1rem 0" }} />
      <p><strong>Rarity:</strong> {card.rarity}</p>
      <p><strong>Color:</strong> {card.color}</p>
      <p><strong>Type:</strong> {card.cardType}</p>
      <p><strong>Effect:</strong> {card.effect}</p>
    </div>
  );
}
