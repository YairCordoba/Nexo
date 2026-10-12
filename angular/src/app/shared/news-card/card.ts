import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { News } from '../../core/news.model';
import { NewsService } from '../../core/news.service';
import { formatNewsDate } from '../../core/news-utils';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class NewsCardComponent {
  readonly news = input.required<News>();
  readonly variant = input('list');
  readonly data = inject(NewsService);
  readonly meta = formatNewsDate;
  fallback(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith('/educacion.jpg')) image.src = this.data.image({ imagen: '' });
  }
}
