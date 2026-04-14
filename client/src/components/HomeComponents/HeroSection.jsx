import "./HeroSection.css";
import SearchBar from "../SearchBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { generateSite } from "../../api/siteApi";
export default function HeroSection() {
     const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

    const handleSelect = (site) => navigate(`/site/${site.slug}`);
    
     const handleNotFound = async (query) => {
  try {
    const data = await generateSite(query);
    navigate(`/site/${data.slug}`);
  } catch (err) {
    console.error(err);
  }
};

  const SUGGESTIONS = ['Brihadeeswarar Temple', 'Hampi', 'Ajanta Caves', 'Red Fort', 'Konark Sun Temple'];


  return (
   <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover India's
            <span className="hero-title-highlight">Living Heritage</span>
          </h1>
          <p className="hero-subtitle">
            Search any temple, fort, or monument. AI generates rich history,
            virtual tours, and voice narration — instantly.
          </p>
          
          {/* SEARCH BAR WITH FUNCTIONALITY */}
          <div className="search-container">
            <div style={{ flex: 1 }}>
              <SearchBar 
                onSelect={handleSelect} 
                onNotFound={handleNotFound} 
              />
            </div>
            
          </div>

          <div>
            <div className="featured-label">Featured Searches</div>
            <div className="suggestions-row">
              <span className="suggestions-try">Try:</span>
              {SUGGESTIONS.map(s => (
                <button key={s} className="suggestion-chip" onClick={() => handleNotFound(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}