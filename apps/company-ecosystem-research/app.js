const categoryMeta = {
  eda: { label: "EDA/IP", color: "#5B4BB2" },
  equipment: { label: "Equipment", color: "#A2562A" },
  material: { label: "Material", color: "#4D7C59" },
  foundry: { label: "Foundry", color: "#1F7A6D" },
  packaging: { label: "Advanced Packaging", color: "#9A7A2E" },
  memory: { label: "HBM Memory", color: "#B44747" },
  substrate: { label: "Substrate/PCB", color: "#7C5AC7" },
  platform: { label: "NVIDIA Platform", color: "#172331" },
  networking: { label: "Networking", color: "#2F5FA8" },
  assembly: { label: "Server/Rack Assembly", color: "#178A8F" },
  infrastructure: { label: "Power & Cooling", color: "#6B7280" },
  customer: { label: "Customer", color: "#44546A" }
};

const columnMeta = [
  { id: 1, label: "EDA/IP · Tools · Materials" },
  { id: 2, label: "Foundry · HBM Memory" },
  { id: 3, label: "Packaging · Substrate/PCB" },
  { id: 4, label: "NVIDIA Platform" },
  { id: 5, label: "Networking · Rack · Infrastructure" },
  { id: 6, label: "Cloud / AI Customers" }
];

const sourceBook = {
  "src-nvda-10k": {
    title: "NVIDIA Form 10-K, fiscal year ended Jan. 25, 2026",
    url: "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/0001045810-26-000021-index.htm"
  },
  "src-nvda-sustainability": {
    title: "NVIDIA Sustainability Report, fiscal year 2025",
    url: "https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2025.pdf"
  },
  "src-tsmc-report": {
    title: "TSMC annual reports and 3DFabric/CoWoS disclosures",
    url: "https://investor.tsmc.com/english/annual-reports"
  },
  "src-industry-map": {
    title: "Industry ecosystem mapping seed data",
    url: "https://www.nvidia.com/en-us/data-center/"
  }
};

