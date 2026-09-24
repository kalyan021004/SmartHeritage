import { useState } from "react";
import { detectTourType } from "../../lib/detectTourType";

import ExternalTourEmbed from "./ExternalTourEmbed";
import TourModal from "./TourModal";
import NarrationPanel from "./NarrationPanel";

export default function TourPlayer({ site }) {
  const links = site?.virtual_tour_links || [];

  const [activeIdx, setActiveIdx] = useState(0);

  const activeLink = links[activeIdx];

  const url = activeLink?.url || null;

  const tourType = detectTourType(url);

  return (
    <div>
      {/* Multiple buttons */}

      {links.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          {links.map((link, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              {link.label || `Tour ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "280px",
          }}
        >
          {!url && (
            <div
              style={{
                padding: "40px",
                border: "1px solid #ddd",
                borderRadius: "12px",
              }}
            >
              No virtual tour available
            </div>
          )}

          {/* FIXED */}

          {url && tourType === "external" && (
            <TourModal
              url={activeLink?.url}
              isIframe={activeLink?.isIframe}
            />
          )}

          {url && tourType === "unknown" && (
            <ExternalTourEmbed url={url} />
          )}
        </div>

        
      </div>
    </div>
  );
}