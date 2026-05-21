// src/app/components/filter-bar/filter-bar.component.ts
import { Component, output, Input, OnInit, OnChanges, SimpleChanges,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterOptions } from '../../models/property.model';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnInit, OnChanges {
  @Input() fixedType: string | null = null;
  @Input() showAllTypes: boolean = true;
  filtersChange = output<FilterOptions>();
  contentService = inject(ContentService); 
  
  propertyTypes = [
    { value: 'flats', label: 'Apartments' },
    { value: 'houses', label: 'Houses & Villas' },
    { value: 'plots', label: 'Land & Plots' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'luxury', label: 'Luxury Properties' }
  ];
  
  filters: FilterOptions = {
    type: '',
    minPrice: null,
    maxPrice: null,
    location: '',
    minSize: null,
    bedrooms: null
  };
  
  ngOnInit(): void {
    this.initializeFilters();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fixedType']) {
      this.initializeFilters();
    }
  }
  
  private initializeFilters(): void {
    this.filters = {
      type: this.fixedType || '',
      minPrice: null,
      maxPrice: null,
      location: '',
      minSize: null,
      bedrooms: null
    };
    this.applyFilters();
  }
  
  getVisiblePropertyTypes(): { value: string; label: string }[] {
    if (!this.showAllTypes && this.fixedType) {
      const found = this.propertyTypes.find(t => t.value === this.fixedType);
      return found ? [found] : [];
    }
    return this.propertyTypes;
  }
  
  applyFilters(): void {
    // If type is fixed, override the filter
    if (this.fixedType) {
      this.filters.type = this.fixedType;
    }
    this.filtersChange.emit({ ...this.filters });
  }
  
  resetFilters(): void {
    this.filters = {
      type: this.fixedType || '',
      minPrice: null,
      maxPrice: null,
      location: '',
      minSize: null,
      bedrooms: null
    };
    this.applyFilters();
  }
  
  isTypeDisabled(typeValue: string): boolean {
    return this.fixedType !== null && this.fixedType !== typeValue;
  }
}