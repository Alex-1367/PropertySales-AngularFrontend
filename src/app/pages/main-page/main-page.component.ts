// src/app/pages/main-page/main-page.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { PropertyCardComponent } from '../../components/property-card/property-card.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FilterOptions, Property } from '../../models/property.model';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent, FilterBarComponent, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  propertyService = inject(PropertyService);
  config = this.propertyService.getConfig();
  contentService = inject(ContentService);
  currentFilters = signal<FilterOptions>({ 
    type: '', 
    minPrice: null, 
    maxPrice: null, 
    location: '', 
    minSize: null, 
    bedrooms: null 
  });
  
  sectionConfig = [
    { type: 'flats', label: '🏢 Apartments', color: '#3498db', route: '/properties/flats' },
    { type: 'houses', label: '🏠 Houses & Villas', color: '#2ecc71', route: '/properties/houses' },
    { type: 'plots', label: '🌳 Land & Plots', color: '#f39c12', route: '/properties/plots' },
    { type: 'commercial', label: '🏢 Commercial Property', color: '#9b59b6', route: '/properties/commercial' },
    { type: 'luxury', label: '💎 Luxury Properties', color: '#e91e63', route: '/properties/luxury' }
  ];
  
  visibleSections = computed(() => {
    const filters = this.currentFilters();
    const sections = [];
    const featuredCount = this.config.featuredItemsPerType;
    
    for (const config of this.sectionConfig) {
      let properties: Property[] = [];
      
      switch (config.type) {
        case 'flats':
          properties = [...this.propertyService.flats()];
          break;
        case 'houses':
          properties = [...this.propertyService.houses()];
          break;
        case 'plots':
          properties = [...this.propertyService.plots()];
          break;
        case 'commercial':
          properties = [...this.propertyService.commercial()];
          break;
        case 'luxury':
          properties = [...this.propertyService.luxury()];
          break;
      }
      
      const filtered = this.propertyService.filterProperties(properties, filters);
      // Take only the configured number of properties for main page
      const topProperties = filtered.slice(0, featuredCount);
      const totalCount = filtered.length;
      
      if (topProperties.length > 0) {
        sections.push({
          ...config,
          properties: topProperties,
          totalCount: totalCount,
          showViewAll: totalCount > featuredCount
        });
      }
    }
    
    return sections;
  });
  
  onFiltersChange(filters: FilterOptions): void {
    this.currentFilters.set(filters);
    // Scroll to top when filters change for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}