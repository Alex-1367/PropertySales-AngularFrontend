// src/app/services/content.service.ts
import { Injectable, inject, computed } from '@angular/core';
import { LanguageService } from './language.service';

export interface PageContent {
  aboutExperience: string;
  aboutTitle: string;
  aboutUs: string;
  aboutWelcome: string;
  allRightsReserved: string;
  allShownText: string;
  apartments: string;
  areaLabel: string;
  backToHome: string;
  backToProperties: string;
  bathroomsLabel: string;
  bathroomsText: string;
  bedroomsLabel: string;
  bedroomsText: string;
  callText: string;
  chatTelegram: string;
  chatWhatsapp: string;
  clearFiltersText: string;
  commercial: string;
  contact: string;
  contactInfo: string;
  contactManager: string;
  description: string;
  distanceToSeaLabell: string;
  featuresAmenities: string;
  floorLabel: string;
  footerTagline: string;
  heroSubtitle: string;
  heroTitle: string;
  home: string;
  houses: string;
  interestedText: string;
  land: string;
  loadingText: string;
  locationLabel: string;
  luxury: string;
  manager: string;
  moreDetails: string;
  noPropertiesFound: string;
  noResultsText: string;
  ofText: string;
  phone: string;
  priceLabel: string;
  priceOnRequest: string;
  propertiesAvailable: string;
  propertiesText: string;
  propertyManager: string;
  propertyNotFound: string;
  propertyNotFoundDesc: string;
  quickLinks: string;
  resetAllFilters: string;
  resetFiltersText: string;
  showingText: string;
  telegramText: string;
  toSeaText: string;
  tryAdjustingFilters: string;
  viewAllText: string;
  whatsappText: string;
  whyChooseItems: string[];
  whyChooseUs: string;
  allTypesText: string;
  previousText: string;
  nextText: string;
}

const enContent: PageContent = {
  aboutExperience: 'With years of experience in the Montenegrin real estate market, we offer a wide selection of apartments, houses, land plots, and commercial properties in the most desirable locations.',
  aboutTitle: 'About',
  aboutUs: 'About Us',
  aboutWelcome: 'Welcome to {companyName}, your trusted partner in Montenegro real estate. We specialize in helping clients find their dream properties along the beautiful Adriatic coast.',
  allRightsReserved: 'All rights reserved.',
  allShownText: 'All properties shown',
  apartments: 'Apartments',
  areaLabel: 'Area',
  backToHome: 'Back to Home',
  backToProperties: '← Back to properties',
  bathroomsLabel: 'Bathrooms',
  bathroomsText: 'bathrooms',
  bedroomsLabel: 'Bedrooms',
  bedroomsText: 'bedrooms',
  callText: 'Call',
  chatTelegram: 'Chat on Telegram',
  chatWhatsapp: 'Chat on WhatsApp',
  clearFiltersText: 'Clear Filters',
  commercial: 'Commercial',
  contact: 'Contact',
  contactInfo: 'Contact Information',
  contactManager: 'Contact our manager for more information',
  description: 'Description',
  distanceToSeaLabell: 'Distance to Sea',
  featuresAmenities: 'Features & Amenities',
  floorLabel: 'Floor',
  footerTagline: 'Your trusted real estate partner in Montenegro',
  heroSubtitle: 'Discover the best real estate offers on the Adriatic coast',
  heroTitle: 'Find Your Dream Property in Montenegro',
  home: 'Home',
  houses: 'Houses',
  interestedText: 'Interested in this property?',
  land: 'Land',
  loadingText: 'Loading properties...',
  locationLabel: 'Location',
  luxury: 'Luxury',
  manager: 'Manager',
  moreDetails: 'More Details →',
  noPropertiesFound: 'No properties found',
  noResultsText: 'No properties found matching your criteria.',
  ofText: 'of',
  phone: 'Phone',
  priceLabel: 'Price',
  priceOnRequest: 'Price on request',
  propertiesAvailable: 'properties available',
  propertiesText: 'properties',
  propertyManager: 'Property Manager',
  propertyNotFound: 'Property not found',
  propertyNotFoundDesc: 'The property you\'re looking for doesn\'t exist or has been removed.',
  quickLinks: 'Quick Links',
  resetAllFilters: 'Reset All Filters',
  resetFiltersText: 'Reset Filters',
  showingText: 'Showing',
   telegramText: 'Telegram',
  toSeaText: 'to sea',
  tryAdjustingFilters: 'Try adjusting your filters to find what you\'re looking for.',
  viewAllText: 'View All',
  whatsappText: 'WhatsApp',
  whyChooseItems: [
    '✓ Extensive portfolio of verified properties',
    '✓ Direct cooperation with developers',
    '✓ Full legal support during purchase',
    '✓ Assistance with residence permit application',
    '✓ After-sales property management services'
  ],
  whyChooseUs: 'Why Choose Us?',
  allTypesText: 'All Types',
  previousText: 'Previous',
  nextText: 'Next',
};

