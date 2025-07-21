import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cards?limit=3`);
        const data = await res.json();
        setCards(data.cards || []);
      } catch (err) {
        console.error("Failed to fetch cards:", err);
      }
    }
    fetchCards();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Hero Section */}
      <header className="w-full text-center py-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Gundam TCG Database
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Search, explore, and collect all Gundam TCG cards in one place.
        </p>

        {/* Showcase Cards */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          {cards.length > 0 ? (
            cards.map((card) => (
              <Link
                to={`/card/${card.id}`}
                key={card.id}
                className="transition transform hover:scale-105"
              >
                <img
                  src={card.image_url}
                  alt={card.name}
                  className="w-40 md:w-48 rounded-lg shadow-lg"
                  loading="lazy"
                />
              </Link>
            ))
          ) : (
            <p className="text-gray-500">Loading cards...</p>
          )}
        </div>

        {/* Call to Action Button */}
        <Link
          to="/search"
          className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold shadow hover:bg-teal-700 transition duration-300"
        >
          Start Searching
        </Link>
      </header>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-400 border-t">
        &copy; {new Date().getFullYear()} Karl @ Game 3 INC. All rights reserved.
      </footer>
    </div>
  );
}
