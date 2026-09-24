import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import { auth } from "../firebase.js";

// ============================================================
// API URL
// ============================================================

const API_URL = import.meta.env.VITE_API_URL;


// ============================================================
// GOOGLE LOGIN / REGISTER
// ============================================================

const handleGoogleAuth = async (navigate, setLoading) => {

  try {

    setLoading(true);

    // --------------------------------------------------------
    // Firebase Google Provider
    // --------------------------------------------------------

    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account"
    });


    // --------------------------------------------------------
    // Open Google Login Popup
    // --------------------------------------------------------

    const result = await signInWithPopup(
      auth,
      provider
    );


    // --------------------------------------------------------
    // Get Firebase ID Token
    // --------------------------------------------------------

    const idToken =
      await result.user.getIdToken();


    console.log(
      "Firebase user:",
      result.user.email
    );


    // --------------------------------------------------------
    // Send Firebase Token to Backend
    // --------------------------------------------------------

    const res = await fetch(
      `${API_URL}/api/auth/google`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          idToken
        })
      }
    );


    // --------------------------------------------------------
    // Read Response Safely
    // --------------------------------------------------------

    const text = await res.text();

    console.log(
      "Google backend status:",
      res.status
    );

    console.log(
      "Google backend response:",
      text
    );


    let data;

    try {

      data = JSON.parse(text);

    } catch (error) {

      throw new Error(
        `Backend returned invalid response (${res.status})`
      );

    }


    // --------------------------------------------------------
    // Backend Error
    // --------------------------------------------------------

    if (!res.ok) {

      throw new Error(
        data.message ||
        "Google authentication failed"
      );

    }


    // --------------------------------------------------------
    // Store YOUR JWT
    // --------------------------------------------------------

    localStorage.setItem(
      "token",
      data.token
    );


    // --------------------------------------------------------
    // Store User
    // --------------------------------------------------------

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );


    console.log(
      "Google authentication successful"
    );


    // --------------------------------------------------------
    // Navigate
    // --------------------------------------------------------

    navigate("/");

    window.location.reload();


  } catch (error) {

    console.error(
      "Google authentication error:",
      error
    );

    alert(
      error.message ||
      "Google login failed"
    );


  } finally {

    setLoading(false);

  }
};


// ============================================================
// LOGIN PAGE
// ============================================================

export function LoginPage() {

  const navigate = useNavigate();


  const [email, setEmail] =
    useState("");


  const [password, setPassword] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  // ==========================================================
  // NORMAL LOGIN
  // ==========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      setLoading(true);


      const res = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );


      const data =
        await res.json();


      // ------------------------------------------------------
      // Login Success
      // ------------------------------------------------------

      if (res.ok && data.token) {

        localStorage.setItem(
          "token",
          data.token
        );


        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );


        navigate("/");

        window.location.reload();

      }

      // ------------------------------------------------------
      // Login Failed
      // ------------------------------------------------------

      else {

        alert(
          data.message ||
          "Login failed"
        );

      }


    } catch (err) {

      console.error(
        "Login error:",
        err
      );

      alert(
        "Unable to connect to server"
      );


    } finally {

      setLoading(false);

    }
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div style={styles.container}>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >

        <h2 style={styles.title}>
          Login
        </h2>


        {/* =================================================
            EMAIL
        ================================================= */}

        <input
          type="email"
          placeholder="Email"
          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }

          required

          style={styles.input}
        />


        {/* =================================================
            PASSWORD
        ================================================= */}

        <input
          type="password"
          placeholder="Password"
          value={password}

          onChange={(e) =>
            setPassword(e.target.value)
          }

          required

          style={styles.input}
        />


        {/* =================================================
            LOGIN BUTTON
        ================================================= */}

        <button
          type="submit"

          style={styles.button}

          disabled={loading}
        >

          {loading
            ? "Logging in..."
            : "Login"}

        </button>


        {/* =================================================
            DIVIDER
        ================================================= */}

        <div style={styles.divider}>

          <div style={styles.line}></div>

          <span>OR</span>

          <div style={styles.line}></div>

        </div>


        {/* =================================================
            GOOGLE LOGIN
        ================================================= */}

        <button
          type="button"

          style={styles.googleButton}

          disabled={loading}

          onClick={() =>
            handleGoogleAuth(
              navigate,
              setLoading
            )
          }
        >

          <span style={styles.googleIcon}>
            G
          </span>

          Continue with Google

        </button>


        {/* =================================================
            REGISTER LINK
        ================================================= */}

        <p style={styles.text}>

          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </form>

    </div>

  );
}


// ============================================================
// REGISTER PAGE
// ============================================================

