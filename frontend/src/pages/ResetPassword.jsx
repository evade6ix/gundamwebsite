// frontend/src/pages/ResetPassword.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Password reset successful! Redirecting...");
        setTimeout(() => navigate("/account"), 2000);
      } else {
        setMessage(`❌ ${data.detail}`);
      }
    } catch (err) {
      setMessage("❌ Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p className="text-center mt-10 text-lg text-red-500">❌ Invalid or missing token.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>
      <form
        onSubmit={handleReset}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm"
      >
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">New Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {message && (
          <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