const nodes = [
  ["synopsys", "Synopsys", "eda", 1, "EDA and semiconductor IP used to design complex accelerator silicon.", "EDA/IP flows into NVIDIA chip design."],
  ["cadence", "Cadence", "eda", 1, "EDA software and verification tools for advanced chip design.", "Enables design, verification, and implementation workflows."],
  ["siemens-eda", "Siemens EDA", "eda", 1, "Electronic design automation and verification toolchain provider.", "Supports design and validation workflows across advanced silicon."],
  ["arm", "Arm", "eda", 1, "CPU and interconnect IP ecosystem participant.", "IP can appear around platform, CPU, and system designs."],
  ["asml", "ASML", "equipment", 1, "Lithography equipment supplier for leading-edge semiconductor manufacturing.", "EUV lithography enables advanced-node wafer manufacturing."],
  ["applied-materials", "Applied Materials", "equipment", 1, "Wafer fabrication equipment for deposition, materials engineering, and process steps.", "Process tools support fabs and advanced packaging capacity."],
  ["lam-research", "Lam Research", "equipment", 1, "Etch and deposition equipment supplier.", "Wafer process equipment supports logic and memory manufacturing."],
  ["kla", "KLA", "equipment", 1, "Process control and inspection equipment supplier.", "Inspection and metrology support yield in advanced fabs."],
  ["tokyo-electron", "Tokyo Electron", "equipment", 1, "Semiconductor production equipment supplier.", "Process equipment supports foundry and memory manufacturing."],
  ["shin-etsu", "Shin-Etsu", "material", 1, "Silicon wafers and semiconductor materials supplier.", "Supplies upstream materials used by semiconductor fabs."],
  ["sumco", "SUMCO", "material", 1, "Silicon wafer supplier for semiconductor manufacturing.", "Supplies wafers used in logic and memory fabrication."],
  ["jsr", "JSR / photoresist", "material", 1, "Photoresist and lithography materials supplier.", "Materials support leading-edge lithography processes."],
  ["specialty-gases", "Specialty gases / chemicals", "material", 1, "Specialty gases and chemicals used in wafer processing.", "Consumables support wafer fabrication and memory production."],

  ["tsmc-foundry", "TSMC Foundry", "foundry", 2, "Manufactures NVIDIA leading-edge logic wafers.", "Logic wafer manufacturing for NVIDIA accelerator dies.", "major"],
  ["sk-hynix", "SK hynix", "memory", 2, "HBM memory supplier for AI accelerators.", "HBM memory stacks pair with GPU logic in advanced packages.", "major"],
  ["micron", "Micron", "memory", 2, "HBM memory supplier for NVIDIA AI accelerator platforms.", "HBM supply supports AI accelerator memory bandwidth.", "major"],
  ["samsung", "Samsung Electronics", "memory", 2, "HBM memory and semiconductor ecosystem participant.", "HBM memory can be integrated with accelerator packages.", "major"],

  ["tsmc-cowos", "TSMC CoWoS / 3DFabric", "packaging", 3, "Advanced packaging layer that integrates GPU logic dies with HBM.", "Combines logic dies, HBM, interposers, and package integration.", "major"],
  ["ase", "ASE Technology", "packaging", 3, "Outsourced semiconductor assembly and test provider.", "Packaging and test capacity in the broader accelerator chain."],
  ["amkor", "Amkor", "packaging", 3, "Outsourced semiconductor packaging and test provider.", "Advanced packaging and test ecosystem participant."],
  ["ibiden", "Ibiden", "substrate", 3, "Advanced package substrate supplier.", "Substrates connect packaged accelerators into boards and systems.", "major"],
  ["unimicron", "Unimicron", "substrate", 3, "Package substrate and PCB supplier.", "Substrate and PCB capacity supports accelerator production.", "major"],
  ["shinko", "Shinko", "substrate", 3, "Package substrate and semiconductor package materials supplier.", "Substrates support advanced semiconductor packages."],
  ["nan-ya-pcb", "Nan Ya PCB", "substrate", 3, "PCB and substrate supplier.", "Boards and substrates support server accelerator assemblies."],
  ["ats", "AT&S", "substrate", 3, "High-end PCB and IC substrate supplier.", "Advanced boards and substrates support dense AI systems."],
  ["kinsus", "Kinsus", "substrate", 3, "IC substrate supplier.", "Substrates support package and module manufacturing."],
  ["amphenol", "Amphenol", "substrate", 3, "Connector and high-speed cable supplier.", "High-speed connectors and cables support rack-scale AI systems.", "major"],

  ["nvidia", "NVIDIA", "platform", 4, "GPU, accelerator, networking, systems, and platform company.", "Central platform node for AI accelerator systems.", "hero"],

  ["nvlink", "NVLink / NVSwitch", "networking", 5, "High-bandwidth GPU-to-GPU interconnect platform.", "Connects accelerators inside dense AI systems.", "major"],
  ["spectrum-x", "Spectrum-X Ethernet", "networking", 5, "AI Ethernet networking platform.", "Connects accelerator clusters over Ethernet fabrics."],
  ["quantum-ib", "Quantum InfiniBand", "networking", 5, "InfiniBand networking platform for AI clusters.", "Links large GPU clusters for training and inference."],
  ["connectx", "ConnectX / SuperNIC", "networking", 5, "NIC and SuperNIC connectivity layer.", "Network adapters connect servers into AI fabrics."],
  ["optical-cables", "Optical modules / high-speed cables", "networking", 5, "Optical modules and cables for rack and cluster interconnect.", "Physical connectivity for high-speed AI networking."],
  ["foxconn", "Foxconn", "assembly", 5, "AI server and rack-level manufacturing partner.", "Manufactures AI servers and systems.", "major"],
  ["quanta-qct", "Quanta / QCT", "assembly", 5, "AI server and rack-level manufacturing partner.", "ODM and rack-scale AI system manufacturing.", "major"],
  ["wiwynn", "Wistron / Wiwynn", "assembly", 5, "AI server and rack-level manufacturing partner.", "Server manufacturing for hyperscale AI infrastructure.", "major"],
  ["inventec", "Inventec", "assembly", 5, "Server manufacturing and ODM participant.", "AI server and rack manufacturing ecosystem participant."],
  ["supermicro", "Supermicro", "assembly", 5, "AI server and rack system vendor.", "Builds GPU servers and rack-scale systems."],
  ["dell", "Dell", "assembly", 5, "Enterprise server and AI infrastructure provider.", "Packages accelerator platforms into customer systems."],
  ["hpe", "HPE", "assembly", 5, "Enterprise server, HPC, and AI infrastructure provider.", "Delivers accelerator systems to enterprise and HPC customers."],
  ["lenovo", "Lenovo", "assembly", 5, "Server and infrastructure systems vendor.", "Builds accelerator-based infrastructure systems."],
  ["vertiv", "Vertiv", "infrastructure", 5, "Power delivery and data-center infrastructure provider.", "Supports dense AI data center deployment.", "major"],
  ["schneider", "Schneider Electric", "infrastructure", 5, "Power and data-center infrastructure provider.", "Power distribution and infrastructure for AI deployments.", "major"],
  ["delta", "Delta Electronics", "infrastructure", 5, "Power and thermal infrastructure supplier.", "Power supply and cooling components for AI systems."],
  ["eaton", "Eaton", "infrastructure", 5, "Power management infrastructure provider.", "Power distribution and resilience for data centers."],
  ["coolit", "CoolIT", "infrastructure", 5, "Liquid cooling supplier.", "Liquid cooling components for dense accelerator servers."],
  ["auras", "Auras", "infrastructure", 5, "Thermal module and cooling component supplier.", "Thermal components for server and accelerator systems."],
  ["avc", "AVC", "infrastructure", 5, "Thermal management component supplier.", "Cooling components for high-density systems."],
  ["danfoss", "Danfoss", "infrastructure", 5, "Thermal and fluid control technology provider.", "Cooling and thermal infrastructure components."],

  ["microsoft", "Microsoft Azure", "customer", 6, "Cloud and AI infrastructure demand customer.", "Purchases and deploys accelerator infrastructure.", "major"],
  ["aws", "Amazon AWS", "customer", 6, "Cloud and AI infrastructure demand customer.", "Deploys accelerator infrastructure for cloud AI services.", "major"],
  ["google", "Google Cloud", "customer", 6, "Cloud and AI infrastructure demand customer.", "Deploys accelerator infrastructure for AI workloads.", "major"],
  ["meta", "Meta", "customer", 6, "Large-scale AI infrastructure customer.", "Uses accelerator infrastructure for AI training and inference.", "major"],
  ["oracle", "Oracle Cloud", "customer", 6, "Cloud and AI infrastructure demand customer.", "Deploys accelerator clusters for cloud AI workloads."],
  ["coreweave", "CoreWeave", "customer", 6, "AI cloud infrastructure customer.", "Deploys GPU infrastructure for AI customers."],
  ["xai-enterprise", "xAI / enterprise AI buyers", "customer", 6, "AI model builder and enterprise buyer segment.", "Represents direct AI infrastructure demand."]
].map(([id, name, category, column, role, example, importance = "normal"]) => ({
  id,
  name,
  category,
  column,
  role,
  example,
  importance,
  geography: "",
  tags: [categoryMeta[category].label],
  sources: ["src-industry-map"]
}));

