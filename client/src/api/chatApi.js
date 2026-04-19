const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://genai-project-65m3.onrender.com";

export const sendChatMessage = async (
  messages,
  site_context
) => {

  const token = localStorage.getItem("token");

  // 🔴 IMPORTANT FIX
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(
    `${API_BASE_URL}/api/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        messages,
        site_context
      })
    }
  );

  if (res.status === 401) {
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res;
};