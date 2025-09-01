import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>('en');
  currentLang$ = this.currentLangSubject.asObservable();
  private translate = inject(TranslateService);

  constructor() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    this.setLanguage(savedLang);
  }

  setLanguage(lang: string): void {
    if (['en', 'ru', 'uk'].includes(lang)) {
      this.currentLangSubject.next(lang);
      this.translate.use(lang);
      localStorage.setItem('preferredLanguage', lang);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLangSubject.value;
  }
}
