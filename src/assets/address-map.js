function normalizeAddress(address) {
  return address
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .normalize("NFKC")
    .toLocaleLowerCase("de-CH")
    .replace(/ß/g, "ss")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

const container = document.querySelector("[data-address-map]");
const button = container.querySelector("button");
const status = container.querySelector('[role="status"]');
button.hidden = false;

button.addEventListener("click", async () => {
  button.disabled = true;
  status.hidden = false;
  status.textContent = "Karte wird geladen …";

  try {
    const search = new URL("https://api3.geo.admin.ch/rest/services/ech/SearchServer");
    search.search = new URLSearchParams({
      type: "locations",
      origins: "address",
      searchText: container.dataset.address.replace(/,/g, " ").replace(/\s+/g, " ").trim(),
      sr: "4326",
      geometryFormat: "geojson",
      limit: "5",
    });
    const response = await fetch(search, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Address lookup failed");
    const { features } = await response.json();
    const address = normalizeAddress(container.dataset.address);
    const match = features?.find(({ properties, geometry }) =>
      geometry?.type === "Point" && typeof properties?.label === "string" &&
      normalizeAddress(properties.label) === address
    );
    if (!match) {
      status.textContent = "Keine eindeutige Adresse gefunden. Nutze den Link zur Adresssuche.";
      button.disabled = false;
      return;
    }
    const [lon, lat] = match.geometry.coordinates ?? [];
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error("Address coordinates missing");

    const embed = new URL("https://www.openstreetmap.org/export/embed.html");
    embed.search = new URLSearchParams({
      bbox: [lon - 0.003, lat - 0.0018, lon + 0.003, lat + 0.0018].join(","),
      layer: "mapnik",
      marker: `${lat},${lon}`,
    });
    const frame = document.createElement("iframe");
    frame.title = `OpenStreetMap: ${container.dataset.venue}`;
    frame.src = embed.href;
    const credit = document.createElement("a");
    credit.href = "https://www.openstreetmap.org/copyright";
    credit.textContent = "© OpenStreetMap-Mitwirkende";
    status.textContent = "Karte geöffnet.";
    button.hidden = true;
    container.append(frame, credit);
  } catch (error) {
    console.warn("OpenStreetMap address lookup failed:", error);
    status.textContent = "Die Karte konnte nicht geladen werden. Nutze den Link zur Adresssuche.";
    button.disabled = false;
  }
});
