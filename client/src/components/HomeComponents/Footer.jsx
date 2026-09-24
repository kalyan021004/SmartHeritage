import "./Footer.css";

export default function Footer() {
  const FOOTER_LINKS = [
    {
      title: 'SITE LINKS',
      links: [
        { name: 'Destinations', href: 'states' },
        { name: 'Tours', href: '/tours' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'About', href: '/about' }
      ]
    },
    {
      title: 'RESOURCES',
      links: [
        { name: 'AI Features', href: '/' },
        { name: 'Contact Us', href: 'https://www.linkedin.com/in/kalyan021004/' },
        { name: 'FAQs', href: '#' },
        { name: 'Press', href: '#' }
      ]
    },
    {
      title: 'LEGAL',
      links: [
        { name: 'Terms of Use', href: '#' },
        { name: 'Privacy Policy', href: '#' }
      ]
    }
  ];
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4 className="footer-section-title">Contact Information</h4>
          <p className="footer-text">
            Indian Institute Of Information Technology Sricity<br />
            Sricity,AndhraPradesh
          </p>
          <a href="mailto:email@bharatheritage.com" className="footer-link">
            venkatakalyan.c23@iiits.in
          </a>
        </div>

        {FOOTER_LINKS.map(column => (
          <div key={column.title}>
            <h4 className="footer-section-title">{column.title}</h4>
            {column.links.map(link => (
              <a key={link.name} href={link.href} className="footer-link">
                {link.name}
              </a>
            ))}
          </div>
        ))}

        <div className="social-icons">
          <span className="social-icon">f</span>
          <span className="social-icon">𝕏</span>
          <span className="social-icon">in</span>
          <span className="social-icon">in</span>
        </div>
      </div>
    </footer>
  );
}