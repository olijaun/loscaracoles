function normalizeAddress(address) {
  return address
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .normalize("NFKC")
    .toLocaleLowerCase("de-CH")
    .replace(/ß/g, "ss")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

export async function lookupAddress(address) {
  if (!address?.trim()) return null;

  const search = new URL("https://api3.geo.admin.ch/rest/services/ech/SearchServer");
  search.search = new URLSearchParams({
    type: "locations",
    origins: "address",
    searchText: address.replace(/,/g, " ").replace(/\s+/g, " ").trim(),
    sr: "4326",
    geometryFormat: "geojson",
    limit: "5",
  });

  try {
    const response = await fetch(search, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`GeoAdmin returned HTTP ${response.status}`);
    const { features } = await response.json();
    const normalized = normalizeAddress(address);
    const match = features?.find(({ properties, geometry }) =>
      geometry?.type === "Point" && typeof properties?.label === "string" &&
      normalizeAddress(properties.label) === normalized
    );
    const [longitude, latitude] = match?.geometry.coordinates ?? [];
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) return { latitude, longitude };
    console.warn(`No matching GeoAdmin address for "${address}".`);
  } catch (error) {
    console.warn(`Could not look up "${address}": ${error.cause?.message ?? error.message}`);
  }
  return null;
}
