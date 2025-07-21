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
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <header className="w-full text-center py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Gundam TCG Hub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
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

      {/* Feature Blocks */}
      <section className="bg-white">
        {/* Profile Page */}
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto py-16 px-6">
          <img
            src="/images/one.PNG"
            alt="Profile Page"
            className="w-full md:w-1/2 rounded-xl shadow-lg mb-8 md:mb-0 md:mr-8"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">Profile Page</h2>
            <p className="text-gray-700 mb-4">
              Manage all your decks in one place with an intuitive interface that’s designed for TCG enthusiasts.
            </p>
            <Link
              to="/account"
              className="inline-block px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
            >
              View Profile
            </Link>
          </div>
        </div>

        {/* Deck View */}
        <div className="flex flex-col md:flex-row-reverse items-center max-w-6xl mx-auto py-16 px-6 bg-gray-50">
          <img
            src="/images/two.PNG"
            alt="Deck View"
            className="w-full md:w-1/2 rounded-xl shadow-lg mb-8 md:mb-0 md:ml-8"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">Deck View</h2>
            <p className="text-gray-700 mb-4">
              Dive into deck details and analyze your card strategy with powerful tools and clean layouts.
            </p>
            <Link
              to="/account"
              className="inline-block px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
            >
              Browse Decks
            </Link>
          </div>
        </div>

        {/* Collection */}
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto py-16 px-6">
          <img
            src="/images/three.PNG"
            alt="Collection"
            className="w-full md:w-1/2 rounded-xl shadow-lg mb-8 md:mb-0 md:mr-8"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">Collection</h2>
            <p className="text-gray-700 mb-4">
              Track every Gundam TCG card you own. Build your dream collection and access it anytime.
            </p>
            <Link
              to="/collection"
              className="inline-block px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
            >
              Start Your Collection
            </Link>
          </div>
        </div>

        {/* Shared Collection */}
        <div className="flex flex-col md:flex-row-reverse items-center max-w-6xl mx-auto py-16 px-6 bg-gray-50">
          <img
            src="/images/four.PNG"
            alt="Shared Collection"
            className="w-full md:w-1/2 rounded-xl shadow-lg mb-8 md:mb-0 md:ml-8"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">Shared Collection</h2>
            <p className="text-gray-700 mb-4">
              Showcase your collection to friends and community members with a simple shareable link.
            </p>
            <Link
              to="/collection"
              className="inline-block px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
            >
              Share Your Collection
            </Link>
          </div>
        </div>

        {/* Deck Editor */}
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto py-16 px-6">
          <img
            src="/images/five.PNG"
            alt="Deck Editor"
            className="w-full md:w-1/2 rounded-xl shadow-lg mb-8 md:mb-0 md:mr-8"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">Deck Editor</h2>
            <p className="text-gray-700 mb-4">
              Create and edit powerful decks on the fly. Perfect for testing strategies and preparing for tournaments.
            </p>
            <Link
              to="/decks/new"
              className="inline-block px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
            >
              Open Deck Editor
            </Link>
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
