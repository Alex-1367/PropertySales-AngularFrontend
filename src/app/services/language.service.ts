// src/app/services/language.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';

export type Language = 'en' | 'ru';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private currentLangSignal = signal<Language>('en');
  
  currentLanguage = this.currentLangSignal.asReadonly();
  isEnglish = computed(() => this.currentLanguage() === 'en');
  isRussian = computed(() => this.currentLanguage() === 'ru');
  
  constructor() {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ru')) {
      this.currentLangSignal.set(savedLang);
    }
  }
  
  setLanguage(lang: Language): void {
    this.currentLangSignal.set(lang);
    localStorage.setItem('language', lang);
    // Dispatch event for components to react if needed
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
  }
  
  toggleLanguage(): void {
    this.setLanguage(this.isEnglish() ? 'ru' : 'en');
  }
  
  getCurrentLanguage(): Language {
    return this.currentLangSignal();
  }
}