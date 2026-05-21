export type PropertyType = 'flats' | 'houses' | 'plots' | 'commercial' | 'luxury';

export interface Property {
  id: number;
  title: string;
  slug: string;
  url: string;
  price: string | null;
  priceRaw: number | null;
  location: string | null;
  city: string | null;
  region: string | null;
  type: string;
  mainImage: string;
  status: string;
  scrapedAt: string;
  source: string;
  // Extended fields from luxury properties
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number | null;
  distanceToSea?: number;
  allImages?: string[];
  description_en?: string;
  description_he?: string;
  features?: string[];
  featured?: boolean;
}

export interface ApiResponse {
  source: string;
  total: number;
  properties: Property[];
  cacheStatus: {
    isFresh: boolean;
    lastUpdated: string;
    message: string;
  };
  timestamp: string;
}

export interface FilterOptions {
  type: string;
  minPrice: number | null;
  maxPrice: number | null;
  location: string;
  minSize: number | null;
  bedrooms: number | null;
}

// src/app/models/property.model.ts
export interface SiteConfig {
  companyName: string;
  managerName: string;
  managerPhone: string;
  whatsappChannel: string;
  telegramChannel: string;
  itemsPerPage: number;
  featuredItemsPerType: number; 
  apiUrl: string;
}