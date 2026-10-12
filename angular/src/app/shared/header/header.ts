import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  readonly router = inject(Router);
  readonly open = signal(false);
  readonly url = signal(this.router.url);
  get category(): boolean {
    return this.url().includes('categoria=');
  }
  isActive(path: string): boolean {
    const current = this.url().split('?')[0];
    return current === path || (path === '/noticias' && current === '/detalle');
  }
  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url.set(event.urlAfterRedirects);
        this.open.set(false);
      }
    });
  }
}
