// src/app/config/site.config.ts
import { SiteConfig } from '../models/property.model';

export const SITE_CONFIG: SiteConfig = {
  companyName: 'imbcargo-montenegro',
  managerName: 'Игорь Николаевич',
  managerPhone: '+000 00 000 000',
  whatsappChannel: 'https://wa.me/38268123456',
  telegramChannel: 'https://t.me/imbcargo_montenegro',
  itemsPerPage: 20,
  featuredItemsPerType: 6, 
  apiUrl: 'https://prus-api2.burgas275.workers.dev/api/properties?luxury=true'
};

export const getSiteConfig = (): SiteConfig => {
  return { ...SITE_CONFIG };
};