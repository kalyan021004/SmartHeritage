import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { generateSite } from "../api/siteApi";

import Navbar from "../components/HomeComponents/Navbar";
import HeroSection from "../components/HomeComponents/HeroSection";
import StatePanel from "../components/HomeComponents/StatePanel";
import FeaturedPanel from "../components/HomeComponents/FeaturedPanel";
import Footer from "../components/HomeComponents/Footer";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSelect = (site) => navigate(`/site/${site.slug}`);

  const handleNotFound = async (query) => {
    try {
      setLoading(true);

      const site = await generateSite(query);

      if (site?.slug) {
        navigate(`/site/${site.slug}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <style>{`

        /* ================= GLOBAL ================= */

        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
        }

        .page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #faf7f2;
          width: 100%;
          overflow-x: hidden;
        }

        /* ================= SECTION WRAPPER ================= */

        .section-wrapper {
          width: 100%;
          max-width: 1400px;
          margin: auto;
          padding-left: 80px;
          padding-right: 80px;
        }

        /* ================= TABLET ================= */

        @media (max-width: 1024px) {

          .section-wrapper {
            padding-left: 40px;
            padding-right: 40px;
          }

        }

        /* ================= MOBILE ================= */

        @media (max-width: 768px) {

          .section-wrapper {
            padding-left: 20px;
            padding-right: 20px;
          }

        }

        /* ================= SMALL MOBILE ================= */

        @media (max-width: 480px) {

          .hero-title {
            font-size: 30px;
          }

          .hero-subtitle {
            font-size: 14px;
          }

        }

      `}</style>

      {/* NAVBAR */}


      {/* HERO — FULL WIDTH */}

      <HeroSection />

      {/* STATES */}

      <div className="section-wrapper">
        <StatePanel />
      </div>

      {/* FEATURED */}

      <div className="section-wrapper">
        <FeaturedPanel />
      </div>

      {/* FOOTER */}


    </div>
  );
}