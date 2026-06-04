export const C = {
  bg: "#F6F7F9",
  ink: "#111827",
  muted: "#6B7280",
  faint: "#E5E7EB",
  panel: "#FFFFFF",
  blue: "#1D4ED8",
  teal: "#0F766E",
  amber: "#B45309",
  coral: "#BE123C",
  green: "#047857",
};

export function addBase(presentation, ctx, opts = {}) {
  const slide = presentation.slides.add();
  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: ctx.H, fill: C.bg });
  ctx.addText(slide, {
    text: "Cambridge IGCSE Additional Mathematics 0606",
    x: 64,
    y: 28,
    w: 650,
    h: 24,
    fontSize: 17,
    color: C.muted,
    typeface: "Helvetica Neue",
  });
  ctx.addText(slide, {
    text: opts.kicker || "Topic 4",
    x: 1080,
    y: 28,
    w: 136,
    h: 24,
    fontSize: 17,
    color: C.muted,
    align: "right",
    typeface: "Helvetica Neue",
  });
  ctx.addShape(slide, { x: 64, y: 64, w: 1152, h: 1, fill: C.faint });
  if (opts.title) {
    ctx.addText(slide, {
      text: opts.title,
      x: 64,
      y: 88,
      w: 780,
      h: 58,
      fontSize: 34,
      bold: true,
      color: C.ink,
      typeface: "Helvetica Neue",
    });
  }
  if (opts.section) {
    pill(slide, ctx, opts.section, 64, 152, opts.sectionColor || C.blue);
  }
  return slide;
}

export function footer(slide, ctx, n) {
  ctx.addText(slide, {
    text: String(n).padStart(2, "0"),
    x: 1168,
    y: 660,
    w: 48,
    h: 24,
    fontSize: 15,
    color: C.muted,
    align: "right",
    typeface: "Helvetica Neue",
  });
}

export function pill(slide, ctx, text, x, y, color = C.blue) {
  ctx.addShape(slide, { x, y, w: 168, h: 30, fill: "#FFFFFF", line: ctx.line(color, 1.4), geometry: "roundRect" });
  ctx.addText(slide, { text, x: x + 14, y: y + 6, w: 140, h: 18, fontSize: 13, bold: true, color, align: "center", typeface: "Helvetica Neue" });
}

export function panel(slide, ctx, x, y, w, h, opts = {}) {
  ctx.addShape(slide, {
    x, y, w, h,
    fill: opts.fill || C.panel,
    line: ctx.line(opts.line || "#DADDE3", opts.lineWidth || 1),
    geometry: "roundRect",
  });
}

export function heading(slide, ctx, text, x, y, w, color = C.ink) {
  ctx.addText(slide, { text, x, y, w, h: 30, fontSize: 21, bold: true, color, typeface: "Helvetica Neue" });
}