const linkList = [];
function addLink(from, to, label, style = "solid", importance = "normal", bundle = null) {
  linkList.push({ from, to, type: label, label, style, importance, bundle, tier: 1, confidence: 4, note: label });
}
function connectMany(fromIds, toIds, label, style = "solid", importance = "normal", bundle = null) {
  fromIds.forEach((from) => toIds.forEach((to) => addLink(from, to, label, style, importance, bundle)));
}

const eda = ["synopsys", "cadence", "siemens-eda", "arm"];
const equipment = ["asml", "applied-materials", "lam-research", "kla", "tokyo-electron"];
const materials = ["shin-etsu", "sumco", "jsr", "specialty-gases"];
const memory = ["sk-hynix", "micron", "samsung"];
const packaging = ["tsmc-cowos", "ase", "amkor"];
const substrates = ["ibiden", "unimicron", "shinko", "nan-ya-pcb", "ats", "kinsus", "amphenol"];
const networking = ["nvlink", "spectrum-x", "quantum-ib", "connectx", "optical-cables"];
const assemblers = ["foxconn", "quanta-qct", "wiwynn", "inventec", "supermicro", "dell", "hpe", "lenovo"];
const powerCooling = ["vertiv", "schneider", "delta", "eaton", "coolit", "auras", "avc", "danfoss"];
const customers = ["microsoft", "aws", "google", "meta", "oracle", "coreweave", "xai-enterprise"];

