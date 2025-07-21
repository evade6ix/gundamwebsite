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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900">
      {/* Hero Section */}
      <header className="w-full text-center py-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Gundam TCG Hub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Build decks, share collections, and explore all Gundam TCG cards in one place.
        </p>

        {/* Showcase Cards */}
        <div className="flex justify-center gap-6 mb-12 flex-wrap">
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

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            Features to Power Your TCG Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {/* Profile Page */}
            <div className="group bg-white rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 ease-in-out p-4">
              <img
                src="/images/one.PNG"
                alt="Profile Page"
                className="w-full rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-teal-600">
                Profile Page
              </h3>
              <p className="text-gray-600">
                Manage all your decks in one place with an intuitive interface.
              </p>
            </div>

            {/* Deck View */}
            <div className="group bg-white rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 ease-in-out p-4">
              <img
                src="/images/two.PNG"
                alt="Deck View"
                className="w-full rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-teal-600">
                Deck View
              </h3>
              <p className="text-gray-600">
                Dive into details for each deck and analyze your card strategy.
              </p>
            </div>

            {/* Collection */}
            <div className="group bg-white rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 ease-in-out p-4">
              <img
                src="/images/three.PNG"
                alt="Collection"
                className="w-full rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-teal-600">
                Collection
              </h3>
              <p className="text-gray-600">
                Track every Gundam TCG card you own and build your collection.
              </p>
            </div>

            {/* Shared Collection */}
            <div className="group bg-white rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 ease-in-out p-4">
              <img
                src="/images/four.PNG"
                alt="Shared Collection"
                className="w-full rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-teal-600">
                Shared Collection
              </h3>
              <p className="text-gray-600">
                Showcase your collection to friends with a shareable link.
              </p>
            </div>

            {/* Deck Editor */}
            <div className="group bg-white rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 ease-in-out p-4">
              <img
                src="/images/five.PNG"
                alt="Deck Editor"
                className="w-full rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-teal-600">
                Deck Editor
              </h3>
              <p className="text-gray-600">
                Create and edit decks anytime with our user-friendly deck builder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-400 border-t">
        &copy; {new Date().getFullYear()} Karl @ Game 3 INC. All rights reserved.
      </footer>
    </div>
  );
}
