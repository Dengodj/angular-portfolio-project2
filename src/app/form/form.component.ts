import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LanguageService } from '@app/languages/language.service';
import { FooterComponent } from '@app/layouts/footer/footer.component';
import { HeaderComponent } from '@app/layouts/header/header.component';
import { HeaderService } from '@app/layouts/header/header.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit, OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  private readonly headerService = inject(HeaderService);
  private languageSubscription?: Subscription;

  isSubmitted = false;
  detectedCountry = '';
  showPassword = false;
  showConfirmPassword = false;
  submitMessage = '';

  readonly registrationForm = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator },
  );

  constructor() {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.headerService.setSearchHidden(true);
    this.languageSubscription = this.languageService.currentLang$.subscribe(
      (lang) => this.translate.use(lang),
    );
  }

  ngOnDestroy(): void {
    this.headerService.setSearchHidden(false);
    this.languageSubscription?.unsubscribe();
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pass && confirm && pass === confirm ? null : { mismatch: true };
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d+]/g, '');
    if (value.length > 0 && !value.startsWith('+')) value = '+' + value;
    this.detectCountryByCode(value);
    input.value = value;
    this.registrationForm.get('phone')?.setValue(value, { emitEvent: false });
  }

  private detectCountryByCode(phone: string): void {
    const codes: Record<string, string> = {
      '+7': 'Russia/Kazakhstan',
      '+380': 'Ukraine',
      '+375': 'Belarus',
      '+994': 'Azerbaijan',
      '+374': 'Armenia',
      '+995': 'Georgia',
      '+370': 'Lithuania',
      '+371': 'Latvia',
      '+372': 'Estonia',
      '+373': 'Moldova',
      '+44': 'UK',
      '+49': 'Germany',
      '+33': 'France',
      '+48': 'Poland',
      '+1': 'USA/Canada',
      '+971': 'UAE',
      '+90': 'Turkey',
    };
    const sortedCodes = Object.keys(codes).sort((a, b) => b.length - a.length);
    const matched = sortedCodes.find((code) => phone.startsWith(code));
    this.detectedCountry = matched ? codes[matched] : '';
  }

  onInputChange(fieldName: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const control = this.registrationForm.get(fieldName);
    if (input.value.trim() === '' && control) {
      control.markAsUntouched();
      control.markAsPristine();
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.submitMessage = 'registration.submitSuccessTitle';
      this.isSubmitted = true;
      this.registrationForm.reset();
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  get username() {
    return this.registrationForm.get('username');
  }
  get phone() {
    return this.registrationForm.get('phone');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('password');
  }
  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }
}
