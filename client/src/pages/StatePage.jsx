import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSitesByState, generateSite } from "../api/siteApi";
import Navbar from "../components/HomeComponents/Navbar";

export default function StatePage() {
  const { stateName } = useParams();
  const navigate = useNavigate();

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSites();
  }, [stateName]);

  const fetchSites = async () => {
    setLoading(true);

    try {
      const res = await getSitesByState(stateName);

      if (res.data.length > 0) {
        setSites(res.data);
      } else {
        const generated = await generateStatePlaces(stateName);
        setSites(generated);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };
  const getRandomImage = (images) => {
    if (!images || images.length === 0) {
      return "https://images.unsplash.com/photo-1587135991058-8816b028691f";
    }

    const index = Math.floor(Math.random() * images.length);

    const img = images[index];

    return img?.url || img;
  };

  const generateStatePlaces = async (state) => {
    const places = [
      `${state} famous places`,
      `${state} heritage sites`,
      `${state} tourist attractions`,
    ];

    let results = [];

    for (let p of places) {
      const site = await generateSite(p);
      if (site) results.push(site);
    }

    return results;
  };

  return (
    <div>
      

      <div style={{ padding: "30px" }}>
        <h1 style={{ marginBottom: "20px" }}>
          {stateName} Heritage Sites
        </h1>

        {loading && <p>Loading...</p>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(280px,1fr))",
            gap: "25px",
          }}
        >
          {sites.map((site) => (
            <div
              key={site._id || site.slug}
              onClick={() =>
                navigate(`/site/${site.slug}`)
              }
              style={{
                borderRadius: "14px",
                overflow: "hidden",
                cursor: "pointer",
                background: "#fff",
                boxShadow:
                  "0 4px 14px rgba(0,0,0,0.08)",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(0,0,0,0.08)";
              }}
            >
              {/* COVER IMAGE */}

              <img
                src={getRandomImage(site.images)}
                alt={site.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover"
                }}
              />

              {/* CARD CONTENT */}

              <div style={{ padding: "15px" }}>
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "18px",
                  }}
                >
                  {site.name}
                </h3>

                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  📍 {site.location?.city || stateName}
                </p>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#555",
                    lineHeight: "1.4",
                  }}
                >
                  {site.description?.slice(0, 110)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}