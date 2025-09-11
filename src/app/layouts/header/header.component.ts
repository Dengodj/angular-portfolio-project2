import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { LanguageService } from '../../languages/language.service';
import { SearchComponent } from '../../search/search.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NavBarComponent, TranslateModule, SearchComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private headerService = inject(HeaderService);
  currentLang: 'en' | 'ru' | 'uk' = 'en';
  isSearchHidden = false;
  isNavActive = false;
  searchTerm = '';
  private destroy$ = new Subject<void>();

  constructor() {
    this.currentLang = this.languageService.getCurrentLanguage() as
      | 'en'
      | 'ru'
      | 'uk';
    this.updateSearchHidden(this.router.url);
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateSearchHidden(event.urlAfterRedirects);
      });

    this.languageService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.currentLang = lang as 'en' | 'ru' | 'uk';
      });

    this.headerService.isSearchHidden$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isHidden) => {
        this.isSearchHidden = isHidden;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      this.isNavActive &&
      !target.closest('#navigation') &&
      !target.closest('#hamburger-menu')
    ) {
      this.closeNav();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(): void {
    this.closeNav();
  }

  onSearch(term: string): void {
    if (!term || term.length < 2) return;
    this.searchTerm = term;
    console.log('Search term received in HeaderComponent:', term);
    this.router.navigate(['/services'], { queryParams: { search: term } });
    this.headerService.setSearchHidden(true);
  }

  toggleNav(): void {
    this.isNavActive = !this.isNavActive;
    this.manageFocus();
  }

  closeNav(): void {
    this.isNavActive = false;
    this.manageFocus();
  }

  switchLanguage(lang: 'en' | 'ru' | 'uk'): void {
    this.languageService.setLanguage(lang);
  }

  private updateSearchHidden(url: string): void {
    const baseUrl = url.split('?')[0];
    const hiddenRoutes = [
      '/about',
      '/contacts',
      '/404',
      '/form',
      '/registration',
      '/services',
    ];
    const isHidden = hiddenRoutes.includes(baseUrl);
    this.headerService.setSearchHidden(isHidden);
  }

  private manageFocus(): void {
    if (this.isNavActive) {
      const firstMenuItem = document.querySelector('#navigation a.button');
      if (firstMenuItem instanceof HTMLElement) {
        firstMenuItem.focus();
      }
    } else {
      const hamburger = document.querySelector('#hamburger-menu');
      if (hamburger instanceof HTMLElement) {
        hamburger.focus();
      }
    }
  }
}