const ruContent: PageContent = {
  aboutExperience: 'Имея многолетний опыт на рынке недвижимости Черногории, мы предлагаем широкий выбор квартир, домов, земельных участков и коммерческих объектов в самых желаемых локациях.',
  aboutTitle: 'О компании',
  aboutUs: 'О нас',
  aboutWelcome: 'Добро пожаловать в {companyName}, вашего надежного партнера в сфере недвижимости Черногории. Мы специализируемся на поиске идеальной недвижимости для наших клиентов на прекрасном Адриатическом побережье.',
  allRightsReserved: 'Все права защищены.',
  allShownText: 'Показаны все объекты',
  apartments: 'Квартиры',
  areaLabel: 'Площадь',
  backToHome: 'На главную',
  backToProperties: '← Назад к объектам',
  bathroomsLabel: 'Ванные',
  bathroomsText: 'ванные',
  bedroomsLabel: 'Спальни',
  bedroomsText: 'спальни',
  callText: 'Позвонить',
  chatTelegram: 'Написать в Telegram',
  chatWhatsapp: 'Написать в WhatsApp',
  clearFiltersText: 'Очистить фильтры',
  commercial: 'Коммерческая',
  contact: 'Контакты',
  contactInfo: 'Контактная информация',
  contactManager: 'Свяжитесь с нашим менеджером для получения информации',
  description: 'Описание',
  distanceToSeaLabell: 'Расстояние до моря',
  featuresAmenities: 'Особенности и удобства',
  floorLabel: 'Этаж',
  footerTagline: 'Ваш надежный партнер в сфере недвижимости Черногории',
  heroSubtitle: 'Откройте лучшие предложения недвижимости на Адриатическом побережье',
  heroTitle: 'Найдите свою идеальную недвижимость в Черногории',
  home: 'Главная',
  houses: 'Дома',
  interestedText: 'Заинтересованы в этом объекте?',
  land: 'Участки',
  loadingText: 'Загрузка объектов...',
  locationLabel: 'Расположение',
  luxury: 'Премиум',
  manager: 'Менеджер',
  moreDetails: 'Подробнее →',
  noPropertiesFound: 'Объекты не найдены',
  noResultsText: 'Объекты не найдены по вашему запросу.',
  ofText: 'из',
  phone: 'Телефон',
  priceLabel: 'Цена',
  priceOnRequest: 'Цена по запросу',
  propertiesAvailable: 'доступно объектов',
  propertiesText: 'объектов',
  propertyManager: 'Менеджер по недвижимости',
  propertyNotFound: 'Объект не найден',
  propertyNotFoundDesc: 'Объект, который вы ищете, не существует или был удален.',
  quickLinks: 'Быстрые ссылки',
  resetAllFilters: 'Сбросить все фильтры',
  resetFiltersText: 'Сбросить фильтры',
  showingText: 'Показано',
  telegramText: 'Telegram',
  toSeaText: 'до моря',
  tryAdjustingFilters: 'Попробуйте изменить параметры фильтрации',
  viewAllText: 'Смотреть все',
  whatsappText: 'WhatsApp',
  whyChooseItems: [
    '✓ Обширный портфель проверенных объектов',
    '✓ Прямое сотрудничество с застройщиками',
    '✓ Полное юридическое сопровождение сделки',
    '✓ Помощь в оформлении ВНЖ',
    '✓ Услуги по управлению недвижимостью'
  ],
  whyChooseUs: 'Почему выбирают нас?',
  allTypesText: 'Все типы',
  previousText: 'Предыдущая',
  nextText: 'Следующая',
};

@Injectable({ providedIn: 'root' })
export class ContentService {
  private languageService = inject(LanguageService);
  
  content = computed(() => {
    return this.languageService.isEnglish() ? enContent : ruContent;
  });
  
  getContent(): PageContent {
    return this.content();
  }
}