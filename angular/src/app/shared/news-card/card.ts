import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { News } from '../../core/news.model';
import { NewsService } from '../../core/news.service';

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
  meta(value: string): string {
    const date = new Date(value);
    const months = [
      'ENE',
      'FEB',
      'MAR',
      'ABR',
      'MAY',
      'JUN',
      'JUL',
      'AGO',
      'SEP',
      'OCT',
      'NOV',
      'DIC',
    ];
    return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
  fallback(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith('/educacion.jpg')) image.src = this.data.image({ imagen: '' });
  }
}
