import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NewsService } from '../../core/news.service';
import { NewsCardComponent } from '../../shared/news-card/card';
import { latestFirst } from '../../core/news-utils';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NewsCardComponent],
  templateUrl: './news.html',
  styles: ':host { display: contents; }',
})
export class NewsComponent {
  readonly data = inject(NewsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly categories = ['Todas', 'Educación', 'Tecnología', 'Turismo', 'Comercio'];
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
            this.normalize(s).includes(this.normalize(this.search().trim())),
          ),
      )
      .sort(latestFirst),
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
  selectCategory(category: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { categoria: category === 'Todas' ? null : category },
      queryParamsHandling: 'merge',
    });
  }
}
