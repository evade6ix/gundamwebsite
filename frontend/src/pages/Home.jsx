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
      <header className="w-full text-center py-28 px-4 relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">
            The Ultimate Gundam TCG Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light drop-shadow-md">
            Manage your collection. Build winning decks. Connect with the Gundam community—all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Get Started Free
            </Link>
            <Link
              to="/search"
              className="px-8 py-3 rounded-xl border border-white text-white font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
            >
              Live Demo
            </Link>
          </div>
        </div>

        {/* Animated Mockup Illustration */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center mt-10">
          <img
            src="/images/mockup.gif"
            alt="App Mockup Animation"
            className="w-full max-w-3xl rounded-xl shadow-2xl"
          />
        </div>
      </header>

      {/* Dynamic Feature Section */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose GundamDatabase?</h2>

        {/* Icon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold mb-2">All-in-One Hub</h3>
            <p className="text-gray-600">Deck builder, collection tracker, and card explorer—all seamlessly connected.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Blazing fast search and real-time updates for your cards and decks.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <div className="text-5xl mb-4">🌐</div>
            <h3 className="text-2xl font-semibold mb-2">Community Ready</h3>
            <p className="text-gray-600">Easily share your collection and decks with friends or the wider community.</p>
          </div>
        </div>

        {/* Step Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow">
            <h4 className="text-xl font-bold mb-2">Step 1: Create Account</h4>
            <p className="text-gray-700">Sign up free and set up your profile in seconds.</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow">
            <h4 className="text-xl font-bold mb-2">Step 2: Build Your Collection</h4>
            <p className="text-gray-700">Track your cards and organize them into decks.</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow">
            <h4 className="text-xl font-bold mb-2">Step 3: Share & Compete</h4>
            <p className="text-gray-700">Show off your decks and get ready for tournaments.</p>
          </div>
        </div>
      </section>

      {/* Showcase Cards (Animated) */}
      <section className="bg-gray-50 py-16">
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
                  className="w-44 md:w-52 rounded-xl shadow-lg border border-gray-200"
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
