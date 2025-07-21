export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export function getUserName() {
  return localStorage.getItem("userName");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
}
export function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || null; // Adjust if you store user info differently
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
}
