import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Search() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  async function fetchCards() {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/cards?name=${query}`);
      const data = await res.json();
      setCards(data.cards || []);
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCards();
  }, [query]);

  function handleSearch(e) {
    e.preventDefault();
    const form = e.target;
    const value = form.search.value.trim();
    if (value) setSearchParams({ q: value });
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gundam TCG Search</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          name="search"
          placeholder="Search for a card"
          defaultValue={query}
          style={{ padding: "0.5rem", width: "200px" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>
          Search
        </button>
      </form>
      {loading && <p>Loading cards...</p>}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "1rem"
      }}>
        {cards.map(card => (
          <Link
            key={card.id}
            to={`/card/${card.id}`}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              textDecoration: "none",
              color: "black"
            }}
          >
            <img src={card.image_url} alt={card.name} style={{ width: "100%" }} />
            <h2 style={{ marginTop: "0.5rem", fontSize: "1rem" }}>{card.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
