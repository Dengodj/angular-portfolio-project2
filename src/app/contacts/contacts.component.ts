import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../languages/language.service';
import { FooterComponent } from '../layouts/footer/footer.component';
import { HeaderComponent } from '../layouts/header/header.component';
import { HeaderService } from '../layouts/header/header.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit, OnDestroy {
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private fb = inject(FormBuilder);
  private headerService = inject(HeaderService);
  private languageSubscription?: Subscription;

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  isSubmitted = false;
  submitMessage = '';

  constructor() {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.headerService.setSearchHidden(true); // Hide search bar
    this.languageSubscription = this.languageService.currentLang$.subscribe(
      (lang) => {
        this.translate.use(lang);
      }
    );
  }

  ngOnDestroy(): void {
    this.headerService.setSearchHidden(false); // Restore search bar
    this.languageSubscription?.unsubscribe();
  }

  onInputChange(fieldName: string, event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    const control = this.contactForm.get(fieldName);
    if (input.value.trim() === '' && control) {
      control.markAsUntouched();
      control.markAsPristine();
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Contact form submitted:', this.contactForm.value);
      this.isSubmitted = true;
      this.submitMessage = 'contacts.submitSuccess';
      this.contactForm.reset();
      Object.keys(this.contactForm.controls).forEach((key) => {
        const control = this.contactForm.get(key);
        control?.markAsUntouched();
        control?.markAsPristine();
      });
    } else {
      this.submitMessage = 'contacts.submitError';
      Object.keys(this.contactForm.controls).forEach((key) => {
        const control = this.contactForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }
}
