import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionComponent } from '../accordion/accordion.component';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    AccordionComponent,
    CarouselComponent,
    TranslateModule,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {}
