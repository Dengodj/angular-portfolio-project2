import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from '@app/layouts/footer/footer.component';
import { HeaderComponent } from '@app/layouts/header/header.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    HeaderComponent,
    FooterComponent,
    RouterLink,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('demoVideo') demoVideo!: ElementRef<HTMLVideoElement>;

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);

  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollAnimations();
    }
  }

  private initScrollAnimations(): void {
    const options: IntersectionObserverInit = {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'is-visible');
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    const animatedElements = this.el.nativeElement.querySelectorAll(
      '.section-about4, .section-about5, .section-about6',
    );

    Array.from(animatedElements).forEach((element) => {
      if (element instanceof HTMLElement) {
        this.observer?.observe(element);
      }
    });
  }

  playVideo(): void {
    const video = this.demoVideo?.nativeElement;
    if (!video) return;

    if (video.readyState < 3) {
      console.warn('Video not ready yet');
      return;
    }

    if (video.paused) {
      video.play().catch((err) => console.warn('Video playback failed:', err));
    } else {
      video.pause();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
