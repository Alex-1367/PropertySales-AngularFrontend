import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { PropertyListPageComponent } from './pages/property-list-page/property-list-page.component';
import { PropertyDetailsPageComponent } from './pages/property-details-page/property-details-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { PropertyType } from './models/property.model';

export const routes: Routes = [
  { path: '', component: MainPageComponent, pathMatch: 'full' },
  { path: 'properties/:type', component: PropertyListPageComponent },
  { path: 'property/:id', component: PropertyDetailsPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: '**', redirectTo: '' }
];

export const propertyTypeLabels: Record<string, string> = {
  'flats': 'Квартиры',
  'houses': 'Дома',
  'plots': 'Участки',
  'commercial': 'Коммерческая',
  'luxury': 'Luxury'
};