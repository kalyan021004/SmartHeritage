import { useState, useRef } from "react";

export default function TourModal({
  url,
  isIframe = true
}) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  if (!url) return null;

  const handleFullscreen = () => {
    const el = containerRef.current;

    if (el?.requestFullscreen) {
      el.requestFullscreen();
    }
  };

  const openExternal = () => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleOpen = () => {

    /* IF IFRAME NOT ALLOWED */

    if (!isIframe) {
      openExternal();
      return;
    }

    setOpen(true);
  };

  return (
    <>
      {/* START BUTTON */}

      <button
        onClick={handleOpen}
        style={{
          padding: "12px 20px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Start Virtual Tour
      </button>

      {open && isIframe && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            ref={containerRef}
            style={{
              width: "95%",
              height: "92%",
              background: "#fff",
              borderRadius: "12px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* CLOSE */}

            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: 10,
                right: 15,
                fontSize: 26,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            {/* FULLSCREEN */}

            <button
              onClick={handleFullscreen}
              style={{
                position: "absolute",
                top: 10,
                right: 60,
                padding: "8px 12px",
                borderRadius: "6px",
                border: "none",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Fullscreen
            </button>

            <iframe
              src={url}
              width="100%"
              height="100%"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}
    </>
  );
}