import "./StatePanel.css";

export default function StatePanel() {

  const STATE_FILTERS = [
    'Karnataka',
    'Tamil Nadu',
    'Andhra Pradesh',
    'Delhi',
    "Rajasthan",
    "Gujarat",
    "Telangana"

  ];

  return (
    <section className="state-filters-section">
      
      <h2 className="state-filters-title">Explore by State</h2>

      <div className="state-filters">
        {STATE_FILTERS.map(state => (
          <a
            key={state}
            href={`/state/${encodeURIComponent(state)}`}
            className="state-chip"
          >
            {state}
          </a>
        ))}
      </div>

      {/* VIEW MORE */}
      <a href="/states" className="view-more-btn">
        View More 
          <button className="arrow right" ></button>

      </a>

    </section>
  );
}