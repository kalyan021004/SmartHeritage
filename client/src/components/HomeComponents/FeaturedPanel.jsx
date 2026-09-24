import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSiteBySlug,
  generateSite
} from "../../api/siteApi";

import "./FeaturedPanel.css";

export default function FeaturedPanel() {

  const navigate = useNavigate();

  const sites = [

   

    {
      title: "Tirumala Venkateswara Temple",
      desc:
        "Visit the sacred hill shrine of Lord Venkateswara at Tirumala.",
      image:
        "https://images.unsplash.com/photo-1709389137241-af48d39f8b46?q=80&w=737&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      slug: "tirumala-temple",
      place_name: "Tirumala Venkateswara Temple"
    },
    {
      title: "Hampi Ruins",
      desc: "Walk through the ancient ruins of Vijayanagara Empire.",
      image:
        "https://images.unsplash.com/photo-1609920658906-8223bd289001?q=80&w=1600",
      slug: "hampi-ruins",
      place_name: "Hampi Ruins"
    },

    {
      title: "Brihadeeswarar Temple",
      desc:
        "Explore the grandeur of Chola architecture and history.",
      image:
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1600",
      slug: "brihadeeswarar-temple",
      place_name: "Brihadeeswarar Temple"
    }

  ];

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const next = () =>
    setIndex((index + 1) % sites.length);

  const prev = () =>
    setIndex(
      (index - 1 + sites.length) %
      sites.length
    );

  const current = sites[index];



  /* IMPORTANT LOGIC */

  const handleExplore = async () => {

    try {

      setLoading(true);

      let site;

      /* Step 1 — Try database */

      try {

        site =
          await getSiteBySlug(
            current.slug
          );

      }

      catch {

        /* Step 2 — Generate if missing */

        site =
          await generateSite(
            current.place_name
          );

      }

      /* Step 3 — Navigate */

      navigate(
        `/site/${site.slug}`
      );

    }

    catch (err) {

      console.error(err);

      alert(
        "Failed to load site"
      );

    }

    finally {

      setLoading(false);

    }

  };



  return (
    <div>

      <div className="featured-title">
        Featured Sites
      </div>

      <div className="hero">

        <img
          src={current.image}
          className="hero-bg"
        />

        <div className="overlay">

          <h1>
            {current.title}
          </h1>

          <p>
            {current.desc}
          </p>

          <button
            onClick={handleExplore}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Explore"}
          </button>

        </div>



        {/* Arrows */}

        <button
          className="arrow left"
          onClick={prev}
        >
          ❮
        </button>

        <button
          className="arrow right"
          onClick={next}
        >
          ❯
        </button>



        {/* Thumbnails */}

        <div className="thumbs">

          {sites.map((s, i) => (

            <img
              key={i}
              src={s.image}
              className={
                i === index
                  ? "active"
                  : ""
              }
              onClick={() =>
                setIndex(i)
              }
            />

          ))}

        </div>

      </div>

    </div>
  );

}