connectMany(eda, ["nvidia"], "design enablement", "dashed");
connectMany(equipment, ["tsmc-foundry", ...memory, "ase", "amkor"], "fab / packaging tools", "dashed", "normal", "equipment-tools");
connectMany(materials, ["tsmc-foundry", ...memory], "process materials", "dashed", "normal", "materials-fabs");
addLink("tsmc-foundry", "tsmc-cowos", "logic wafers", "solid", "major");
connectMany(memory, ["tsmc-cowos"], "HBM stacks", "solid", "major");
connectMany(substrates, packaging, "substrates / connectors", "solid", "normal", "substrates-packaging");
connectMany(["tsmc-cowos"], ["nvidia"], "packaged accelerator", "solid", "major");
connectMany(["ase", "amkor"], ["nvidia"], "package / test support", "solid");
connectMany(["nvidia"], networking, "platform networking", "solid", "major");
connectMany(["nvidia"], assemblers, "GPU platform", "solid", "major");
connectMany(networking, assemblers, "cluster interconnect", "solid", "normal", "networking-assembly");
connectMany(substrates, assemblers, "boards / connectors", "solid", "normal", "substrates-assembly");
connectMany(powerCooling, assemblers, "power / cooling enablement", "dashed", "normal", "power-assembly");
connectMany(assemblers, customers, "AI systems", "solid", "major", "assembly-customers");
connectMany(customers, ["nvidia"], "AI demand / capex cycle", "dashed", "feedback", "demand-feedback");

const graphData = {
  updated: "2026-05-18",
  categories: categoryMeta,
  columns: columnMeta,
  companies: nodes,
  links: linkList,
  sources: sourceBook
};

let simplifiedIds = makeSimplifiedIds();

function makeSimplifiedIds() {
  return new Set(graphData.companies
    .filter((node) => ["hero", "major"].includes(node.importance))
    .map((node) => node.id));
}

let state = {
  selectedId: null,
  activeTypes: new Set(graphData.links.map((link) => link.type)),
  focusedCompany: "nvidia",
  viewMode: "full"
};

const svg = document.querySelector("#ecosystemGraph");
const inspector = document.querySelector("#nodeInspector");
const relationshipFilters = document.querySelector("#relationshipFilters");
const search = document.querySelector("#companySearch");
const tooltip = document.createElement("div");
tooltip.className = "tooltip";
document.querySelector(".graph-stage").appendChild(tooltip);

function byId(id) {
  return graphData.companies.find((company) => company.id === id);
}

function sourceLink(id) {
  return graphData.sources[id];
}

function category(node) {
  return graphData.categories[node.category] || { label: node.category, color: "#64748b" };
}

function isNodeVisible(node) {
  return state.viewMode === "full" || simplifiedIds.has(node.id);
}

