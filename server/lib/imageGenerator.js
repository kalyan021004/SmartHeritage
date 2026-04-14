const axios = require("axios");

async function generateImages(placeName) {
  console.log("Fetching images for:", placeName);

  const queries = [
    `${placeName} temple India`,
    `${placeName} heritage site`,
    `${placeName} monument`,
    placeName
  ];

  for (let q of queries) {
    try {
      console.log("Trying query:", q);

      const response = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
          params: {
            query: q,
            per_page: 3,
            orientation: "landscape"
          },
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`
          }
        }
      );

      const images =
        response.data.results?.map(
          img => img.urls.regular
        ) || [];

      console.log("Images found:", images.length);

      if (images.length > 0) {
        return images;
      }

    } catch (err) {
      console.log("Query failed:", q);
    }
  }

  console.log("No images found, returning fallback image");

  return [
    "https://images.unsplash.com/photo-1587135991058-8816b028691f"
  ];
}

module.exports = generateImages;