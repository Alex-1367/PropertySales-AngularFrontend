// property-details-page.component.ts
import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Property } from '../../models/property.model';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-property-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './property-details-page.component.html',
  styleUrls: ['./property-details-page.component.css']
})
export class PropertyDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyService);
  contentService = inject(ContentService); 

  property = signal<Property | undefined>(undefined);
  currentImage = signal<string>('');
  showLightbox = signal<boolean>(false);
  lightboxIndex = signal<number>(0);
  config = this.propertyService.getConfig();
  
  // Add loading signal
  isLoading = this.propertyService.isLoading;
  
  // Store current ID to reload when properties change
  private currentId = signal<number | null>(null);

  constructor() {
    // Use effect to watch for when properties finish loading
    effect(() => {
      // Check if loading is false and we have a current ID
      if (!this.isLoading() && this.currentId() !== null) {
        console.log('[PropertyDetails] Loading completed, re-fetching property for id:', this.currentId());
        this.loadPropertyById(this.currentId()!);
      }
    });
  }

  ngOnInit(): void {
    console.log('[PropertyDetails] Component initialized');
    
    this.route.params.subscribe(params => {
      const id = parseInt(params['id']);
      console.log('[PropertyDetails] Route param id:', id, 'type:', typeof id);
      
      // Store current ID for effect to use
      this.currentId.set(id);
      
      // Try to load property immediately (may return undefined if not loaded yet)
      this.loadPropertyById(id);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.showLightbox.set(false);
    });
  }

  private loadPropertyById(id: number): void {
    const prop = this.propertyService.getPropertyById(id);
    this.property.set(prop);
    
    if (prop) {
      console.log('[PropertyDetails] ✅ Property loaded successfully:', prop.id, prop.title);
      
      const images = this.getAllImages();
      if (images.length > 0) {
        this.currentImage.set(images[0]);
        console.log('[PropertyDetails] Images loaded:', images.length);
      } else if (prop.mainImage) {
        this.currentImage.set(prop.mainImage);
        console.log('[PropertyDetails] Using mainImage only');
      }
    } else if (!this.isLoading()) {
      // Only log as not found if not still loading
      console.warn('[PropertyDetails] ❌ Property not found for id:', id);
    } else {
      console.log('[PropertyDetails] Property still loading, will retry when loading completes');
    }
  }

  getAllImages(): string[] {
    const prop = this.property();
    if (!prop) return [];

    console.log('[PropertyDetails] getAllImages - source:', prop.source);
    console.log('[PropertyDetails] getAllImages - allImages exists?', !!prop.allImages);
    console.log('[PropertyDetails] getAllImages - allImages length:', prop.allImages?.length);
    console.log('[PropertyDetails] getAllImages - mainImage:', prop.mainImage?.substring(0, 50));

    if (prop.allImages && Array.isArray(prop.allImages) && prop.allImages.length > 0) {
      console.log('[PropertyDetails] Using allImages array with', prop.allImages.length, 'images');
      return prop.allImages;
    }

    if (prop.mainImage) {
      console.log('[PropertyDetails] Using only mainImage');
      return [prop.mainImage];
    }

    console.log('[PropertyDetails] No images available');
    return [];
  }

  allImages(): string[] {
    return this.getAllImages();
  }

  hasMultipleImages(): boolean {
    return this.getAllImages().length > 1;
  }

  formatPrice(price: string | null): string {
    if (!price) return 'Price on request';
    return price;
  }

  formatFeature(feature: string): string {
    const featureMap: Record<string, string> = {
      seaView: 'Sea View',
      mountainView: 'Mountain View',
      pool: 'Swimming Pool',
      garden: 'Garden',
      gym: 'Fitness Center',
      sauna: 'Sauna',
      smartHome: 'Smart Home',
      underfloorHeating: 'Underfloor Heating',
      gatedCommunity: 'Gated Community',
      privateBeach: 'Private Beach',
      rooftopTerrace: 'Rooftop Terrace',
      barbequeArea: 'BBQ Area',
      stoneWalls: 'Stone Walls'
    };
    return featureMap[feature] || feature;
  }

  // Helper to get property type display name
  getPropertyTypeDisplay(): string {
    const prop = this.property();
    if (!prop) return '';
    
    const typeMap: Record<string, string> = {
      flats: 'Apartment',
      houses: 'House/Villa',
      plots: 'Land/Plot',
      commercial: 'Commercial',
      apartment: 'Apartment',
      penthouse: 'Penthouse',
      townhouse: 'Townhouse',
      villa: 'Villa'
    };
    
    return typeMap[prop.type] || prop.type || 'Property';
  }

  // Helper to get full location string
  getFullLocation(): string {
    const prop = this.property();
    if (!prop) return 'Montenegro';
    
    const parts = [];
    if (prop.location && prop.location !== prop.city) parts.push(prop.location);
    if (prop.city && prop.city !== prop.location) parts.push(prop.city);
    if (prop.region && prop.region !== prop.city && prop.region !== prop.location) parts.push(prop.region);
    
    return parts.length > 0 ? parts.join(', ') : 'Montenegro';
  }

  getWhatsappLink(): string {
    const prop = this.property();
    const message = encodeURIComponent(`Hello! I'm interested in property: ${prop?.title} (ID: ${prop?.id})`);
    return `${this.config.whatsappChannel}?text=${message}`;
  }

  getTelegramLink(): string {
    const prop = this.property();
    const message = encodeURIComponent(`Hello! I'm interested in property: ${prop?.title} (ID: ${prop?.id})`);
    return `${this.config.telegramChannel}?text=${message}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.log('[PropertyDetails] Image failed to load:', img.src);
    img.src = 'https://via.placeholder.com/800x600?text=No+Image';
  }

  nextImage(): void {
    const images = this.getAllImages();
    const currentIndex = images.indexOf(this.currentImage());
    console.log('[PropertyDetails] nextImage - current index:', currentIndex, 'total images:', images.length);
    if (currentIndex < images.length - 1) {
      this.currentImage.set(images[currentIndex + 1]);
      console.log('[PropertyDetails] nextImage - new image:', this.currentImage());
    } else if (currentIndex === -1 && images.length > 0) {
      // If current image not found in array, start from first
      this.currentImage.set(images[0]);
      console.log('[PropertyDetails] nextImage - current not found, starting from first');
    }
  }

  prevImage(): void {
    const images = this.getAllImages();
    const currentIndex = images.indexOf(this.currentImage());
    console.log('[PropertyDetails] prevImage - current index:', currentIndex, 'total images:', images.length);
    if (currentIndex > 0) {
      this.currentImage.set(images[currentIndex - 1]);
      console.log('[PropertyDetails] prevImage - new image:', this.currentImage());
    } else if (currentIndex === -1 && images.length > 0) {
      // If current image not found in array, start from last
      this.currentImage.set(images[images.length - 1]);
      console.log('[PropertyDetails] prevImage - current not found, starting from last');
    }
  }

  openLightbox(index: number): void {
    console.log('[PropertyDetails] openLightbox - index:', index);
    this.lightboxIndex.set(index);
    this.showLightbox.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.showLightbox.set(false);
    document.body.style.overflow = '';
  }

  nextLightboxImage(): void {
    const images = this.getAllImages();
    if (this.lightboxIndex() < images.length - 1) {
      this.lightboxIndex.set(this.lightboxIndex() + 1);
      console.log('[PropertyDetails] nextLightboxImage - new index:', this.lightboxIndex());
    }
  }

  prevLightboxImage(): void {
    if (this.lightboxIndex() > 0) {
      this.lightboxIndex.set(this.lightboxIndex() - 1);
      console.log('[PropertyDetails] prevLightboxImage - new index:', this.lightboxIndex());
    }
  }
}