// src/app/pages/property-list-page/property-list-page.component.ts
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { PropertyCardComponent } from '../../components/property-card/property-card.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FilterOptions } from '../../models/property.model';
import { ContentService } from '../../services/content.service';

const propertyLabels: Record<string, string> = {
  'flats': 'Apartments',
  'houses': 'Houses & Villas',
  'plots': 'Land & Plots',
  'commercial': 'Commercial Property',
  'luxury': 'Luxury Properties'
};

const propertyColors: Record<string, string> = {
  'flats': '#3498db',
  'houses': '#2ecc71',
  'plots': '#f39c12',
  'commercial': '#9b59b6',
  'luxury': '#e91e63'
};

const propertyIcons: Record<string, string> = {
  'flats': '🏢',
  'houses': '🏠',
  'plots': '🌳',
  'commercial': '💼',
  'luxury': '💎'
};

@Component({
  selector: 'app-property-list-page',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent, FilterBarComponent, PaginationComponent, HeaderComponent, FooterComponent],
  templateUrl: './property-list-page.component.html',
  styleUrls: ['./property-list-page.component.css']
})
export class PropertyListPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  propertyService = inject(PropertyService);
  contentService = inject(ContentService); 
  
  propertyType = '';
  currentFilters = signal<FilterOptions>({ 
    type: '', 
    minPrice: null, 
    maxPrice: null, 
    location: '', 
    minSize: null, 
    bedrooms: null 
  });
  currentPage = signal<number>(1);
  
  title = computed(() => propertyLabels[this.propertyType] || 'Properties');
  color = computed(() => propertyColors[this.propertyType] || '#3498db');
  icon = computed(() => propertyIcons[this.propertyType] || '🏠');
  
  filteredProperties = computed(() => {
    const allProperties = this.getPropertiesByType(this.propertyType);
    return this.propertyService.filterProperties(allProperties, this.currentFilters());
  });
  
  totalPages = computed(() => {
    const total = this.filteredProperties().length;
    const itemsPerPage = this.propertyService.getConfig().itemsPerPage;
    return Math.ceil(total / itemsPerPage);
  });
  
  paginatedProperties = computed(() => {
    const start = (this.currentPage() - 1) * this.propertyService.getConfig().itemsPerPage;
    return this.filteredProperties().slice(start, start + this.propertyService.getConfig().itemsPerPage);
  });
  
  totalCount = computed(() => this.filteredProperties().length);
  startRange = computed(() => {
    if (this.totalCount() === 0) return 0;
    return (this.currentPage() - 1) * this.propertyService.getConfig().itemsPerPage + 1;
  });
  endRange = computed(() => {
    return Math.min(this.currentPage() * this.propertyService.getConfig().itemsPerPage, this.totalCount());
  });
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.propertyType = params['type'];
      this.currentPage.set(1);
      this.currentFilters.update(f => ({ ...f, type: this.propertyType }));
    });
  }
  
  private getPropertiesByType(type: string): any[] {
    switch (type) {
      case 'flats': return this.propertyService.flats();
      case 'houses': return this.propertyService.houses();
      case 'plots': return this.propertyService.plots();
      case 'commercial': return this.propertyService.commercial();
      case 'luxury': return this.propertyService.luxury();
      default: return [];
    }
  }
  
  onFiltersChange(filters: FilterOptions): void {
    this.currentFilters.set(filters);
    this.currentPage.set(1);
  }
  
  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  hasActiveFilters(): boolean {
    const filters = this.currentFilters();
    return !!(filters.minPrice || filters.maxPrice || filters.location || filters.minSize || filters.bedrooms);
  }
  
  resetFilters(): void {
    this.currentFilters.set({
      type: this.propertyType,
      minPrice: null,
      maxPrice: null,
      location: '',
      minSize: null,
      bedrooms: null
    });
    this.currentPage.set(1);
  }
}