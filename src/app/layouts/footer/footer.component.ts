import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit, OnDestroy {
  public backgroundStyle: Record<string, string> = {
    'background-image': 'url(assets/img/studio-mixer.webp)',
  };

  private destroy$ = new Subject<void>();
  private router = inject(Router);

  ngOnInit(): void {
    this.updateBackgroundStyle(this.router.url);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event: NavigationEnd) => {
        this.updateBackgroundStyle(event.urlAfterRedirects);
      });
  }

  public navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  private updateBackgroundStyle(url: string): void {
    let bgImage = 'studio-mixer.webp';

    if (url === '/' || url.includes('/home')) bgImage = 'music-controller.webp';
    else if (url.includes('/about')) bgImage = 'AtmosMixingRoom.webp';
    else if (url.includes('/contacts')) bgImage = 'ptstudio.webp';
    else if (url.includes('/services')) bgImage = 'keyboard.webp';
    else if (url.includes('/form')) bgImage = 'synthesizer.webp';

    this.backgroundStyle = {
      'background-image': `url(assets/img/${bgImage})`,
    };
  }

  public scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollOffset =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const topButton = document.querySelector('.top');

    if (topButton) {
      if (scrollOffset > 400) {
        topButton.classList.add('top--visible');
      } else {
        topButton.classList.remove('top--visible');
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
