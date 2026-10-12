import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
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
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);
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
  @HostListener('document:keydown.escape')
  closeWithEscape(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.element.nativeElement.querySelector<HTMLButtonElement>('#navToggle')?.focus();
  }

  @HostListener('document:click', ['$event'])
  closeOutside(event: MouseEvent): void {
    if (
      this.open() &&
      event.target instanceof Node &&
      !this.element.nativeElement.contains(event.target)
    )
      this.open.set(false);
  }
}
