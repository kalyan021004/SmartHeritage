import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {

  const navigate = useNavigate();

  /* ---------------- AUTH STATE ---------------- */

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* Check login status from localStorage */

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

  }, []);

  /* ---------------- UI STATE ---------------- */

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const avatarRef = useRef(null);

  /* Close dropdown when clicking outside */

  useEffect(() => {

    function handleClickOutside(e) {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  /* ---------------- LOGIN ---------------- */

  const handleLogin = () => {
    navigate("/login");
  };

  /* ---------------- REGISTER ---------------- */

  const handleRegister = () => {
    navigate("/register");
  };

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = async () => {

    try {

      await fetch(
        "http://localhost:5000/api/auth/logout",
        {
          method: "POST"
        }
      );

    } catch (err) {

      console.error(err);

    }

    /* Remove auth data */

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setDropdownOpen(false);

    navigate("/login");

  };

  /* ---------------- USER INITIALS ---------------- */

  const getInitials = () => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user || !user.name) return "U";

    return user.name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  };

  return (

    <header className="navbar">

      {/* LEFT: LOGO */}

      <a href="/" className="logo">
        SmartHeritage
      </a>

      {/* CENTER: NAV LINKS */}

      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>

        <a href="/states" className="nav-link">
          Explore By States
        </a>

        

        <a href="/blogs" className="nav-link">
          Blog
        </a>

        <a href="/about" className="nav-link">
          About Us
        </a>

      </nav>

      {/* RIGHT SECTION */}

      <div className="right-section">

        {isLoggedIn ? (

          <div
            className="avatar-wrap"
            ref={avatarRef}
          >

            <div
              className="avatar"
              onClick={() =>
                setDropdownOpen(!dropdownOpen)
              }
            >
              {getInitials()}
            </div>

            {dropdownOpen && (

              <div className="dropdown">

                
                

               

                <button onClick={handleLogout}>
                  Log out
                </button>

              </div>

            )}

          </div>

        ) : (

          <div className="auth-buttons">

            <button
              className="btn"
              onClick={handleLogin}
            >
              Log in
            </button>

            <button
              className="btn btn-fill"
              onClick={handleRegister}
            >
              Register
            </button>

          </div>

        )}

        {/* HAMBURGER */}

        <div
          className="menu-toggle"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </div>

      </div>

      {/* MOBILE MENU */}

      <div
        className={`mobile-menu ${menuOpen ? "active" : ""}`}
      >

        <a
          href="/states"
          className="mobile-link"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          Explore By States
        </a>

        

        <a
          href="/blogs"
          className="mobile-link"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          Blog
        </a>

        <a
          href="/about"
          className="mobile-link"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          About Us
        </a>

      </div>

    </header>

  );

}