function visibleLinks() {
  return graphData.links.filter((link) => {
    const from = byId(link.from);
    const to = byId(link.to);
    return from && to && isNodeVisible(from) && isNodeVisible(to) && state.activeTypes.has(link.type);
  });
}

function visibleNodeIds() {
  const ids = new Set([state.focusedCompany]);
  graphData.companies.filter(isNodeVisible).forEach((node) => ids.add(node.id));
  visibleLinks().forEach((link) => {
    ids.add(link.from);
    ids.add(link.to);
  });
  return ids;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function setupFilters() {
  const types = [...new Set(graphData.links.map((link) => link.type))].sort();
  relationshipFilters.innerHTML = types.map((type) => (
    `<button class="chip active" data-type="${escapeHtml(type)}">${escapeHtml(type)}</button>`
  )).join("");
  relationshipFilters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.type;
      if (state.activeTypes.has(type)) {
        state.activeTypes.delete(type);
        button.classList.remove("active");
      } else {
        state.activeTypes.add(type);
        button.classList.add("active");
      }
      render();
    });
  });
}

function setupViewMode() {
  document.querySelectorAll("#viewModeControls button").forEach((button) => {
    button.addEventListener("click", () => {
      state.viewMode = button.dataset.view;
      document.querySelectorAll("#viewModeControls button").forEach((item) => {
        item.classList.toggle("active", item.dataset.view === state.viewMode);
      });
      render();
    });
  });
}

function setupLegend() {
  document.querySelector("#legend").innerHTML = Object.entries(graphData.categories).map(([key, item]) => (
    `<span class="legend-item"><i class="legend-dot" style="background:${item.color}"></i>${escapeHtml(item.label)}</span>`
  )).join("");
}

function layout(nodes, width, height) {
  const bounds = {
    left: Math.max(width < 1400 ? 160 : 132, width * 0.07),
    right: Math.max(width < 1400 ? 160 : 132, width * 0.07),
    top: width < 900 ? 176 : 154,
    bottom: 72
  };
  const columnCount = graphData.columns.length;
  const usableWidth = width - bounds.left - bounds.right;
  const usableHeight = height - bounds.top - bounds.bottom;
  const positions = new Map();
  const order = Object.keys(graphData.categories);

  graphData.columns.forEach((column, index) => {
    const columnNodes = nodes
      .filter((node) => node.column === column.id)
      .sort((a, b) => (
        order.indexOf(a.category) - order.indexOf(b.category) ||
        importanceScore(b) - importanceScore(a) ||
        a.name.localeCompare(b.name)
      ));
    const baseX = bounds.left + (usableWidth * index) / Math.max(1, columnCount - 1);
    const laneGroups = groupBy(columnNodes, (node) => laneKey(node));
    const laneKeys = Object.keys(laneGroups);
    const laneGap = Math.min(42, Math.max(24, width * 0.028));
    const groupWeights = laneKeys.map((key) => Math.max(2.4, laneGroups[key].length));
    const totalWeight = groupWeights.reduce((sum, weight) => sum + weight, 0);
    columnNodes.forEach((node) => {
      const laneIndex = laneKeys.indexOf(laneKey(node));
      const laneOffset = laneKeys.length === 1 ? 0 : (laneIndex - (laneKeys.length - 1) / 2) * laneGap;
      const laneNodes = laneGroups[laneKey(node)];
      const nodeIndex = laneNodes.findIndex((item) => item.id === node.id);
      const priorWeight = groupWeights.slice(0, laneIndex).reduce((sum, weight) => sum + weight, 0);
      const groupTop = bounds.top + (usableHeight * priorWeight) / totalWeight;
      const groupHeight = (usableHeight * groupWeights[laneIndex]) / totalWeight;
      const y = groupTop + (groupHeight * (nodeIndex + 0.5)) / laneNodes.length;
      positions.set(node.id, { x: baseX + laneOffset, y });
    });
  });

  return positions;
}

