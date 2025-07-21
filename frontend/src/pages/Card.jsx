import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function Card() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);

  useEffect(() => {
    async function fetchCard() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/card/${id}`);
        const data = await res.json();
        setCard(data);
      } catch (err) {
        console.error("Failed to fetch card:", err);
      }
    }
    fetchCard();
  }, [id]);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading card...
      </div>
    );
  }

  const {
    name,
    rarity,
    color,
    cardType,
    effect,
    ap,
    hp,
    sourceTitle,
    set,
    images,
    cost,
    level,
    zone,
    trait,
    link
  } = card;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row gap-8">
        {/* Card Image */}
        <div className="md:w-1/2 flex justify-center items-center">
          {images?.large ? (
            <img
              src={images.large}
              alt={name}
              className="rounded-lg shadow max-h-[500px]"
            />
          ) : (
            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Card Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{name}</h1>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm">
            <p><strong>Rarity:</strong> {rarity || "N/A"}</p>
            <p><strong>Color:</strong> {color || "N/A"}</p>
            <p><strong>Type:</strong> {cardType || "N/A"}</p>
            <p><strong>Cost:</strong> {cost || "N/A"}</p>
            <p><strong>Level:</strong> {level || "N/A"}</p>
            <p><strong>AP:</strong> {ap || "N/A"}</p>
            <p><strong>HP:</strong> {hp || "N/A"}</p>
            <p><strong>Zone:</strong> {zone || "N/A"}</p>
            <p><strong>Trait:</strong> {trait || "N/A"}</p>
            <p><strong>Link:</strong> {link || "N/A"}</p>
            <p><strong>Set:</strong> {set?.name || "N/A"}</p>
            <p><strong>Source:</strong> {sourceTitle || "N/A"}</p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Card Text</h2>
            <p className="bg-gray-100 p-4 rounded-lg text-gray-800">
              {effect ? (
                <span dangerouslySetInnerHTML={{ __html: effect }} />
              ) : (
                "No description available."
              )}
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="inline-block mt-8 px-6 py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
          >
            Back to Search
          </button>
        </div>
      </div>
    </div>
  );
}
