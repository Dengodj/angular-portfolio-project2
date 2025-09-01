import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../languages/language.service';
import { HeaderService } from '../layouts/header/header.service';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private headerService = inject(HeaderService);
  private languageSubscription?: Subscription;

  constructor() {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.headerService.setSearchHidden(true);
    this.languageSubscription = this.languageService.currentLang$.subscribe(
      (lang) => {
        this.translate.use(lang);
      }
    );
  }

  ngOnDestroy(): void {
    this.headerService.setSearchHidden(false);
    this.languageSubscription?.unsubscribe();
  }
}
