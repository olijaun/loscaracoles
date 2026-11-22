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
      searchText: container.dataset.address,
      sr: "4326",
      limit: "1",
    });
    const response = await fetch(search, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Address lookup failed");
    const { results } = await response.json();
    const { lat, lon } = results?.[0]?.attrs ?? {};
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error("Address not found");

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
  } catch {
    status.textContent = "Die Karte konnte nicht geladen werden. Nutze den Link zur Adresssuche.";
    button.disabled = false;
  }
});
