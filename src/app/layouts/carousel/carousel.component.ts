import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent {
  @ViewChild('carouselSlides', { static: false }) carouselSlides!: ElementRef;

  slides = [
    { imageUrl: '/img/headphones.webp' },
    { imageUrl: '/img/NUAGE.webp' },
    { imageUrl: '/img/music-controller.webp' },
    { imageUrl: '/img/nuage.jpg' },
    { imageUrl: '/img/mic.jpg' },
    { imageUrl: '/img/digital-audio.webp' },
    { imageUrl: '/img/faders.webp' },
    { imageUrl: '/img/keyboard.webp' },
    { imageUrl: '/img/ptstudio.webp' },
    { imageUrl: '/img/synthesizer.webp' },
  ];
  activeSlideIndex = 0;

  prevSlide() {
    if (this.activeSlideIndex === 0) {
      this.disableTransition();
      this.activeSlideIndex = this.slides.length - 1;
      setTimeout(() => this.enableTransition(), 0);
    } else {
      this.activeSlideIndex--;
    }
  }

  nextSlide() {
    if (this.activeSlideIndex === this.slides.length - 1) {
      this.disableTransition();
      this.activeSlideIndex = 0;
      setTimeout(() => this.enableTransition(), 0);
    } else {
      this.activeSlideIndex++;
    }
  }

  goToSlide(index: number) {
    this.activeSlideIndex = index;
  }

  private disableTransition() {
    if (this.carouselSlides) {
      this.carouselSlides.nativeElement.classList.add('no-transition');
    }
  }

  private enableTransition() {
    if (this.carouselSlides) {
      this.carouselSlides.nativeElement.classList.remove('no-transition');
    }
  }
}
