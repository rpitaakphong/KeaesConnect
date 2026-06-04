# Ecosystem Lens

A local, dependency-free prototype for mapping a public company's ecosystem and supply-chain relationships.

Open `index.html` in a browser. The seeded NVIDIA graph models EDA/IP, semiconductor equipment, materials, foundry, advanced packaging, HBM memory, substrates, NVIDIA platform, networking, server/rack assembly, power/cooling infrastructure, and cloud/AI customers.

## Data Model

The tool expects JSON with:

- `categories`: category labels and colors keyed by category id.
- `columns`: left-to-right column labels keyed by column number.
- `companies`: nodes with `id`, `name`, `category`, `column`, `role`, `example`, `importance`, `tags`, and `sources`.
- `links`: directed relationships with `from`, `to`, `label`, `style`, and `importance`.
- `sources`: evidence records keyed by source id.

Use **Export JSON** to save the current dataset, edit it, then **Import JSON** to load a richer research graph.

## Research Workflow

1. Start from the target company's latest 10-K, annual report, sustainability report, earnings calls, and investor presentations.
2. Extract named suppliers, customers, capacity dependencies, infrastructure dependencies, and product-generation relationships.
3. Validate each relationship with a second source when possible.
4. Add confidence from 1 to 5. Use 5 for company filings or direct press releases, 3 for credible industry reporting, and 1-2 for weak or inferred links.
5. Separate supplier, customer, equipment, material, logistics, power, and infrastructure edges so bottlenecks are visible.

Refresh the evidence links before publishing or presenting a company ecosystem map.
