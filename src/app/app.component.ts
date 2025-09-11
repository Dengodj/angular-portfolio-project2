import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './languages/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-portfolio-project2';

  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  ngOnInit(): void {
    this.translate.addLangs(['en', 'ru', 'uk']);
    const browserLang = this.translate.getBrowserLang();
    const defaultLang = browserLang?.match(/en|ru|uk/) ? browserLang : 'en';
    this.translate.setDefaultLang('en');
    this.translate.use(defaultLang);
    this.languageService.setLanguage(defaultLang as 'en' | 'ru' | 'uk');
  }
}
