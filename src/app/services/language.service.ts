import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>('es');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translateService: TranslateService) {
    // Cargar el idioma desde el localStorage
    const savedLang = localStorage.getItem('language');
    const initialLang = savedLang || 'es'; // Por defecto 'es' si no hay nada en localStorage
    this.currentLangSubject = new BehaviorSubject<string>(initialLang);
    this.translateService.use(initialLang);
  }

  // Cambiar el idioma
  changeLanguage(lang: string) {
    this.translateService.use(lang);
    this.currentLangSubject.next(lang); // Emitir el nuevo idioma
    localStorage.setItem('language', lang); // Guardar el idioma en localStorage
  }
}