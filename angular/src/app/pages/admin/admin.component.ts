import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../../core/news.service';
import { News } from '../../core/news.model';

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
  readonly editing = signal<number | undefined>(undefined);
  readonly panelOpen = signal(false);
  readonly sorted = computed(() =>
    [...this.service.news()].sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha)),
  );
  readonly stats = computed(() => {
    const states = this.sorted().map((news, index) => this.service.status(news, index).label);
    return ['Publicada', 'Borrador', 'Revisión'].map((label) =>
      String(states.filter((state) => state === label).length).padStart(2, '0'),
    );
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
    this.cancel();
    this.panelOpen.set(true);
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

  cancel(): void {
    this.editing.set(undefined);
    this.panelOpen.set(false);
    this.form.reset({ categoria: 'Educación' });
  }

  remove(id: number): void {
    if (window.confirm('¿Deseas eliminar esta noticia?')) this.service.remove(id);
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
}
