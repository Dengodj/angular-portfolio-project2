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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { LanguageService } from '../languages/language.service';
import { FooterComponent } from '../layouts/footer/footer.component';
import { HeaderComponent } from '../layouts/header/header.component';
import { HeaderService } from '../layouts/header/header.service'; // Updated path

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
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
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private fb = inject(FormBuilder);
  private headerService = inject(HeaderService);
  private languageSubscription?: Subscription;

  registrationForm = this.fb.group(
    {
      username: [
        '',
        [Validators.required, Validators.minLength(3)],
        [this.usernameAvailabilityValidator.bind(this)],
      ],
      phone: ['', [Validators.required, Validators.minLength(10)]],
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
    { validators: this.passwordMatchValidator }
  );

  isSubmitted = false;
  submitMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.headerService.setSearchHidden(true);
    this.languageSubscription = this.languageService.currentLang$.subscribe(
      (lang) => {
        this.translate.use(lang);
      }
    );
  }

  ngOnDestroy(): void {
    this.headerService.setSearchHidden(false);
    this.languageSubscription?.unsubscribe();
  }

  private checkUsernameAvailability(username: string): Observable<boolean> {
    const takenUsernames = ['admin', 'user1', 'test', 'gdstudio'];
    const isAvailable = !takenUsernames.includes(username.toLowerCase());
    return of(isAvailable).pipe(delay(500));
  }

  usernameAvailabilityValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return this.checkUsernameAvailability(control.value).pipe(
      map((isAvailable) => (isAvailable ? null : { usernameTaken: true }))
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
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
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Registration submitted:', this.registrationForm.value);
      this.isSubmitted = true;
      this.submitMessage = 'registration.submitSuccess';
      this.registrationForm.reset();
      Object.keys(this.registrationForm.controls).forEach((key) => {
        const control = this.registrationForm.get(key);
        control?.markAsUntouched();
        control?.markAsPristine();
      });
    } else {
      this.submitMessage = 'registration.submitError';
      Object.keys(this.registrationForm.controls).forEach((key) => {
        const control = this.registrationForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
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
