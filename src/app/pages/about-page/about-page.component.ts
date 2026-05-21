// src/app/pages/about-page/about-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../services/property.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent {
  private propertyService = inject(PropertyService);
  config = this.propertyService.getConfig();
  contentService = inject(ContentService); 
  
  // Manager photo - can be changed via config in the future
  managerPhoto = 'https://randomuser.me/api/portraits/men/32.jpg';
  
  // You can also add a method to update manager photo dynamically
  // updateManagerPhoto(photoUrl: string): void {
  //   this.managerPhoto = photoUrl;
  // }
}