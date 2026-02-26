export type ConversionDictionary = {
  traditionalToSimplified?: Record<string, string>;
  simplifiedToTraditional?: Record<string, string>;
};

export type WebConverter = {
  toSimplified: (text: string) => string;
  toTraditional: (text: string) => string;
};

export declare const toSimplified: (text: string) => string;
export declare const toTraditional: (text: string) => string;

export declare const createConverter: (options?: {
  dictionary?: ConversionDictionary;
}) => WebConverter;

export declare const createConverterFromUrl: (
  dictionaryUrl: string,
  fetchInit?: RequestInit
) => Promise<WebConverter>;
