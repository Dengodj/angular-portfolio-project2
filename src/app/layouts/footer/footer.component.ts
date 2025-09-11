import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit, OnDestroy {
  backgroundStyle: Record<string, string> = {
    'background-image': 'url(/assets/img/studio-mixer.webp)',
  };
  private destroy$ = new Subject<void>();

  private router = inject(Router);

  ngOnInit(): void {
    this.updateBackgroundStyle(this.router.url);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        console.log('Current URL:', url);
        this.updateBackgroundStyle(url);
      });
  }

  private updateBackgroundStyle(url: string): void {
    console.log('Updating background for URL:', url);
    this.backgroundStyle = {
      'background-image':
        url === '/' || url.includes('/home')
          ? 'url(/assets/img/music-controller.webp)'
          : url.includes('/about')
          ? 'url(/assets/img/AtmosMixingRoom.webp)'
          : url.includes('/contacts')
          ? 'url(/assets/img/ptstudio.webp)'
          : url.includes('/services')
          ? 'url(/assets/img/keyboard.webp)'
          : url.includes('/form')
          ? 'url(/assets/img/synthesizer.webp)'
          : 'url(/assets/img/studio-mixer.webp)',
    };

    console.log('Applied Background Style:', this.backgroundStyle);
  }

  scrollToTop(): void {
    const header = document.querySelector('#header');
    if (header) {
      header.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const topButton = document.querySelector('.top');
    if (topButton) {
      if (window.scrollY > 100) {
        topButton.classList.add('top--visible');
      } else {
        topButton.classList.remove('top--visible');
      }
    }
  }
}
