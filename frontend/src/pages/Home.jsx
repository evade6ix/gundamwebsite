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
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Hero Section */}
      <header className="w-full text-center py-28 px-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white relative">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Gundam TCG Hub for Collectors & Players
          </h1>
          <p className="text-lg md:text-xl font-light mb-10 opacity-90">
            The all-in-one platform to manage collections, build decks, and explore every Gundam TCG card.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold shadow hover:shadow-md transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/search"
              className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Live Demo
            </Link>
          </div>
        </div>

        {/* Static App Screenshot */}
        <div className="absolute inset-x-0 bottom-[-80px] flex justify-center">
          <img
            src="/images/app-screenshot.png"
            alt="Gundam TCG App Screenshot"
            className="w-full max-w-4xl rounded-xl shadow-xl border border-white"
          />
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto py-28 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Why GundamDatabase?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold mb-2">All-in-One Hub</h3>
            <p className="text-gray-600">Manage decks, collections, and card searches all from one clean interface.</p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-semibold mb-2">Blazing Fast</h3>
            <p className="text-gray-600">Quick search and real-time updates make browsing effortless.</p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-2xl font-semibold mb-2">Community Ready</h3>
            <p className="text-gray-600">Share your collection with friends or the wider Gundam TCG community.</p>
          </div>
        </div>
      </section>

      {/* Showcase Cards */}
      <section className="bg-gray-100 py-20">
        <h3 className="text-3xl font-bold text-center mb-8">Featured Gundam Cards</h3>
        <div className="flex justify-center gap-6 flex-wrap">
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
                  className="w-44 md:w-52 rounded-xl shadow border border-gray-200"
                  loading="lazy"
                />
              </Link>
            ))
          ) : (
            <p className="text-gray-500">Loading cards...</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-gray-500 text-sm border-t">
        &copy; {new Date().getFullYear()} GundamDatabase. All rights reserved.
      </footer>
    </div>
  );
}
