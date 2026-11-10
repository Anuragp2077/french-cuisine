/*
  Shared food artwork.

  Every icon is drawn on a 24 x 24 grid so the exact same path data can be
  rendered twice: as <path> elements in React (menu cards, teaser, legend)
  and as Path2D on the game canvas. The dishes are the ones already used
  across the site.
*/

export const FOOD_ICONS = {
  croissant: {
    nameFr: "Croissant",
    nameEn: "Croissant",
    accent: "#d9a441",
    shapes: [
      {
        d: "M2.6 15.7C3.2 9.7 8.1 5.6 12 5.6s8.8 4.1 9.4 10.1c-1.8-1.5-3.5-2.3-5.3-2.5-1.7-.2-3.2.5-4.7 1.5-1.5-1-3-1.7-4.7-1.5-1.8.2-3.5 1-5.3 2.5Z",
        fill: "#d9a441",
        stroke: "#8a5a1f",
        width: 1,
      },
      { d: "M9.1 13.6c.8 1.4 1.4 2.9 1.7 4.6", stroke: "#8a5a1f", width: 0.9 },
      { d: "M14.9 13.6c-.8 1.4-1.4 2.9-1.7 4.6", stroke: "#8a5a1f", width: 0.9 },
    ],
  },

  baguette: {
    nameFr: "Baguette",
    nameEn: "Baguette",
    accent: "#dfb26f",
    shapes: [
      {
        d: "M4.8 19.2 15.1 4.6c1.1-1.5 2.9-2 4-1.2 1.1.8 1 2.5-.2 4L8.6 21.1c-1.1 1.5-2.9 2-4 1.2-1.1-.8-1-2.5.2-3.1Z",
        fill: "#dfb26f",
        stroke: "#9a6b2c",
        width: 1,
      },
      { d: "M9.6 16.4 12.2 13.2", stroke: "#9a6b2c", width: 1.5 },
      { d: "M13.4 11.6 16 8.4", stroke: "#9a6b2c", width: 1.5 },
    ],
  },

  chouquette: {
    nameFr: "Chouquette",
    nameEn: "Chouquette",
    accent: "#e3bd79",
    shapes: [
      { d: "M4.8 14a3.6 3.6 0 1 0 7.2 0 3.6 3.6 0 1 0-7.2 0Z", fill: "#e3bd79", stroke: "#a97c3a", width: 1 },
      { d: "M12 14a3.6 3.6 0 1 0 7.2 0 3.6 3.6 0 1 0-7.2 0Z", fill: "#e3bd79", stroke: "#a97c3a", width: 1 },
      { d: "M8.6 9a3.4 3.4 0 1 0 6.8 0 3.4 3.4 0 1 0-6.8 0Z", fill: "#e3bd79", stroke: "#a97c3a", width: 1 },
      { d: "M7.2 13.2a.9.9 0 1 0 1.8 0 .9.9 0 1 0-1.8 0Z", fill: "#f7f0e2" },
      { d: "M14.4 15.4a.9.9 0 1 0 1.8 0 .9.9 0 1 0-1.8 0Z", fill: "#f7f0e2" },
      { d: "M10.8 8.2a.9.9 0 1 0 1.8 0 .9.9 0 1 0-1.8 0Z", fill: "#f7f0e2" },
    ],
  },

  coffee: {
    nameFr: "Café",
    nameEn: "Coffee",
    accent: "#d88996",
    shapes: [
      { d: "M8.6 6.6c0-1.2 1.6-1.4 1.6-2.8", stroke: "#cbbda4", width: 1.1 },
      { d: "M12.4 6.6c0-1.2 1.6-1.4 1.6-2.8", stroke: "#cbbda4", width: 1.1 },
      { d: "M5 9.2h10.4v4.4a4.2 4.2 0 0 1-4.2 4.2H9.2A4.2 4.2 0 0 1 5 13.6Z", fill: "#f2ebdd", stroke: "#b9a486", width: 1 },
      { d: "M15.4 10.6h1.4a2.4 2.4 0 0 1 0 4.8h-1.4", stroke: "#e2d6c0", width: 1.2 },
      { d: "M6.2 9.9h8v1.2h-8z", fill: "#6b3b1f" },
      { d: "M3.6 18.4h13.2v1.5H3.6z", fill: "#e6dcc8" },
    ],
  },

  macaron: {
    nameFr: "Macaron",
    nameEn: "Macaron",
    accent: "#d88996",
    shapes: [
      { d: "M3.8 13.4C4.4 8.6 7.8 5.6 12 5.6s7.6 3 8.2 7.8Z", fill: "#d88996", stroke: "#8d4653", width: 1 },
      { d: "M3.2 13.4h17.6v2.2H3.2z", fill: "#f4ece0" },
      { d: "M3.8 15.6h16.4c-.6 3-3.9 3.4-8.2 3.4s-7.6-.4-8.2-3.4Z", fill: "#d88996", stroke: "#8d4653", width: 1 },
    ],
  },

  crepe: {
    nameFr: "Crêpe",
    nameEn: "Crêpe",
    accent: "#e7c47e",
    shapes: [
      { d: "M3.6 6.6h16.8L12 20.8Z", fill: "#e7c47e", stroke: "#a97c3a", width: 1 },
      { d: "M8.4 6.6 12 20.8 15.6 6.6", stroke: "#f3dda9", width: 1.1 },
      { d: "M10.2 4.8h3.6v1.8h-3.6z", fill: "#f0e2b0", stroke: "#a97c3a", width: 0.7 },
    ],
  },

  quiche: {
    nameFr: "Quiche Lorraine",
    nameEn: "Quiche Lorraine",
    accent: "#ecc98a",
    shapes: [
      { d: "M3.8 19.2 12 4.8l8.2 14.4Z", fill: "#ecc98a", stroke: "#a97c3a", width: 1 },
      { d: "M3.2 18.6h17.6v2H3.2z", fill: "#b07a3c" },
      { d: "M9 15.4a.9.9 0 1 0 1.8 0 .9.9 0 1 0-1.8 0Z", fill: "#c98f4c" },
      { d: "M13.2 13.4a.9.9 0 1 0 1.8 0 .9.9 0 1 0-1.8 0Z", fill: "#c98f4c" },
    ],
  },

  croque: {
    nameFr: "Croque-Monsieur",
    nameEn: "Croque-Monsieur",
    accent: "#f2d489",
    shapes: [
      { d: "M3.6 9.4c0-2 1.6-3.6 3.6-3.6h9.6c2 0 3.6 1.6 3.6 3.6v1.2H3.6Z", fill: "#dcae66" },
      { d: "M3.6 10.8h16.8v2.2H3.6z", fill: "#d88996" },
      { d: "M3.6 13.2h16.8v1.4c-2.6 1.6-5.6-1.2-8.4.2-2.8 1.4-5.8-1-8.4.6Z", fill: "#f2d489" },
      {
        d: "M3.6 15.4h16.8v1.4c0 1.4-1.2 2.4-2.6 2.4H6.2c-1.4 0-2.6-1-2.6-2.4Z",
        fill: "#cfa25c",
        stroke: "#8a5a1f",
        width: 0.8,
      },
    ],
  },

  camembert: {
    nameFr: "Camembert",
    nameEn: "Camembert",
    accent: "#f4eddd",
    shapes: [
      { d: "M3.4 18.6 10.4 6.6a1.9 1.9 0 0 1 3.2 0l7 12Z", fill: "#f4eddd", stroke: "#c3b295", width: 1 },
      { d: "M10.4 6.6a1.9 1.9 0 0 1 3.2 0l7 12h-2.3l-6.2-10.8-6.2 10.8H3.4Z", fill: "#e0cfa8" },
      { d: "M9.4 14.6a.8.8 0 1 0 1.6 0 .8.8 0 1 0-1.6 0Z", fill: "#e6d9bd" },
      { d: "M13.4 16.4a.8.8 0 1 0 1.6 0 .8.8 0 1 0-1.6 0Z", fill: "#e6d9bd" },
    ],
  },

  wine: {
    nameFr: "Vin rouge",
    nameEn: "Red wine",
    accent: "#a83447",
    shapes: [
      { d: "M7.2 5.4h9.6c0 4.6-1.5 7.4-4.8 7.4s-4.8-2.8-4.8-7.4Z", fill: "#efe6d6", stroke: "#cfc0a6", width: 0.9 },
      { d: "M7.9 6.6h8.2c-.3 3.4-1.7 5.2-4.1 5.2s-3.8-1.8-4.1-5.2Z", fill: "#8d1f2f" },
      { d: "M11.3 12.8h1.4v4.6h-1.4z", fill: "#e6dcc8" },
      { d: "M7.8 17.4h8.4v1.6H7.8z", fill: "#e6dcc8" },
    ],
  },

  stew: {
    nameFr: "Bœuf Bourguignon",
    nameEn: "Beef Bourguignon",
    accent: "#b0664a",
    shapes: [
      { d: "M9.4 6.4c0-1.4 1.8-1.6 1.8-3.2", stroke: "#d9cdb6", width: 1.1 },
      { d: "M13.6 6.4c0-1.4 1.8-1.6 1.8-3.2", stroke: "#d9cdb6", width: 1.1 },
      { d: "M4.4 11.4h15.2v5.4a3.4 3.4 0 0 1-3.4 3.4H7.8a3.4 3.4 0 0 1-3.4-3.4Z", fill: "#8a4d39", stroke: "#4a2418", width: 1 },
      { d: "M2.2 12.6h2.2v2.4H2.2z", fill: "#c5a66b" },
      { d: "M19.6 12.6h2.2v2.4h-2.2z", fill: "#c5a66b" },
      { d: "M3 9.6h18v1.8H3z", fill: "#c5a66b" },
      { d: "M11 6.8h2v2.8h-2z", fill: "#c5a66b" },
    ],
  },

  brulee: {
    nameFr: "Crème Brûlée",
    nameEn: "Crème Brûlée",
    accent: "#c98f4c",
    shapes: [
      { d: "M5.4 12.6h13.2l-1.5 6.2a2.2 2.2 0 0 1-2.2 1.8H8.6a2.2 2.2 0 0 1-2.2-1.8Z", fill: "#f4eddd", stroke: "#c3b295", width: 1 },
      { d: "M4.6 12.4h14.8c.9 0 1.5-.6 1.5-1.4s-.6-1.4-1.5-1.4H4.6c-.9 0-1.5.6-1.5 1.4s.6 1.4 1.5 1.4Z", fill: "#a8622a" },
      { d: "M6.6 10.1h4.2v1.1H6.6z", fill: "#e0a86a" },
    ],
  },
};

