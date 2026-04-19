import Navbar from "../components/HomeComponents/Navbar";

export default function ProfilePage() {
  const user = {
    name: "Venkata Kalyan Chittiboina",
    email: "kalyan@example.com",
   
   
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Profile Container */}
      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Profile Card */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          {/* Profile Image */}
          <img
            src={user.photo}
            alt="Profile"
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "15px",
              border: "4px solid #007bff",
            }}
          />

          {/* Name */}
          <h2>{user.name}</h2>
          <p style={{ color: "#666", marginBottom: "10px" }}>
            {user.role}
          </p>

          {/* Email */}
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          {/* Project */}
          <p>
            <strong>Current Project:</strong> {user.project}
          </p>

          {/* Skills */}
          <div style={{ marginTop: "20px" }}>
            <h3>Skills</h3>

            <div>
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    margin: "5px",
                    fontSize: "14px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Edit Button */}
          <button
            style={{
              marginTop: "25px",
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}