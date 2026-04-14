import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { generateSite } from '../api/siteApi';
import Navbar from '../components/HomeComponents/Navbar';
import HeroSection from '../components/HomeComponents/HeroSection';
import StatePanel from '../components/HomeComponents/StatePanel';
import FeaturedPanel from '../components/HomeComponents/FeaturedPanel';
import Footer from '../components/HomeComponents/Footer';







export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSelect = (site) => navigate(`/site/${site.slug}`);

  const handleNotFound = async (query) => {
    setLoading(true);
    const site = await generateSite(query);
    if (site?.slug) navigate(`/site/${site.slug}`);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#faf7f2' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }

        

        
        
        
       

        

      
        
        @media (max-width: 1024px) {
          .navbar { padding: 20px 40px; }
          .hero-section { padding: 80px 40px 100px; }
          .hero-title { font-size: 52px; }
          .sites-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-grid { grid-template-columns: 1fr 1fr 1fr; gap: 40px; }
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .sites-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 40px; }
          .search-container { flex-direction: column; }
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAVBAR */}
     

      {/* HERO SECTION */}

      <HeroSection></HeroSection>
      

      <StatePanel></StatePanel>

      {/* FEATURED SITES */}
      <FeaturedPanel></FeaturedPanel>

      {/* INFO SECTION */}

      {/* FOOTER */}

    </div>
  );
}