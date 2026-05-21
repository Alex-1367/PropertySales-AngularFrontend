// src/app/pages/property-details-page/property-details-page.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = parseInt(params['id']);
      const prop = this.propertyService.getPropertyById(id);
      this.property.set(prop);
      if (prop?.mainImage) {
        this.currentImage.set(prop.mainImage);
      }
      // Scroll to top when property changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Close lightbox when changing properties
      this.showLightbox.set(false);
    });
  }

  allImages(): string[] {
    const prop = this.property();
    if (!prop) return [];

    // If there are allImages, use them
    if (prop.allImages && prop.allImages.length > 0) {
      return prop.allImages;
    }

    // Otherwise, try to use mainImage
    if (prop.mainImage) {
      return [prop.mainImage];
    }

    return [];
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
    img.src = 'https://via.placeholder.com/800x600?text=No+Image';
  }

  nextImage(): void {
    const images = this.allImages();
    const currentIndex = images.indexOf(this.currentImage());
    if (currentIndex < images.length - 1) {
      this.currentImage.set(images[currentIndex + 1]);
    }
  }

  prevImage(): void {
    const images = this.allImages();
    const currentIndex = images.indexOf(this.currentImage());
    if (currentIndex > 0) {
      this.currentImage.set(images[currentIndex - 1]);
    }
  }

  openLightbox(index: number): void {
    this.lightboxIndex.set(index);
    this.showLightbox.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.showLightbox.set(false);
    document.body.style.overflow = '';
  }

  nextLightboxImage(): void {
    const images = this.allImages();
    if (this.lightboxIndex() < images.length - 1) {
      this.lightboxIndex.set(this.lightboxIndex() + 1);
    }
  }

  prevLightboxImage(): void {
    if (this.lightboxIndex() > 0) {
      this.lightboxIndex.set(this.lightboxIndex() - 1);
    }
  }
}