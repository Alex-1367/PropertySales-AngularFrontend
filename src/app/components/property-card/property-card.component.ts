// src/app/components/property-card/property-card.component.ts
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.css']
})
export class PropertyCardComponent {
  private propertyService = inject(PropertyService);
  contentService = inject(ContentService); 
  
  @Input({ required: true }) property!: Property;
  
  formatPrice(price: string | null): string {
    if (!price) return 'Price on request';
    return price;
  }
  
  getWhatsappLink(property: Property): string {
    const config = this.propertyService.getConfig();
    const message = encodeURIComponent(`Hello! I'm interested in property: ${property.title} (ID: ${property.id})`);
    return `${config.whatsappChannel}?text=${message}`;
  }
  
  getTelegramLink(property: Property): string {
    const config = this.propertyService.getConfig();
    const message = encodeURIComponent(`Hello! I'm interested in property: ${property.title} (ID: ${property.id})`);
    return `${config.telegramChannel}?text=${message}`;
  }
  
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x300?text=No+Image';
  }
}