function groupBy(items, keyFn) {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    groups[key] ||= [];
    groups[key].push(item);
    return groups;
  }, {});
}

function laneKey(node) {
  if (node.column === 1) return node.category;
  if (node.column === 2) return node.category;
  if (node.column === 3) return node.category === "packaging" ? "packaging" : "substrate";
  if (node.column === 5) return node.category;
  return "main";
}

function importanceScore(node) {
  return node.importance === "hero" ? 3 : node.importance === "major" ? 2 : 1;
}

function nodeSize(node, width) {
  const compact = width < 980;
  if (node.importance === "hero") return { w: compact ? 128 : 166, h: compact ? 56 : 66, r: 16 };
  if (node.importance === "major") return { w: compact ? 118 : 142, h: compact ? 42 : 46, r: 12 };
  return { w: compact ? 104 : 128, h: compact ? 34 : 38, r: 10 };
}

function curvePath(a, b, link) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (link.importance === "feedback") {
    const lift = Math.max(95, Math.abs(dx) * 0.14);
    return `M ${a.x} ${a.y} C ${a.x + 80} ${a.y - lift}, ${b.x - 80} ${b.y - lift}, ${b.x} ${b.y}`;
  }
  const bend = Math.max(70, Math.min(185, Math.abs(dx) * 0.5));
  const offset = Math.sign(dy || 1) * Math.min(38, Math.abs(dy) * 0.1);
  return `M ${a.x} ${a.y} C ${a.x + bend} ${a.y + offset}, ${b.x - bend} ${b.y - offset}, ${b.x} ${b.y}`;
}

function renderableEdges(links, positions) {
  const individual = [];
  const bundles = new Map();

  links.forEach((link) => {
    if (!link.bundle) {
      individual.push({ ...link, bundled: false, links: [link] });
      return;
    }
    const group = bundles.get(link.bundle) || { ...link, bundled: true, links: [] };
    group.links.push(link);
    bundles.set(link.bundle, group);
  });

  return [...individual, ...bundles.values()].map((item) => {
    if (!item.bundled) return item;
    const fromPoints = uniquePoints(item.links.map((link) => ({ id: link.from, point: positions.get(link.from) })));
    const toPoints = uniquePoints(item.links.map((link) => ({ id: link.to, point: positions.get(link.to) })));
    return {
      ...item,
      fromPoint: centroid(fromPoints),
      toPoint: centroid(toPoints)
    };
  });
}

function uniquePoints(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item.point || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  }).map((item) => item.point);
}

function centroid(points) {
  return points.reduce((center, point) => ({
    x: center.x + point.x / points.length,
    y: center.y + point.y / points.length
  }), { x: 0, y: 0 });
}

