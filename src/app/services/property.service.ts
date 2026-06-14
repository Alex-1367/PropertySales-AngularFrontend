// src/app/services/property.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Property, ApiResponse, FilterOptions, SiteConfig } from '../models/property.model';
import { SITE_CONFIG } from '../config/site.config';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private http = inject(HttpClient);
  
  // Site configuration
  private config: SiteConfig = { ...SITE_CONFIG };
  
  // Reactive signals for properties
  private allPropertiesSignal = signal<Property[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  
  // Computed signals for filtered properties
  propertiesByType = computed(() => {
    const properties = this.allPropertiesSignal();
    const byType = new Map<string, Property[]>();
    
    console.log('[PropertyService] Computing propertiesByType, total properties:', properties.length);
    
    for (const prop of properties) {
      // For luxury properties, check source === 'luxury'
      let type = prop.type;
      if (prop.source === 'luxury') {
        type = 'luxury';
      }
      
      if (!byType.has(type)) {
        byType.set(type, []);
      }
      byType.get(type)!.push(prop);
    }
    
    // Sort each type by price (cheapest first)
    for (const [type, props] of byType) {
      props.sort((a, b) => (a.priceRaw ?? Infinity) - (b.priceRaw ?? Infinity));
      byType.set(type, props);
    }
    
    // Log counts for debugging
    console.log('[PropertyService] Properties by type:', 
      Array.from(byType.entries()).map(([type, props]) => ({ type, count: props.length }))
    );
    
    return byType;
  });
  
  flats = computed(() => this.propertiesByType().get('flats') ?? []);
  houses = computed(() => this.propertiesByType().get('houses') ?? []);
  plots = computed(() => this.propertiesByType().get('plots') ?? []);
  commercial = computed(() => this.propertiesByType().get('commercial') ?? []);
  luxury = computed(() => this.propertiesByType().get('luxury') ?? []);
  
  totalCount = computed(() => this.allPropertiesSignal().length);
  isLoading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();
  
  constructor() {
    console.log('[PropertyService] Constructor called');
    console.log('[PropertyService] API URL:', this.config.apiUrl);
    this.loadProperties();
  }
  
  private loadProperties(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    console.log('[PropertyService] Starting to load properties from:', this.config.apiUrl);
    
    this.http.get<ApiResponse>(this.config.apiUrl).pipe(
      tap(response => {
        console.log('[PropertyService] Raw API response received:', {
          source: response?.source,
          total: response?.total,
          propertiesCount: response?.properties?.length,
          timestamp: response?.timestamp,
          hasProperties: !!(response?.properties),
          isArray: Array.isArray(response?.properties)
        });
      }),
      map(response => {
        if (response && response.properties && Array.isArray(response.properties)) {
          console.log('[PropertyService] Successfully extracted properties array, count:', response.properties.length);
          
          // Log first property to see structure
          if (response.properties.length > 0) {
            console.log('[PropertyService] First property sample:', {
              id: response.properties[0].id,
              title: response.properties[0].title,
              source: response.properties[0].source,
              type: response.properties[0].type,
              hasAllImages: !!(response.properties[0].allImages),
              allImagesCount: response.properties[0].allImages?.length || 0,
              mainImage: response.properties[0].mainImage?.substring(0, 50) + '...'
            });
          }
          
          return response.properties;
        } else {
          console.error('[PropertyService] Invalid response format - missing properties array');
          console.error('[PropertyService] Response structure:', Object.keys(response || {}));
          return [];
        }
      }),
      catchError((err: any) => {
        console.error('[PropertyService] Failed to load properties. Error details:');
        console.error('[PropertyService] Error message:', err.message);
        console.error('[PropertyService] Error status:', err.status);
        console.error('[PropertyService] Error status text:', err.statusText);
        console.error('[PropertyService] Full error object:', err);
        this.errorSignal.set('Failed to load properties. Please try again later.');
        return of([]);
      })
    ).subscribe({
      next: (properties: Property[]) => {
        console.log('[PropertyService] Setting properties signal with', properties.length, 'properties');
        
        // Log all property IDs for debugging
        const allIds = properties.map(p => p.id);
        console.log('[PropertyService] Available property IDs (first 20):', allIds.slice(0, 20));
        console.log('[PropertyService] Property ID range:', {
          min: Math.min(...allIds),
          max: Math.max(...allIds),
          total: allIds.length
        });
        
        // Check for specific property ID 2834
        const property2834 = properties.find(p => p.id === 2834);
        if (property2834) {
          console.log('[PropertyService] ✅ Property 2834 found in loaded data:', {
            id: property2834.id,
            title: property2834.title,
            source: property2834.source
          });
        } else {
          console.warn('[PropertyService] ❌ Property 2834 NOT found in loaded data');
        }
        
        this.allPropertiesSignal.set(properties);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('[PropertyService] Subscription error:', err);
        this.loadingSignal.set(false);
      }
    });
  }
  
  getPropertyById(id: number): Property | undefined {
    const allProps = this.allPropertiesSignal();
    console.log('[PropertyService] getPropertyById called with id:', id);
    console.log('[PropertyService] Current properties in signal:', allProps.length);
    
    if (allProps.length === 0) {
      console.warn('[PropertyService] ⚠️ No properties loaded yet. Properties might still be loading.');
      return undefined;
    }
    
    const found = allProps.find(p => p.id === id);
    
    if (found) {
      console.log('[PropertyService] ✅ Property found:', { 
        id: found.id, 
        title: found.title, 
        source: found.source,
        hasAllImages: !!(found.allImages),
        imagesCount: found.allImages?.length || 1
      });
    } else {
      console.warn('[PropertyService] ❌ Property with id', id, 'not found');
      // Show some nearby IDs for debugging
      const nearbyIds = allProps.filter(p => Math.abs(p.id - id) < 10).map(p => p.id);
      if (nearbyIds.length > 0) {
        console.log('[PropertyService] Nearby IDs:', nearbyIds);
      }
    }
    
    return found;
  }
  
  getPropertiesByType(type: string, page: number = 1): Property[] {
    let properties: Property[] = [];
    switch (type) {
      case 'flats': properties = this.flats(); break;
      case 'houses': properties = this.houses(); break;
      case 'plots': properties = this.plots(); break;
      case 'commercial': properties = this.commercial(); break;
      case 'luxury': properties = this.luxury(); break;
      default: properties = [];
    }
    const start = (page - 1) * this.config.itemsPerPage;
    return properties.slice(start, start + this.config.itemsPerPage);
  }
  
  getTotalPagesByType(type: string): number {
    let count = 0;
    switch (type) {
      case 'flats': count = this.flats().length; break;
      case 'houses': count = this.houses().length; break;
      case 'plots': count = this.plots().length; break;
      case 'commercial': count = this.commercial().length; break;
      case 'luxury': count = this.luxury().length; break;
    }
    return Math.ceil(count / this.config.itemsPerPage);
  }
  
  getConfig(): SiteConfig {
    return { ...this.config };
  }
  
  filterProperties(properties: Property[], filters: FilterOptions): Property[] {
    return properties.filter((prop: Property) => {
      if (filters.type && prop.type !== filters.type && !(filters.type === 'luxury' && prop.source === 'luxury')) return false;
      if (filters.minPrice && (prop.priceRaw ?? 0) < filters.minPrice) return false;
      if (filters.maxPrice && (prop.priceRaw ?? Infinity) > filters.maxPrice) return false;
      if (filters.location && prop.location && !prop.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.minSize && (prop.size ?? 0) < filters.minSize) return false;
      if (filters.bedrooms && (prop.bedrooms ?? 0) < filters.bedrooms) return false;
      return true;
    });
  }
  
  refresh(): void {
    console.log('[PropertyService] Manual refresh called');
    this.loadProperties();
  }
}