export function body(slide, ctx, text, x, y, w, h, opts = {}) {
  ctx.addText(slide, {
    text,
    x, y, w, h,
    fontSize: opts.size || 21,
    color: opts.color || C.ink,
    typeface: opts.face || "Helvetica Neue",
    bold: opts.bold || false,
    align: opts.align || "left",
    valign: opts.valign || "top",
    insets: opts.insets || { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

export function formula(slide, ctx, text, x, y, w, h, opts = {}) {
  panel(slide, ctx, x, y, w, h, { fill: opts.fill || "#FBFCFD", line: opts.line || "#D1D5DB" });
  ctx.addText(slide, {
    text,
    x: x + 18,
    y: y + 15,
    w: w - 36,
    h: h - 30,
    fontSize: opts.size || 26,
    color: opts.color || C.ink,
    bold: opts.bold || false,
    typeface: "Helvetica Neue",
    align: opts.align || "center",
    valign: "mid",
  });
}

export function answer(slide, ctx, text, x, y, w, h) {
  formula(slide, ctx, text, x, y, w, h, { fill: "#FFF7ED", line: "#FDBA74", color: C.coral, bold: true, size: 25 });
}

export function note(slide, ctx, text, x, y, w, h) {
  panel(slide, ctx, x, y, w, h, { fill: "#F0FDFA", line: "#99F6E4" });
  ctx.addText(slide, { text: "Teacher note", x: x + 18, y: y + 14, w: w - 36, h: 18, fontSize: 13, bold: true, color: C.teal, typeface: "Helvetica Neue" });
  body(slide, ctx, text, x + 18, y + 38, w - 36, h - 50, { size: 17, color: C.ink });
}

export function svgData(svg) {
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
}

export async function addVGraph(slide, ctx, x, y, w, h) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <g stroke="#E5E7EB" stroke-width="1">${Array.from({length: 9}, (_, i) => `<line x1="${20+i*(w-40)/8}" y1="20" x2="${20+i*(w-40)/8}" y2="${h-25}"/>`).join("")}${Array.from({length: 6}, (_, i) => `<line x1="20" y1="${20+i*(h-45)/5}" x2="${w-20}" y2="${20+i*(h-45)/5}"/>`).join("")}</g>
  <line x1="20" y1="${h-52}" x2="${w-20}" y2="${h-52}" stroke="#9CA3AF" stroke-width="2"/>
  <line x1="${w/2}" y1="20" x2="${w/2}" y2="${h-25}" stroke="#9CA3AF" stroke-width="2"/>
  <path d="M ${w*0.16} ${h*0.28} L ${w*0.48} ${h-52} L ${w*0.86} ${h*0.16}" fill="none" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="${w*0.16}" y1="${h*0.46}" x2="${w*0.86}" y2="${h*0.46}" stroke="#BE123C" stroke-width="3" stroke-dasharray="8 7"/>
  <text x="${w*0.72}" y="${h*0.42}" font-family="Helvetica Neue" font-size="18" fill="#BE123C">y = 3</text>
  <text x="${w*0.56}" y="${h*0.16}" font-family="Helvetica Neue" font-size="18" fill="#1D4ED8">y = |x - 2|</text></svg>`;
  await ctx.addImage(slide, { dataUrl: svgData(svg), x, y, w, h, fit: "contain", alt: "V-shaped absolute value graph" });
}

export async function addCubicGraph(slide, ctx, x, y, w, h) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <g stroke="#E5E7EB" stroke-width="1">${Array.from({length: 8}, (_, i) => `<line x1="${25+i*(w-50)/7}" y1="20" x2="${25+i*(w-50)/7}" y2="${h-30}"/>`).join("")}${Array.from({length: 6}, (_, i) => `<line x1="25" y1="${20+i*(h-50)/5}" x2="${w-25}" y2="${20+i*(h-50)/5}"/>`).join("")}</g>
  <line x1="25" y1="${h*0.56}" x2="${w-25}" y2="${h*0.56}" stroke="#9CA3AF" stroke-width="2"/>
  <line x1="${w*0.42}" y1="20" x2="${w*0.42}" y2="${h-30}" stroke="#9CA3AF" stroke-width="2"/>
  <path d="M ${w*0.08} ${h*0.83} C ${w*0.20} ${h*0.85}, ${w*0.25} ${h*0.16}, ${w*0.36} ${h*0.40} S ${w*0.54} ${h*0.82}, ${w*0.64} ${h*0.52} S ${w*0.82} ${h*0.11}, ${w*0.93} ${h*0.12}" fill="none" stroke="#0F766E" stroke-width="5" stroke-linecap="round"/>
  <g fill="#1D4ED8">${[-2,1,3].map((_, i) => `<circle cx="${[w*0.28,w*0.52,w*0.66][i]}" cy="${h*0.56}" r="6"/>`).join("")}</g>
  <text x="${w*0.22}" y="${h*0.68}" font-family="Helvetica Neue" font-size="18" fill="#111827">-2</text>
  <text x="${w*0.50}" y="${h*0.68}" font-family="Helvetica Neue" font-size="18" fill="#111827">1</text>
  <text x="${w*0.64}" y="${h*0.68}" font-family="Helvetica Neue" font-size="18" fill="#111827">3</text></svg>`;
  await ctx.addImage(slide, { dataUrl: svgData(svg), x, y, w, h, fit: "contain", alt: "Cubic graph with roots marked" });
}
