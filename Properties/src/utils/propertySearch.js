export const budgetRanges = [
  { label: "Any Budget", value: "any", min: 0, max: Number.MAX_SAFE_INTEGER },
  { label: "Under Rs 25L", value: "under-25l", min: 0, max: 2500000 },
  { label: "Rs 25L - Rs 50L", value: "25l-50l", min: 2500000, max: 5000000 },
  { label: "Rs 50L - Rs 1Cr", value: "50l-1cr", min: 5000000, max: 10000000 },
  { label: "Above Rs 1Cr", value: "above-1cr", min: 10000000, max: Number.MAX_SAFE_INTEGER },
];

export const getBudgetRange = (value) =>
  budgetRanges.find((range) => range.value === value) || budgetRanges[0];

export const normalizeText = (value) => String(value || "").trim().toLowerCase();

export const filterProperties = (properties, filters = {}) => {
  const query = normalizeText(filters.query);
  const budget = getBudgetRange(filters.budget);
  const bedrooms = Number(filters.bedrooms || 0);

  return properties.filter((property) => {
    const title = normalizeText(property.title);
    const location = normalizeText(property.location);
    const description = normalizeText(property.description);
    const price = Number(property.price || 0);
    const propertyBedrooms = Number(property.bedrooms || 0);

    const matchesQuery =
      !query ||
      title.includes(query) ||
      location.includes(query) ||
      description.includes(query);

    const matchesBudget = price >= budget.min && price <= budget.max;
    const matchesBedrooms = !bedrooms || propertyBedrooms >= bedrooms;

    return matchesQuery && matchesBudget && matchesBedrooms;
  });
};
