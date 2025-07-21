import { getUserFromToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  if (!user) {
    navigate("/account"); // force login
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/account");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
        <p className="mb-2 text-gray-700">Email: {user.sub}</p>
        <button
          onClick={handleLogout}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
