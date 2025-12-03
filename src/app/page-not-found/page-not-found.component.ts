import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { LanguageService } from '@app/languages/language.service';
import { HeaderService } from '@app/layouts/header/header.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-page-not-found',
    imports: [CommonModule, TranslateModule],
    templateUrl: './page-not-found.component.html',
    styleUrl: './page-not-found.component.scss'
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
