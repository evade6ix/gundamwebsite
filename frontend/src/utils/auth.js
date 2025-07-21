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
