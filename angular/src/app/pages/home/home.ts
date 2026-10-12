import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../core/news.service';
import { NewsCardComponent } from '../../shared/news-card/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NewsCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  readonly data = inject(NewsService);
  readonly principal = computed(
    () => this.data.news().find((n) => n.destacada) || this.data.news()[0],
  );
  readonly restantes = computed(() =>
    this.data
      .news()
      .filter((n) => n.id !== this.principal()?.id)
      .slice(0, 3),
  );
  constructor() {
    void this.data.load();
  }
  fallback(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith('/educacion.jpg')) image.src = this.data.image({ imagen: '' });
  }
}
