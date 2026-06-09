import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const METROS = [
  { city: "New York", state: "NY", lat: 40.71, lon: -74.00, util: 94, spaces: 4200, tier: "very-high" },
  { city: "Chicago", state: "IL", lat: 41.85, lon: -87.65, util: 91, spaces: 3100, tier: "very-high" },
  { city: "Boston", state: "MA", lat: 42.36, lon: -71.06, util: 88, spaces: 1800, tier: "high" },
  { city: "Washington DC", state: "DC", lat: 38.90, lon: -77.04, util: 85, spaces: 2200, tier: "high" },
  { city: "San Francisco", state: "CA", lat: 37.77, lon: -122.42, util: 83, spaces: 2600, tier: "high" },
  { city: "Los Angeles", state: "CA", lat: 34.05, lon: -118.24, util: 72, spaces: 2900, tier: "high" },
  { city: "Seattle", state: "WA", lat: 47.61, lon: -122.33, util: 78, spaces: 1500, tier: "high" },
  { city: "Austin", state: "TX", lat: 30.27, lon: -97.74, util: 67, spaces: 980, tier: "moderate" },
  { city: "Denver", state: "CO", lat: 39.74, lon: -104.98, util: 61, spaces: 870, tier: "moderate" },
  { city: "Dallas", state: "TX", lat: 32.78, lon: -96.80, util: 58, spaces: 1400, tier: "moderate" },
  { city: "Atlanta", state: "GA", lat: 33.75, lon: -84.39, util: 44, spaces: 1100, tier: "low-moderate" },
  { city: "Miami", state: "FL", lat: 25.77, lon: -80.19, util: 38, spaces: 940, tier: "low-moderate" },
  { city: "Phoenix", state: "AZ", lat: 33.45, lon: -112.07, util: 41, spaces: 780, tier: "low-moderate" },
  { city: "Minneapolis", state: "MN", lat: 44.98, lon: -93.27, util: 25, spaces: 520, tier: "low" },
  { city: "Nashville", state: "TN", lat: 36.17, lon: -86.78, util: 28, spaces: 430, tier: "low" },
];

const TIER_COLOR = {
  "very-high": "#0d2d6e",
  "high": "#2563eb",
  "moderate": "#6abeac",
  "low-moderate": "#f0a840",
  "low": "#c0bdb8",
};

const TIER_ALPHA = {
  "very-high": 0.18,
  "high": 0.14,
  "moderate": 0.12,
  "low-moderate": 0.10,
  "low": 0.07,
};

const LEGEND = [
  { tier: "very-high", label: "90%+ utilized" },
  { tier: "high", label: "70–89%" },
  { tier: "moderate", label: "50–69%" },
  { tier: "low-moderate", label: "30–49%" },
  { tier: "low", label: "Below 30%" },
];

function getRadius(spaces) {
  return 6 + Math.sqrt(spaces) * 0.28;
}

export default function USActivityHeatmap({
  metros = METROS,
  stats = { periodAvg: 77.8, peakValue: 86.4, totalGrowth: 26.1 },
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });
  const projectionRef = useRef(null);
  const [projectionReady, setProjectionReady] = useState(false);

  // Load and draw the base map once
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll(".state-layer").remove();

    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((r) => r.json())
      .then((us) => {
        const projection = d3.geoAlbersUsa().scale(667).translate([480, 200]);
        projectionRef.current = projection;
        const path = d3.geoPath().projection(projection);
        const states = topojson.feature(us, us.objects.states);

        const g = svg.append("g").attr("class", "state-layer");

        g.selectAll("path")
          .data(states.features)
          .join("path")
          .attr("d", path)
          .attr("fill", "#dde8f0")
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.8);

        g.append("path")
          .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.8);

        setProjectionReady(true);
      });
  }, []);

  // Redraw markers when filter or metros change (wait for projection)
  useEffect(() => {
    if (!projectionReady || !projectionRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll(".metro-group").remove();

    const visible = activeFilter ? metros.filter((m) => m.tier === activeFilter) : metros;

    visible.forEach((m) => {
      const coords = projectionRef.current([m.lon, m.lat]);
      if (!coords) return;
      const [x, y] = coords;
      const r = getRadius(m.spaces);
      const col = TIER_COLOR[m.tier];
      const alpha = TIER_ALPHA[m.tier];

      const g = svg.append("g").attr("class", "metro-group").style("cursor", "pointer");

      g.append("circle")
        .attr("cx", x).attr("cy", y)
        .attr("r", r * 3.5)
        .attr("fill", col)
        .attr("fill-opacity", alpha)
        .attr("stroke", "none");

      g.append("circle")
        .attr("cx", x).attr("cy", y)
        .attr("r", r)
        .attr("fill", col)
        .attr("fill-opacity", 0.9)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);

      g.on("mousemove", (event) => {
        const svgRect = svgRef.current.getBoundingClientRect();
        setTooltip({
          visible: true,
          x: event.clientX - svgRect.left + 12,
          y: event.clientY - svgRect.top - 10,
          data: m,
        });
      }).on("mouseleave", () => {
        setTooltip((t) => ({ ...t, visible: false }));
      });
    });
  }, [activeFilter, metros, projectionReady]);

  const handleLegendClick = (tier) => {
    setActiveFilter((prev) => (prev === tier ? null : tier));
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div>
          <p style={{ fontWeight: 500, fontSize: 15, margin: "0 0 2px", color: "#111" }}>US Activity Heatmap</p>
          <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Regional workspace utilization and metro activity across the United States</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          {LEGEND.map(({ tier, label }) => (
            <button
              key={tier}
              onClick={() => handleLegendClick(tier)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                fontSize: 11, color: activeFilter && activeFilter !== tier ? "#bbb" : "#555",
                background: "none", border: "none", padding: 0, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: TIER_COLOR[tier], display: "inline-block", flexShrink: 0 }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div ref={containerRef} style={{ position: "relative", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", background: "#f0f4f8" }}>
        {tooltip.visible && tooltip.data && (
          <div style={{
            position: "absolute", left: tooltip.x, top: tooltip.y,
            background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
            padding: "8px 12px", fontSize: 12, pointerEvents: "none", zIndex: 10,
          }}>
            <div style={{ fontWeight: 500, marginBottom: 3 }}>{tooltip.data.city}, {tooltip.data.state}</div>
            <div style={{ color: "#666" }}>Utilization: {tooltip.data.util}%</div>
            <div style={{ color: "#666" }}>Spaces: {tooltip.data.spaces.toLocaleString()}</div>
          </div>
        )}
        <svg ref={svgRef} viewBox="0 0 960 400" style={{ width: "100%", display: "block" }} />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 }}>
        <StatCard label="Period avg" value={`${stats.periodAvg}%`} />
        <StatCard label="Peak value" value={`${stats.peakValue}%`} />
        <StatCard label="Total growth" value={`+${stats.totalGrowth}%`} positive />
      </div>
    </div>
  );
}

function StatCard({ label, value, positive }) {
  return (
    <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px" }}>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 500, color: positive ? "#1a7a4a" : "#111" }}>{value}</div>
    </div>
  );
}