export function RegisterPage() {

  const navigate = useNavigate();


  const [name, setName] =
    useState("");


  const [email, setEmail] =
    useState("");


  const [password, setPassword] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  // ==========================================================
  // NORMAL REGISTER
  // ==========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {

      setLoading(true);


      const res = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );


      const data =
        await res.json();


      // ------------------------------------------------------
      // Registration Success
      // ------------------------------------------------------

      if (res.ok) {

        alert(
          "Registration successful"
        );

        navigate("/login");

      }


      // ------------------------------------------------------
      // Registration Failed
      // ------------------------------------------------------

      else {

        alert(
          data.message ||
          "Registration failed"
        );

      }


    } catch (err) {

      console.error(
        "Registration error:",
        err
      );

      alert(
        "Unable to connect to server"
      );


    } finally {

      setLoading(false);

    }
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <div style={styles.container}>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >

        <h2 style={styles.title}>
          Register
        </h2>


        {/* =================================================
            NAME
        ================================================= */}

        <input
          type="text"
          placeholder="Full Name"

          value={name}

          onChange={(e) =>
            setName(e.target.value)
          }

          required

          style={styles.input}
        />


        {/* =================================================
            EMAIL
        ================================================= */}

        <input
          type="email"
          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }

          required

          style={styles.input}
        />


        {/* =================================================
            PASSWORD
        ================================================= */}

        <input
          type="password"
          placeholder="Password"

          value={password}

          onChange={(e) =>
            setPassword(e.target.value)
          }

          required

          style={styles.input}
        />


        {/* =================================================
            REGISTER BUTTON
        ================================================= */}

        <button
          type="submit"

          style={styles.button}

          disabled={loading}
        >

          {loading
            ? "Registering..."
            : "Register"}

        </button>


        {/* =================================================
            DIVIDER
        ================================================= */}

        <div style={styles.divider}>

          <div style={styles.line}></div>

          <span>OR</span>

          <div style={styles.line}></div>

        </div>


        {/* =================================================
            GOOGLE REGISTER
        ================================================= */}

        <button
          type="button"

          style={styles.googleButton}

          disabled={loading}

          onClick={() =>
            handleGoogleAuth(
              navigate,
              setLoading
            )
          }
        >

          <span style={styles.googleIcon}>
            G
          </span>

          Continue with Google

        </button>


        {/* =================================================
            LOGIN LINK
        ================================================= */}

        <p style={styles.text}>

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </form>

    </div>

  );
}


// ============================================================
// STYLES
// ============================================================

const styles = {

  // ----------------------------------------------------------
  // CONTAINER
  // ----------------------------------------------------------

  container: {

    height: "100vh",

    width: "100vw",

    overflow: "hidden",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    backgroundImage:
      'url("https://images.unsplash.com/photo-1601823984263-b87b59798b70")',

    backgroundSize: "cover",

    backgroundPosition: "center",

    backgroundRepeat: "no-repeat"
  },


  // ----------------------------------------------------------
  // FORM
  // ----------------------------------------------------------

  form: {

    width: "340px",

    padding: "28px",

    display: "flex",

    flexDirection: "column",

    gap: "14px",

    background:
      "rgba(255,255,255,0.18)",

    backdropFilter:
      "blur(10px)",

    WebkitBackdropFilter:
      "blur(10px)",

    borderRadius: "16px",

    border:
      "1px solid rgba(255,255,255,0.3)",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.25)"
  },


  // ----------------------------------------------------------
  // TITLE
  // ----------------------------------------------------------

  title: {

    fontSize: "26px",

    fontWeight: "600",

    color: "#ffffff",

    textAlign: "center",

    marginBottom: "5px"
  },


  // ----------------------------------------------------------
  // TEXT
  // ----------------------------------------------------------

  text: {

    color: "#ffffff",

    textAlign: "center",

    marginTop: "4px"
  },


  // ----------------------------------------------------------
  // INPUT
  // ----------------------------------------------------------

  input: {

    padding: "12px",

    borderRadius: "8px",

    border:
      "1px solid #d1d5db",

    fontSize: "14px",

    outline: "none"
  },


  // ----------------------------------------------------------
  // NORMAL BUTTON
  // ----------------------------------------------------------

  button: {

    padding: "12px",

    borderRadius: "8px",

    border: "none",

    background: "#2563eb",

    color: "white",

    fontWeight: "600",

    cursor: "pointer",

    fontSize: "14px"
  },


  // ----------------------------------------------------------
  // DIVIDER
  // ----------------------------------------------------------

  divider: {

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    color: "#ffffff",

    fontSize: "13px",

    margin: "2px 0"
  },


  line: {

    flex: 1,

    height: "1px",

    background:
      "rgba(255,255,255,0.5)"
  },


  // ----------------------------------------------------------
  // GOOGLE BUTTON
  // ----------------------------------------------------------

  googleButton: {

    padding: "12px",

    borderRadius: "8px",

    border:
      "1px solid #d1d5db",

    background: "#ffffff",

    color: "#333333",

    fontWeight: "600",

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "10px",

    fontSize: "14px"
  },


  // ----------------------------------------------------------
  // GOOGLE ICON
  // ----------------------------------------------------------

  googleIcon: {

    fontSize: "18px",

    fontWeight: "700",

    color: "#4285F4"
  }

};