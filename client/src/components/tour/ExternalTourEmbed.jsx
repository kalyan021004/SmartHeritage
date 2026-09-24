import { useState } from "react";

export default function ExternalTourEmbed({ url }) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!url) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "520px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        background: "#f9fafb"
      }}
    >
      {loading && !failed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "600"
          }}
        >
          Loading virtual tour...
        </div>
      )}

      {!failed && (
        <iframe
          src={url}
          width="100%"
          height="100%"
          allowFullScreen
          style={{ border: "none" }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setFailed(true);
            setLoading(false);
          }}
        />
      )}

      {failed && (
        <div
          style={{
            textAlign: "center",
            paddingTop: "150px"
          }}
        >
          <p>Preview unavailable.</p>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#2563eb",
              fontWeight: "600"
            }}
          >
            Open Virtual Tour
          </a>
        </div>
      )}
    </div>
  );
}