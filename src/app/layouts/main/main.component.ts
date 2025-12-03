import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AccordionComponent } from '@app/layouts/accordion/accordion.component';
import { CarouselComponent } from '@app/layouts/carousel/carousel.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-main',
    imports: [
        CommonModule,
        AccordionComponent,
        CarouselComponent,
        TranslateModule,
    ],
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {}
