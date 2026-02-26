import { simpleToTradition as baseToTraditional, traditionToSimple as baseToSimplified } from 'chinese-simple2traditional';

const normalizePairEntries = (entries) => {
  if (!entries || typeof entries !== 'object') {
    return [];
  }
  return Object.entries(entries)
    .filter(([source, target]) => typeof source === 'string' && typeof target === 'string' && source.length > 0);
};

const applyLongestMatch = (text, pairs) => {
  if (typeof text !== 'string' || pairs.length === 0) {
    return text;
  }

  let converted = text;
  const sortedPairs = [...pairs].sort((first, second) => second[0].length - first[0].length);

  for (const [source, target] of sortedPairs) {
    converted = converted.split(source).join(target);
  }

  return converted;
};

const parseDictionaryPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new TypeError('Dictionary payload must be a JSON object.');
  }

  const traditionalToSimplified = normalizePairEntries(payload.traditionalToSimplified);
  const simplifiedToTraditional = normalizePairEntries(payload.simplifiedToTraditional);

  return {
    traditionalToSimplified,
    simplifiedToTraditional,
  };
};

export const createConverter = ({ dictionary } = {}) => {
  const traditionalToSimplified = normalizePairEntries(dictionary?.traditionalToSimplified);
  const simplifiedToTraditional = normalizePairEntries(dictionary?.simplifiedToTraditional);

  return {
    toSimplified(text) {
      const customFirst = applyLongestMatch(text, traditionalToSimplified);
      return applyLongestMatch(baseToSimplified(customFirst), traditionalToSimplified);
    },
    toTraditional(text) {
      const customFirst = applyLongestMatch(text, simplifiedToTraditional);
      return applyLongestMatch(baseToTraditional(customFirst), simplifiedToTraditional);
    },
  };
};

export const createConverterFromUrl = async (dictionaryUrl, fetchInit) => {
  const response = await fetch(dictionaryUrl, fetchInit);
  if (!response.ok) {
    throw new Error(`Failed to fetch dictionary: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  return createConverter({ dictionary: parseDictionaryPayload(payload) });
};

export const toSimplified = (text) => baseToSimplified(text);

export const toTraditional = (text) => baseToTraditional(text);
