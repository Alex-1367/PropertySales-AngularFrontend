// src/app/components/header/header.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { LanguageService, Language } from '../../services/language.service';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private propertyService = inject(PropertyService);
  languageService = inject(LanguageService);
  config = this.propertyService.getConfig();
  menuOpen = signal(false);
  contentService = inject(ContentService); 
  
  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }
  
  closeMenu(): void {
    this.menuOpen.set(false);
  }
  
  setLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }
}