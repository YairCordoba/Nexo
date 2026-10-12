import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../../core/news.service';
import { News } from '../../core/news.model';
import { latestFirst, formatNewsDate } from '../../core/news-utils';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.css', './admin.component.css'],
})
export class AdminComponent {
  readonly service = inject(NewsService);
  private readonly builder = inject(FormBuilder);
  private readonly injector = inject(Injector);
  readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  readonly newButton = viewChild<ElementRef<HTMLButtonElement>>('newButton');
  readonly editing = signal<number | undefined>(undefined);
  readonly panelOpen = signal(false);
  readonly sorted = computed(() => [...this.service.news()].sort(latestFirst));
  readonly stats = computed(() => {
    return [
      this.service.news().length,
      new Set(this.service.news().map((news) => news.categoria)).size,
      this.service.favorites().length,
    ].map((value) => String(value).padStart(2, '0'));
  });
  readonly form = this.builder.nonNullable.group({
    titulo: ['', [Validators.required, Validators.pattern(/\S/)]],
    categoria: ['Educación', Validators.required],
    autor: ['', [Validators.required, Validators.pattern(/\S/)]],
    imagen: [''],
    resumen: ['', [Validators.required, Validators.pattern(/\S/)]],
    contenido: ['', [Validators.required, Validators.pattern(/\S/)]],
  });

  constructor() {
    void this.service.load();
  }

  create(): void {
    this.cancel(false);
    this.panelOpen.set(true);
    this.focusEditor();
  }

  edit(news: News): void {
    this.editing.set(news.id);
    this.form.reset({
      titulo: news.titulo,
      categoria: news.categoria,
      autor: news.autor,
      imagen: news.imagen,
      resumen: news.resumen,
      contenido: news.contenido,
    });
    this.panelOpen.set(true);
    this.focusEditor();
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const values = this.form.getRawValue();
    this.service.save(
      {
        ...values,
        titulo: values.titulo.trim(),
        autor: values.autor.trim(),
        imagen: values.imagen.trim(),
        resumen: values.resumen.trim(),
        contenido: values.contenido.trim(),
      },
      this.editing(),
    );
    const message = this.editing()
      ? 'Noticia actualizada correctamente.'
      : 'Noticia creada correctamente.';
    this.cancel();
    window.alert(message);
  }

  cancel(returnFocus = true): void {
    this.editing.set(undefined);
    this.panelOpen.set(false);
    this.form.reset({ categoria: 'Educación' });
    if (returnFocus)
      afterNextRender(() => this.newButton()?.nativeElement.focus(), { injector: this.injector });
  }

  remove(id: number): void {
    if (window.confirm('¿Deseas eliminar esta noticia?')) this.service.remove(id);
  }

  readonly meta = formatNewsDate;
  private focusEditor(): void {
    afterNextRender(
      () => {
        this.panel()?.nativeElement.scrollIntoView({ block: 'start' });
        this.panel()
          ?.nativeElement.querySelector<HTMLInputElement>('#titulo')
          ?.focus({ preventScroll: true });
      },
      { injector: this.injector },
    );
  }
}