function nodeLabel(name, lineHeight = 13) {
  const words = name.split(" ");
  const lines = [];
  words.forEach((word) => {
    const current = lines[lines.length - 1] || "";
    if (!current || `${current} ${word}`.length > 18) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${current} ${word}`;
    }
  });
  const visible = lines.slice(0, 2);
  const firstY = visible.length === 1 ? 4 : -3;
  return visible.map((line, index) => (
    `<tspan x="0" y="${firstY + index * lineHeight}">${escapeHtml(line)}</tspan>`
  )).join("");
}

function renderGraph() {
  const width = svg.clientWidth || 1280;
  const height = svg.clientHeight || 860;
  const nodeIds = visibleNodeIds();
  const nodes = graphData.companies.filter((company) => nodeIds.has(company.id) && isNodeVisible(company));
  const links = visibleLinks().filter((link) => nodeIds.has(link.from) && nodeIds.has(link.to));
  const positions = layout(nodes, width, height);
  const edgeItems = renderableEdges(links, positions);
  const selectedLinks = links.filter((link) => link.from === state.selectedId || link.to === state.selectedId);
  const selectedNeighbors = new Set(selectedLinks.flatMap((link) => [link.from, link.to]));
  const hasSelection = Boolean(state.selectedId);
  const showEdgeLabels = width >= 1280;
  const columnLabelY = width < 900 ? 134 : 124;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.innerHTML = `
    <defs>
      <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="9" stdDeviation="7" flood-color="#19201f" flood-opacity="0.16"></feDropShadow>
      </filter>
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7370"></path>
      </marker>
    </defs>
    <g class="column-labels">
      ${graphData.columns.map((column) => {
        const x = positions.get(nodes.find((node) => node.column === column.id)?.id)?.x;
        return x ? `<text class="column-label" x="${x}" y="${columnLabelY}">${escapeHtml(column.label)}</text>` : "";
      }).join("")}
    </g>
    <g class="edges">
      ${edgeItems.map((link) => {
        const a = link.bundled ? link.fromPoint : positions.get(link.from);
        const b = link.bundled ? link.toPoint : positions.get(link.to);
        if (!a || !b) return "";
        const from = byId(link.from);
        const bundleTouchesSelection = link.links?.some((item) => item.from === state.selectedId || item.to === state.selectedId);
        const dim = hasSelection && !bundleTouchesSelection && !selectedNeighbors.has(link.from) && !selectedNeighbors.has(link.to);
        const labelPoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        return `
          <path class="edge ${link.bundled ? "bundle" : ""} ${link.style === "dashed" ? "dashed" : ""} ${dim ? "dim" : ""}" d="${curvePath(a, b, link)}" stroke="${category(from).color}" marker-end="url(#arrow)"></path>
          ${showEdgeLabels && (link.importance === "major" || link.bundled) ? `<text class="edge-label ${dim ? "dim" : ""}" x="${labelPoint.x}" y="${labelPoint.y - 8}">${escapeHtml(link.label)}</text>` : ""}
        `;
      }).join("")}
    </g>
    <g class="nodes">
      ${nodes.map((node) => {
        const point = positions.get(node.id);
        const selected = node.id === state.selectedId;
        const dim = hasSelection && node.id !== state.selectedId && !selectedNeighbors.has(node.id);
        const size = nodeSize(node, width);
        const meta = category(node);
        const hero = node.importance === "hero";
        return `
          <g class="node ${hero ? "hero" : ""} ${selected ? "selected" : ""} ${dim ? "dim" : ""}" data-id="${node.id}" transform="translate(${point.x}, ${point.y})">
            <rect x="${-size.w / 2}" y="${-size.h / 2}" width="${size.w}" height="${size.h}" rx="${size.r}" fill="${hero ? meta.color : "#ffffff"}" stroke="${meta.color}" stroke-width="${hero ? 0 : node.importance === "major" ? 2.5 : 1.8}"></rect>
            ${hero ? "" : `<circle class="node-dot" cx="${-size.w / 2 + 13}" cy="${-size.h / 2 + 13}" r="4.2" fill="${meta.color}"></circle>`}
            <text>${nodeLabel(node.name, hero ? 15 : 13)}</text>
          </g>
        `;
      }).join("")}
    </g>
  `;

  svg.querySelectorAll(".node").forEach((nodeElement) => {
    nodeElement.addEventListener("click", () => {
      state.selectedId = nodeElement.dataset.id;
      render();
    });
    nodeElement.addEventListener("mouseenter", showTooltip);
    nodeElement.addEventListener("mousemove", moveTooltip);
    nodeElement.addEventListener("mouseleave", hideTooltip);
  });
}

function showTooltip(event) {
  const node = byId(event.currentTarget.dataset.id);
  tooltip.innerHTML = `
    <strong>${escapeHtml(node.name)}</strong>
    <span>${escapeHtml(category(node).label)}</span>
    <p>${escapeHtml(node.role)}</p>
    <p>${escapeHtml(node.example)}</p>
  `;
  tooltip.classList.add("visible");
  moveTooltip(event);
}

function moveTooltip(event) {
  const stage = document.querySelector(".graph-stage").getBoundingClientRect();
  tooltip.style.left = `${event.clientX - stage.left + 16}px`;
  tooltip.style.top = `${event.clientY - stage.top + 16}px`;
}

function hideTooltip() {
  tooltip.classList.remove("visible");
}

function renderInspector() {
  const company = byId(state.selectedId) || byId(state.focusedCompany);
  const links = graphData.links.filter((link) => link.from === company.id || link.to === company.id);
  const sources = company.sources.map(sourceLink).filter(Boolean);
  inspector.innerHTML = `
    <p class="eyebrow">${escapeHtml(category(company).label)}</p>
    <h3>${escapeHtml(company.name)}</h3>
    <p class="meta">${escapeHtml(company.role)}</p>
    <div class="pill-row">${company.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}</div>
    <div class="risk"><strong>Ecosystem Role</strong><span>${escapeHtml(company.example)}</span></div>
    <div class="relationships">
      <strong>Visible Relationships</strong>
      ${links.map((link) => {
        const counterpartyId = link.from === company.id ? link.to : link.from;
        const counterparty = byId(counterpartyId);
        const direction = link.from === company.id ? "to" : "from";
        return `
          <div class="relationship-item">
            <b>${escapeHtml(link.label)} ${direction} ${escapeHtml(counterparty.name)}</b>
            <span>${link.style === "dashed" ? "Enabling / feedback" : "Production / supply"} relationship</span>
          </div>
        `;
      }).join("")}
    </div>
    <div class="sources">
      <strong>Reference Links</strong>
      ${sources.map((source) => `<a class="source-link" href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>`).join("")}
    </div>
  `;
}

function renderSignals() {
  const visibleNodes = graphData.companies.filter(isNodeVisible);
  const links = visibleLinks();
  document.querySelector("#signalStack").innerHTML = `
    <div class="signal"><strong>${visibleNodes.length} visible companies / layers</strong><span>${state.viewMode === "full" ? "Full ecosystem view" : "Simplified major-node view"}</span></div>
    <div class="signal"><strong>${links.length} visible relationships</strong><span>Solid arrows are production/supply; dashed arrows are enabling or feedback relationships.</span></div>
    <div class="signal"><strong>${graphData.updated}</strong><span>Dataset revision date.</span></div>
  `;
}

function render() {
  const focus = byId(state.focusedCompany);
  document.querySelector("#graphKicker").textContent = `${focus.name} ecosystem`;
  document.querySelector("#graphTitle").textContent = "AI accelerator supply chain";
  renderSignals();
  renderGraph();
  renderInspector();
}

document.querySelector("#resetView").addEventListener("click", () => {
  const query = search.value.trim().toLowerCase();
  const match = graphData.companies.find((company) => company.name.toLowerCase().includes(query));
  if (match) {
    state.focusedCompany = match.id;
    state.selectedId = null;
  }
  render();
});

document.querySelector("#exportJson").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(graphData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `ecosystem-lens-${graphData.updated}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#importJson").addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  const imported = JSON.parse(await file.text());
  graphData.updated = imported.updated || graphData.updated;
  graphData.categories = imported.categories || graphData.categories;
  graphData.columns = imported.columns || graphData.columns;
  graphData.companies = imported.companies || graphData.companies;
  graphData.links = imported.links || graphData.links;
  graphData.sources = imported.sources || graphData.sources;
  simplifiedIds = makeSimplifiedIds();
  state.activeTypes = new Set(graphData.links.map((link) => link.type));
  state.focusedCompany = graphData.companies.find((node) => node.id === "nvidia")?.id || graphData.companies[0]?.id;
  state.selectedId = null;
  setupFilters();
  setupLegend();
  render();
});

window.addEventListener("resize", renderGraph);

setupFilters();
setupViewMode();
setupLegend();
render();
