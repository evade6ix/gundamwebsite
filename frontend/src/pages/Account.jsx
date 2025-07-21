import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUserName, getUserFromToken } from "../utils/auth";

export default function Account() {
  const navigate = useNavigate();
  const userEmail = getUserFromToken();
  const userName = getUserName();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverCard, setHoverCard] = useState(null);

  // 🔥 Fetch full details for a single card
  const fetchCardDetails = async (cardId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/card/${encodeURIComponent(cardId)}`
      );
      if (res.ok) {
        const data = await res.json();
        return data; // full card details
      }
      console.error(`Failed to fetch card ${cardId}`);
      return null;
    } catch (err) {
      console.error("Error fetching card details:", err);
      return null;
    }
  };

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const fetchDecks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/users/decks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();

          // 🔥 Enrich deck cards with full details
          const enrichedDecks = await Promise.all(
            data.decks.map(async (deck) => {
              const enrichedCards = await Promise.all(
                deck.cards.map(async (card) => {
                  const fullDetails = await fetchCardDetails(card.id);
                  return {
                    ...card,
                    ...fullDetails, // merge full DB card data
                  };
                })
              );
              return { ...deck, cards: enrichedCards };
            })
          );
          setDecks(enrichedDecks);
        } else {
          console.error("Failed to fetch decks");
        }
      } catch (err) {
        console.error("Error fetching decks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [userEmail, navigate]);

  if (!userEmail) return null;

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userName}!</h1>

      <h2 className="text-2xl font-semibold mb-4">Your Decks</h2>

      {loading ? (
        <p>Loading your decks...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Deck */}
          <Link
            to="/decks/new"
            className="border-4 border-dashed border-gray-300 flex flex-col justify-center items-center p-6 rounded-lg hover:border-green-500 hover:shadow-lg transition"
          >
            <span className="text-6xl text-gray-400">＋</span>
            <p className="mt-2 text-lg font-medium text-gray-600">Create New Deck</p>
          </Link>

          {/* Saved Decks */}
          {decks.length === 0 ? (
            <p className="col-span-full text-gray-500">
              You don’t have any decks yet.
            </p>
          ) : (
            decks.map((deck, idx) => (
              <Link
                key={idx}
                to={`/decks/${encodeURIComponent(deck.name)}`}
                className="bg-white shadow rounded-lg p-4 hover:shadow-xl transition relative"
              >
                <div className="mb-2">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {deck.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {deck.cards.reduce((sum, c) => sum + c.count, 0)} cards
                  </p>
                </div>
                <div className="flex gap-1 overflow-x-auto">
                  {deck.cards.slice(0, 5).map((card, i) => (
                    <div
                      key={i}
                      className="relative"
                      onMouseEnter={() => setHoverCard(card)}
                      onMouseLeave={() => setHoverCard(null)}
                    >
                      <img
                        src={card.images?.small || "/placeholder.png"}
                        alt={card.name}
                        className="w-16 h-20 object-contain rounded border"
                      />

                      {/* Hover Popup */}
                      {hoverCard?.id === card.id && (
                        <div className="absolute z-50 left-20 top-0 bg-white border rounded shadow-lg p-2 w-64">
                          <img
                            src={card.images?.large || "/placeholder.png"}
                            alt={card.name}
                            className="w-full h-auto rounded mb-2"
                          />
                          <h4 className="font-bold text-lg">{card.name}</h4>
                          {card.set?.name && (
                            <p className="text-gray-500 text-sm mb-1">
                              Set: {card.set.name}
                            </p>
                          )}
                          {card.rarity && (
                            <p className="text-gray-600 text-sm">
                              Rarity: {card.rarity}
                            </p>
                          )}
                          {card.cardType && (
                            <p className="text-gray-600 text-sm">
                              Type: {card.cardType}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {deck.cards.length > 5 && (
                    <div className="flex justify-center items-center w-16 h-20 bg-gray-100 rounded border text-gray-500">
                      +{deck.cards.length - 5}
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