export const FOOD_IDS = Object.keys(FOOD_ICONS);

const pathCache = new Map();

function getPath(d) {
  let path = pathCache.get(d);

  if (!path) {
    path = new Path2D(d);
    pathCache.set(d, path);
  }

  return path;
}

/*
  Draws an icon centred on (x, y) at the requested pixel size.
  Used by the canvas renderer for collectibles, the finish table and the HUD.
*/
export function drawFoodIcon(ctx, id, x, y, size, options = {}) {
  const icon = FOOD_ICONS[id];

  if (!icon) {
    return;
  }

  const scale = size / 24;

  ctx.save();
  ctx.translate(x - size / 2, y - size / 2);

  if (options.rotation) {
    ctx.translate(size / 2, size / 2);
    ctx.rotate(options.rotation);
    ctx.translate(-size / 2, -size / 2);
  }

  ctx.scale(scale, scale);
  ctx.globalAlpha *= options.alpha ?? 1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const shape of icon.shapes) {
    const path = getPath(shape.d);

    if (shape.fill) {
      ctx.fillStyle = shape.fill;
      ctx.fill(path);
    }

    if (shape.stroke) {
      ctx.strokeStyle = shape.stroke;
      ctx.lineWidth = shape.width ?? 1;
      ctx.stroke(path);
    }
  }

  ctx.restore();
}
