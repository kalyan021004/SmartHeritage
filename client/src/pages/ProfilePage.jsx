import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    async function loadProfile() {

      try {

        const res = await fetch(
          "https://genai-project-65m3.onrender.com/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (res.ok) {

          setUser(data.user);

        }

        else if (res.status === 401) {

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");

        }

        else {

          setError(data.message);

        }

      }

      catch (err) {

        console.error(err);
        setError("Could not load profile");

      }

      finally {

        setLoading(false);

      }

    }

    loadProfile();

  }, [navigate]);

  const getInitials = () => {

    if (!user || !user.name) return "U";

    return user.name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  };

  if (loading) {
    return (
      <div style={styles.page}>
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        {error}
      </div>
    );
  }

  if (!user) return null;

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <div style={styles.avatar}>
          {getInitials()}
        </div>

        <h2 style={styles.name}>
          {user.name}
        </h2>

        <p style={styles.email}>
          {user.email}
        </p>

        <div style={styles.rows}>

          <div style={styles.row}>
            <span style={styles.label}>
              Member since
            </span>
            <span style={styles.value}>
              {user.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString()
                : "—"}
            </span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>
              User ID
            </span>
            <span
              style={{
                ...styles.value,
                fontFamily: "monospace",
                fontSize: "13px"
              }}
            >
              {user.id}
            </span>
          </div>

        </div>

      </div>

    </div>

  );

}

/* ================================
   STYLES
================================ */

const styles = {

  page: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px"
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "32px",
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    textAlign: "center"
  },

  avatar: {
    width: "88px",
    height: "88px",
    margin: "0 auto",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "30px",
    fontWeight: "600"
  },

  name: {
    margin: "16px 0 4px",
    fontSize: "22px"
  },

  email: {
    margin: 0,
    color: "#6b7280"
  },

  rows: {
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #f3f4f6",
    textAlign: "left"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    gap: "12px"
  },

  label: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#9ca3af"
  },

  value: {
    fontSize: "14px",
    color: "#111827",
    textAlign: "right",
    wordBreak: "break-all"
  }

};