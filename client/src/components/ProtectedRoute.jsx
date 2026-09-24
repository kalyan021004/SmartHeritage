import { Link } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  if (!token) {

    return (
      <div style={styles.wrapper}>

        {/* CONTENT ON IMAGE */}

        <div style={styles.content}>

          <h1 style={styles.icon}>
            🔒
          </h1>

          <h2 style={styles.title}>
            Please log in to continue
          </h2>

          <p style={styles.text}>
            You must be logged in to access this page.
          </p>

          <Link
            to="/login"
            style={styles.button}
          >
            Go to Login
          </Link>

        </div>

      </div>
    );

  }

  return children;

}

const styles = {

  /* FULL IMAGE BACKGROUND */

  wrapper: {
    minHeight: "100vh",
    backgroundImage:
      'url("https://plus.unsplash.com/premium_photo-1677829176578-090298fdd377?w=1000&auto=format&fit=crop&q=60")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",

    /* Center content */

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    /* Optional readability */

    backgroundColor: "rgba(0,0,0,0.35)",
    backgroundBlendMode: "darken"
  },

  content: {
    textAlign: "center",
    color: "white",
    padding: "20px"
  },

  icon: {
    fontSize: "56px",
    marginBottom: "12px"
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "10px"
  },

  text: {
    fontSize: "16px",
    marginBottom: "24px"
  },

  button: {
    display: "inline-block",
    padding: "12px 26px",
    background: "#2563eb",
    color: "white",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600"
  }

};