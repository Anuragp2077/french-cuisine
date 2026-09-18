import { useState } from "react";
import { useNavigate } from "react-router-dom";
import france from "@svg-maps/france.regions";
import "./FranceMap.css";

export default function FranceMap() {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const navigate = useNavigate();

  const handleRegionClick = (region) => {
    navigate(`/regions?region=${encodeURIComponent(region.name)}`);
  };

  return (
    <div className="interactive-france-map">
      <svg
        className="interactive-france-map__svg"
        viewBox={france.viewBox}
        role="img"
        aria-label="Map of France"
      >
        {france.locations.map((region) => {
          const isHovered = hoveredRegion === region.id;

          return (
            <path
              key={region.id}
              d={region.path}
              className={`interactive-france-map__region ${
                isHovered ? "is-hovered" : ""
              }`}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => handleRegionClick(region)}
              role="button"
              tabIndex="0"
              aria-label={region.name}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleRegionClick(region);
                }
              }}
            />
          );
        })}
      </svg>

      <div
        className={`interactive-france-map__tooltip ${
          hoveredRegion ? "is-visible" : ""
        }`}
      >
        {hoveredRegion &&
          france.locations.find(
            (region) => region.id === hoveredRegion
          )?.name}
      </div>

      <div className="interactive-france-map__word">
        FRANCE
      </div>
    </div>
  );
}