import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NewsService } from '../../core/news.service';
import { NewsCardComponent } from '../../shared/news-card/card';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NewsCardComponent],
  templateUrl: './news.html',
  styles: ':host { display: contents; }',
})
export class NewsComponent {
  readonly data = inject(NewsService);
  readonly categories = ['Todas', 'Educación', 'Tecnología', 'Turismo'];
  readonly category = signal('Todas');
  readonly search = signal('');
  readonly filtered = computed(() =>
    this.data
      .news()
      .filter(
        (n) =>
          this.category() === 'Todas' ||
          this.normalize(n.categoria) === this.normalize(this.category()),
      )
      .filter(
        (n) =>
          !this.search() ||
          [n.titulo, n.resumen, n.categoria].some((s) =>
            s.toLowerCase().includes(this.search().toLowerCase().trim()),
          ),
      )
      .sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha)),
  );
  constructor() {
    void this.data.load();
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed())
      .subscribe((params) =>
        this.category.set(
          this.categories.find(
            (c) => this.normalize(c) === this.normalize(params.get('categoria') || ''),
          ) || 'Todas',
        ),
      );
  }
  normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
  updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
