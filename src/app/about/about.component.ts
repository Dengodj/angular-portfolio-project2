import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from '../layouts/footer/footer.component';
import { HeaderComponent } from '../layouts/header/header.component';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  @ViewChild('demoVideo') demoVideo!: ElementRef<HTMLVideoElement>;

  playVideo() {
    const video = this.demoVideo.nativeElement;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
}
