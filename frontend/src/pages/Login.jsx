import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.access_token); // 🟢 Save JWT
      localStorage.setItem("userName", data.name);       // 🟢 Save user's name
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/account"), 2000);
    } else {
      setMessage(`❌ ${data.detail || "Failed to login."}`);
    }
  } catch (err) {
    setMessage("❌ Failed to login. Please try again.");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm"
      >
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {message && (
          <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
        )}
        <div className="mt-4 text-center text-sm text-gray-600">
          Forgot your password?{" "}
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Reset it
          </Link>
        </div>
        <div className="mt-2 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-600 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
