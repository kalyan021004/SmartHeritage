
export default function AboutPage() {
  return (
    <div>
      

      {/* About Container */}
      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "20px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.6",
        }}
      >
        {/* Profile Photo from URL */}
        <img
          src="https://www.image2url.com/r2/default/images/1776616519025-01f9ed67-0d55-4559-b199-4ef91733835f.png"
          alt="Venkata Kalyan Chittiboina"
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "20px",
            border: "4px solid #007bff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        />

        {/* Name */}
        <h1 style={{ marginBottom: "15px" }}>
          Venkata Kalyan Chittiboina
        </h1>

        {/* About Text */}
        <p>
          Hello! I am <strong>Venkata Kalyan Chittiboina</strong>, a passionate
          developer interested in building innovative technology solutions using
          modern web technologies and Artificial Intelligence.
        </p>

        <p>
          I have experience in full-stack development using technologies like
          <strong> React, Node.js, Express, and MongoDB</strong>. I enjoy creating
          real-world applications that are useful, scalable, and user-friendly.
        </p>

        <p>
          Currently, I am working on my major project,
          <strong> SmartHeritage</strong>, which focuses on AI-based
          storytelling, virtual tours, and digital preservation of cultural
          heritage sites.
        </p>
      </div>
    </div>
  );
}