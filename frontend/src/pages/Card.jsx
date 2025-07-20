import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Card() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCard() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/card/${id}`);
        const data = await res.json();
        setCard(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch card:", err);
      }
    }

    fetchCard();
  }, [id]);

  if (loading) return <div>Loading card details...</div>;
  if (!card) return <div>Card not found.</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{card.name}</h1>
      <img
        src={card.image_url}
        alt={card.name}
        style={{ width: "300px", marginTop: "1rem" }}
      />
      <p><strong>Rarity:</strong> {card.rarity}</p>
      <p><strong>Color:</strong> {card.color}</p>
      <p><strong>Type:</strong> {card.cardType}</p>
      <p><strong>Effect:</strong> {card.effect}</p>
      <p><strong>Zone:</strong> {card.zone}</p>
      <p><strong>Trait:</strong> {card.trait}</p>
      <p><strong>AP:</strong> {card.ap}</p>
      <p><strong>HP:</strong> {card.hp}</p>
      <p><strong>Source:</strong> {card.sourceTitle}</p>
    </div>
  );
}
