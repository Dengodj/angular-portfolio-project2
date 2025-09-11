import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent {
  @ViewChild('carouselSlides', { static: false }) carouselSlides?: ElementRef;

  slides = [
    { imageUrl: '/assets/img/headphones.webp', loaded: false, error: false },
    { imageUrl: '/assets/img/NUAGE.webp', loaded: false, error: false },
    {
      imageUrl: '/assets/img/music-controller.webp',
      loaded: false,
      error: false,
    },
    { imageUrl: '/assets/img/nuage-console.webp', loaded: false, error: false },
    { imageUrl: '/assets/img/mic.webp', loaded: false, error: false },
    { imageUrl: '/assets/img/digital-audio.webp', loaded: false, error: false },
    { imageUrl: '/assets/img/faders.webp', loaded: false, error: false },
    { imageUrl: '/assets/img/keyboard.webp', loaded: false, error: false },
    { imageUrl: '/assets/img/ptstudio.webp', loaded: false, error: false },
    { imageUrl: '/assets/img/synthesizer.webp', loaded: false, error: false },
  ];
  activeSlideIndex = 0;

  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.preloadImages();
  }

  preloadImages() {
    this.slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.imageUrl;
      img.onload = () => {
        slide.loaded = true;
        this.cdr.markForCheck();
      };
      img.onerror = () => {
        slide.error = true;
        this.cdr.markForCheck();
      };
    });
  }

  prevSlide() {
    if (this.activeSlideIndex === 0) {
      this.disableTransition();
      this.activeSlideIndex = this.slides.length - 1;
      setTimeout(() => {
        this.enableTransition();
        this.cdr.markForCheck();
      }, 50);
    } else {
      this.activeSlideIndex--;
      this.cdr.markForCheck();
    }
  }

  nextSlide() {
    if (this.activeSlideIndex === this.slides.length - 1) {
      this.disableTransition();
      this.activeSlideIndex = 0;
      setTimeout(() => {
        this.enableTransition();
        this.cdr.markForCheck();
      }, 50);
    } else {
      this.activeSlideIndex++;
      this.cdr.markForCheck();
    }
  }

  goToSlide(index: number) {
    this.activeSlideIndex = index;
    this.cdr.markForCheck();
  }

  private disableTransition() {
    if (this.carouselSlides?.nativeElement) {
      this.carouselSlides.nativeElement.classList.add('no-transition');
    }
  }

  private enableTransition() {
    if (this.carouselSlides?.nativeElement) {
      this.carouselSlides.nativeElement.classList.remove('no-transition');
    }
  }
}
