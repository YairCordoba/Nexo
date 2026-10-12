import { Component, computed, effect, inject, signal, viewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { NewsService } from '../../core/news.service';
import { NewsCardComponent } from '../../shared/news-card/card';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [RouterLink, NewsCardComponent],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class DetailComponent {
  readonly data = inject(NewsService);
  readonly id = signal(0);
  readonly item = computed(() => this.data.news().find((n) => n.id === this.id()));
  readonly related = computed(() =>
    this.data
      .news()
      .filter((n) => n.id !== this.id())
      .slice(0, 2),
  );
  readonly copy = viewChild<ElementRef<HTMLElement>>('copy');
  readonly text = viewChild<ElementRef<HTMLElement>>('text');
  readonly relatedElement = viewChild<ElementRef<HTMLElement>>('relatedElement');
  readonly textTop = signal(157);
  readonly relatedTop = signal(407);
  readonly backTop = signal(634);
  constructor() {
    const title = inject(Title);
    void this.data.load();
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed())
      .subscribe((p) => this.id.set(Number(p.get('id'))));
    effect((onCleanup) => {
      const item = this.item();
      if (item) title.setTitle(`${item.titulo} - Nexo Noticias`);
      const copy = this.copy()?.nativeElement,
        text = this.text()?.nativeElement,
        related = this.relatedElement()?.nativeElement;
      if (!copy || !text || !related) return;
      // Se mide el título para que el contenido variable conserve el espacio de lectura.
      let frame = 0;
      let disposed = false;
      const update = () => {
        if (disposed) return;
        const top = Math.max(157, copy.offsetHeight + 8);
        const relatedTop = Math.max(407, top + text.offsetHeight + 20);
        this.textTop.set(top);
        this.relatedTop.set(relatedTop);
        this.backTop.set(relatedTop + related.offsetHeight + 1);
      };
      const schedule = () => {
        cancelAnimationFrame(frame);
        if (!disposed) frame = requestAnimationFrame(update);
      };
      const observer = new ResizeObserver(schedule);
      [copy, text, related].forEach((element) => observer.observe(element));
      schedule();
      void document.fonts.ready.then(schedule);
      onCleanup(() => {
        disposed = true;
        observer.disconnect();
        cancelAnimationFrame(frame);
      });
    });
  }
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
