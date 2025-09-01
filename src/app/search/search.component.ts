import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnDestroy,
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
export class SearchComponent implements OnDestroy {
  private _searchTerm = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private translate = inject(TranslateService);
  private http = inject(HttpClient);
  @Output() searchTermChange = new EventEmitter<string>();
  suggestions: Product[] = [];
  showSuggestions = false;
  private products: Product[] = [];

  constructor() {
    this.http.get<Product[]>('/assets/products.json').subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.updateSuggestions(term);
      });
  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value.trim();
    this.showSuggestions = this._searchTerm.length >= 2;
    this.searchSubject.next(this._searchTerm);
  }

  onSearch(): void {
    if (this._searchTerm.length < 2) return;
    this.searchTermChange.emit(this._searchTerm);
    this.showSuggestions = false;
  }

  onSuggestionClick(suggestion: Product): void {
    this._searchTerm = this.translate.instant(suggestion.translatedNameKey);
    this.searchTermChange.emit(this._searchTerm);
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
      this.showSuggestions = false;
      return;
    }
    const lowerTerm = term.toLowerCase();
    this.translate
      .get(this.products.map((p) => p.translatedNameKey))
      .subscribe((translations) => {
        this.suggestions = this.products.filter((product) =>
          translations[product.translatedNameKey]
            .toLowerCase()
            .includes(lowerTerm)
        );
        this.showSuggestions = true;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
