// src/app/services/property.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
    this.loadProperties();
  }
  
  private loadProperties(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    this.http.get<ApiResponse>(this.config.apiUrl).pipe(
      map(response => response.properties),
      catchError((err: Error) => {
        console.error('Failed to load properties:', err);
        this.errorSignal.set('Failed to load properties. Please try again later.');
        return of([]);
      })
    ).subscribe((properties: Property[]) => {
      this.allPropertiesSignal.set(properties);
      this.loadingSignal.set(false);
    });
  }
  
  getPropertyById(id: number): Property | undefined {
    return this.allPropertiesSignal().find(p => p.id === id);
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
    this.loadProperties();
  }
}