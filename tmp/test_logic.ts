import { normalizeSizeAvailability, slugifyProductName, type SizeAvailabilityMap } from '../src/lib/products';

const test = () => {
  const sizes = ['P', 'M', 'G'];
  const map: SizeAvailabilityMap = { 'p': 'encomenda' };
  const fallback = 'disponivel';

  const result = normalizeSizeAvailability(sizes, map, fallback);
  console.log('Normalized Map:', JSON.stringify(result, null, 2));

  const slug = slugifyProductName('Conjunto Treino Coral');
  console.log('Slug:', slug);

  // Simulation of NaN price
  const priceStr = '';
  const parsedPrice = parseFloat(priceStr);
  console.log('Parsed Price:', parsedPrice);
  console.log('Is NaN:', isNaN(parsedPrice));
};

test();
