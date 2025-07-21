import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Search() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [pagination, setPagination] = useState({
    current: page,
    totalPages: 1,
  });

  async function fetchCards(pageNumber = 1) {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cards?name=${query}&page=${pageNumber}&limit=30`
      );
      const data = await res.json();
      setCards(data.cards || []);
      setPagination({
        current: data.page,
        totalPages: data.totalPages,
      });
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCards(page);
  }, [query, page]);

  function handleSearch(e) {
    e.preventDefault();
    const form = e.target;
    const value = form.search.value.trim();
    if (value) setSearchParams({ q: value, page: 1 });
  }

  function changePage(newPage) {
    setSearchParams({ q: query, page: newPage });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4 text-center text-2xl font-bold">
        Gundam TCG Search
      </header>

      <div className="container mx-auto px-4 py-8">
        <form
          onSubmit={handleSearch}
          className="flex justify-center mb-8 gap-2"
        >
          <input
            type="text"
            name="search"
            placeholder="Search for a card"
            defaultValue={query}
            className="w-full p-3 rounded-l border border-gray-300 outline-none text-gray-900 bg-white"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {loading && (
          <p className="text-center text-lg text-gray-600">Loading cards...</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {cards.map((card) => (
            <Link
              key={card.id}
              to={`/card/${card.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <img
                src={card.image_url}
                alt={card.name}
                className="rounded-t-lg w-full h-60 object-contain p-2"
                loading="lazy"
              />
              <div className="p-3">
                <h2 className="font-semibold text-gray-800">{card.name}</h2>
                <p className="text-sm text-gray-500">
                  {card.rarity} • {card.color}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => changePage(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from(
            { length: pagination.totalPages },
            (_, i) => i + 1
          ).map((p) => (
            <button
              key={p}
              onClick={() => changePage(p)}
              className={`px-4 py-2 rounded ${
                p === pagination.current
                  ? "bg-blue-700 text-white"
                  : "bg-blue-100 text-blue-700"
              } hover:bg-blue-600 hover:text-white transition`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => changePage(pagination.current + 1)}
            disabled={pagination.current === pagination.totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
