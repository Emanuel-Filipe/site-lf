const slugifyProductName = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeSizes = (sizes) =>
  Array.from(
    new Set(
      sizes
        .map((size) => size.trim().toUpperCase())
        .filter(Boolean)
    )
  );

const normalizeSizeAvailability = (
  sizes,
  sizeAvailability,
  fallbackAvailability = "disponivel"
) => {
  const normalizedSizes = normalizeSizes(sizes);
  const normalizedEntries = Object.entries(sizeAvailability || {}).reduce(
    (acc, [size, availability]) => {
      const normalizedSize = size.trim().toUpperCase();
      if (!normalizedSize || (availability !== "disponivel" && availability !== "encomenda")) {
        return acc;
      }

      acc[normalizedSize] = availability;
      return acc;
    },
    {}
  );

  if (normalizedSizes.length === 0) {
    return normalizedEntries;
  }

  return normalizedSizes.reduce((acc, size) => {
    acc[size] = normalizedEntries[size] || fallbackAvailability;
    return acc;
  }, {});
};

const test = () => {
  console.log('--- Testing normalizeSizeAvailability ---');
  const sizes = ['P', 'M', 'G'];
  const map = { 'p': 'encomenda' };
  const fallback = 'disponivel';

  const result = normalizeSizeAvailability(sizes, map, fallback);
  console.log('Result:', JSON.stringify(result, null, 2));

  console.log('\n--- Testing slugifyProductName ---');
  console.log('Slug:', slugifyProductName('Conjunto Treino Coral'));

  console.log('\n--- Testing NaN Price ---');
  const priceStr = '';
  const parsedPrice = parseFloat(priceStr);
  console.log('Parsed Price:', parsedPrice);
  console.log('Is NaN:', isNaN(parsedPrice));
};

test();
