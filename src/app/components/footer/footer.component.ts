// src/app/components/footer/footer.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  private propertyService = inject(PropertyService);
  config = this.propertyService.getConfig();
  currentYear = new Date().getFullYear();
  contentService = inject(ContentService); 
}