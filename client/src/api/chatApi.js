import API_BASE_URL from "./baseApi";

export const sendChatMessage = async (
  messages,
  site_context
) => {

  const res = await fetch(
    `${API_BASE_URL}/api/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        messages,
        site_context,
      }),
    }
  );

  return res;

};