import { FOOD_ICONS } from "./foodArt";

/*
  Renders the shared food path data as an SVG so the browser UI and the
  game canvas show exactly the same dishes.
*/
export default function FoodGlyph({ id, size = 26, className = "", title }) {
  const icon = FOOD_ICONS[id];

  if (!icon) {
    return null;
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={title || icon.nameEn}
      focusable="false"
    >
      {icon.shapes.map((shape, index) => (
        <path
          key={index}
          d={shape.d}
          fill={shape.fill || "none"}
          stroke={shape.stroke || "none"}
          strokeWidth={shape.width ?? 1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
