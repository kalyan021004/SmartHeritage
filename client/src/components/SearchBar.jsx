import { useState, useRef } from "react";
import { searchSites } from "../api/siteApi";

export default function SearchBar({ onSelect, onNotFound }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const debounce = useRef(null);

  const handleInput = (val) => {
    setQuery(val);

    clearTimeout(debounce.current);

    if (val.length < 2) {
      setResults([]);
      setDropdown(false);
      return;
    }

    debounce.current = setTimeout(async () => {
      try {
        const data = await searchSites(val);
        setResults(data.results || []);
        setDropdown(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);
  };

  const handleExplore = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setDropdown(false);

    try {
      if (results.length > 0) {
        onSelect(results[0]);
      } else {
        await onNotFound(query);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="search-wrapper">
      <style>{`

        .search-wrapper {
          position: relative;
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
          outline: none;
          transition: border 0.2s ease;
        }

        .search-input:focus {
          border-color: #2563eb;
        }

        .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #343232;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-top: 4px;
          padding: 0;
          list-style: none;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          max-height: 260px;
          overflow-y: auto;
        }

        .dropdown-item {
          padding: 10px 16px;
          cursor: pointer;
          font-size: 14px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s;
        }

        .dropdown-item:hover {
          background: rgba(255,255,255,0.08);
        }

        .search-button {
          margin-top: 12px;
          width: 100%;
          padding: 14px 18px;
          background: #2563eb;
          color: #fff;
          border: none;
          cursor: pointer;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          transition: background 0.2s ease;
        }

        .search-button:disabled {
          background: #000;
          cursor: not-allowed;
        }

        /* TABLET */

        @media (max-width: 1024px) {

          .search-wrapper {
            max-width: 480px;
          }

        }

        /* MOBILE */

        @media (max-width: 768px) {

          .search-wrapper {
            max-width: 100%;
          }

          .search-input {
            font-size: 14px;
            padding: 12px;
          }

          .search-button {
            font-size: 15px;
            padding: 13px;
          }

        }

        /* SMALL MOBILE */

        @media (max-width: 480px) {

          .search-input {
            font-size: 13px;
          }

          .search-button {
            font-size: 14px;
            padding: 12px;
          }

        }

      `}</style>

      <input
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleExplore()}
        placeholder="Enter place (e.g., Tirupati Temple)"
        className="search-input"
      />

      {dropdown && results.length > 0 && (
        <ul className="dropdown">
          {results.map((r) => (
            <li
              key={r._id}
              className="dropdown-item"
              onClick={() => {
                onSelect(r);
                setDropdown(false);
              }}
            >
              <span style={{ fontWeight: 500 }}>
                {r.name}
              </span>

              <span style={{ color: "#999", fontSize: "13px" }}>
                {r.location?.city}, {r.location?.state}
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleExplore}
        disabled={loading}
        className="search-button"
      >
        {loading
          ? "Generating with AI..."
          : "Explore"}
      </button>
    </div>
  );
}