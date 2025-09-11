import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../languages/language.service';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent {
  @ViewChildren('accordionContent')
  accordionContents!: QueryList<ElementRef>;
  activeIndex: number | null = null;

  private cdr = inject(ChangeDetectorRef);
  private languageService = inject(LanguageService);

  constructor() {
    this.languageService.currentLang$.subscribe(() => {
      if (this.activeIndex !== null) {
        setTimeout(() => {
          const activeIndex = this.activeIndex;
          if (activeIndex !== null) {
            const content = this.accordionContents.toArray()[activeIndex]
              ?.nativeElement as HTMLElement;
            if (content) {
              content.style.setProperty(
                '--content-height',
                `${content.scrollHeight}px`
              );
              this.cdr.detectChanges();
            }
          }
        }, 0);
      }
    });
  }

  toggleAccordion(index: number): void {
    const isSameIndex = this.activeIndex === index;
    this.activeIndex = isSameIndex ? null : index;

    this.accordionContents.forEach((content: ElementRef, i: number) => {
      const element = content.nativeElement as HTMLElement;
      element.style.setProperty(
        '--content-height',
        i === this.activeIndex ? `${element.scrollHeight}px` : '0px'
      );
    });
    this.cdr.detectChanges();
  }
}
