import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../languages/language.service';
import { FooterComponent } from '../layouts/footer/footer.component';
import { HeaderComponent } from '../layouts/header/header.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, TranslateModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  searchTerm = '';
  isRecordingMatch = false;
  isModalOpen = false;
  private searchSubscription?: Subscription;

  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  packages: { title: string; description: string; price: string }[] = [
    {
      title: 'services.recording.packages.track_recording.title',
      description: 'services.recording.packages.track_recording.description',
      price: 'services.recording.packages.track_recording.price',
    },
  ];

  images: { src: string; alt: string }[] = [
    { src: '/img/digital-audio.webp', alt: 'services.recording.title' },
    { src: '/img/DAstudio.webp', alt: 'services.mastering.title' },
    {
      src: '/img/Dolby-Atmos-renderer.webp',
      alt: 'services.sound_effects.title',
    },
    {
      src: '/img/shadow-of-tomb.webp',
      alt: 'services.video_game_effects.title',
    },
  ];

  constructor() {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.languageService.currentLang$.subscribe((lang) => {
      this.translate.use(lang);
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  private isRecordingSearch(term: string): boolean {
    const lowerTerm = term.toLowerCase();
    return (
      lowerTerm.includes('recording') ||
      lowerTerm.includes('запись') ||
      lowerTerm.includes('запис')
    );
  }
}
