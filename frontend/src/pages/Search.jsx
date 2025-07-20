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
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Gundam TCG Search</h1>

      <form onSubmit={handleSearch} className="flex mb-8">
        <input
          type="text"
          name="search"
          placeholder="Search for a card"
          defaultValue={query}
          className="w-full p-3 rounded-l border-none outline-none text-black"
        />
        <button
          type="submit"
          className="bg-secondary text-white px-6 rounded-r hover:bg-accent transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-lg">Loading cards...</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {cards.map((card) => (
          <Link
            key={card.id}
            to={`/card/${card.id}`}
            className="bg-white rounded shadow hover:scale-105 transition transform duration-200"
          >
            <img
              src={card.image_url}
              alt={card.name}
              className="rounded-t w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-2 text-black">
              <h2 className="font-semibold">{card.name}</h2>
              <p className="text-sm text-gray-600">
                {card.rarity} • {card.color}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        <button
          onClick={() => changePage(pagination.current - 1)}
          disabled={pagination.current === 1}
          className="px-3 py-2 bg-secondary text-white rounded disabled:opacity-50"
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
            className={`px-3 py-2 rounded ${
              p === pagination.current
                ? "bg-accent text-black"
                : "bg-secondary text-white"
            } hover:bg-accent hover:text-black transition`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => changePage(pagination.current + 1)}
          disabled={pagination.current === pagination.totalPages}
          className="px-3 py-2 bg-secondary text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
