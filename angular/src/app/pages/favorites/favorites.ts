import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../core/news.service';
import { NewsCardComponent } from '../../shared/news-card/card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, NewsCardComponent],
  templateUrl: './favorites.html',
  styles: ':host { display: contents; }',
})
export class FavoritesComponent {
  readonly data = inject(NewsService);
}
