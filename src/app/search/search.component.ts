import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: string;
  translatedNameKey: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, TranslateModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  searchTerm = '';
  suggestions: Product[] = [];
  showSuggestions = false;
  private products: Product[] = [];

  @Output() searchTermChange = new EventEmitter<string>();

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearchPipeline();
  }

  private loadProducts(): void {
    this.http
      .get<Product[]>('assets/data/products.json')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => (this.products = data),
        error: (err) => console.error('Error loading products:', err),
      });
  }

  private setupSearchPipeline(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.updateSuggestions(term);
      });
  }

  onInputChange(value: string): void {
    const trimmed = value.trim();
    this.searchTerm = trimmed;
    this.showSuggestions = trimmed.length >= 2;
    this.searchSubject.next(trimmed);
  }

  onSearch(): void {
    if (this.searchTerm.length < 2) return;
    this.searchTermChange.emit(this.searchTerm);
    this.showSuggestions = false;
  }

  onSuggestionClick(suggestion: Product): void {
    const translatedName = this.translate.instant(suggestion.translatedNameKey);
    this.searchTerm = translatedName;
    this.searchTermChange.emit(this.searchTerm);
    this.showSuggestions = false;
  }

  onInputBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  private updateSuggestions(term: string): void {
    if (term.length < 2) {
      this.suggestions = [];
      return;
    }

    const lowerTerm = term.toLowerCase();
    const keys = this.products.map((p) => p.translatedNameKey);

    this.translate
      .get(keys)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translations: Record<string, string>) => {
        this.suggestions = this.products.filter((product) => {
          const translatedName = translations[product.translatedNameKey] || '';
          return translatedName.toLowerCase().includes(lowerTerm);
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
