import { Injectable, signal } from '@angular/core';
import { News } from './news.model';
import { todayDate } from './news-utils';

const NEWS_KEY = 'nexoNoticiasBD';
const VERSION_KEY = 'nexoNoticiasDataVersion';
const VERSION = 'figma-parity-v2';
const FAVORITES_KEY = 'nexoNoticiasFavoritos';

@Injectable({ providedIn: 'root' })
export class NewsService {
  readonly news = signal<News[]>([]);
  readonly favorites = signal<News[]>(this.read(FAVORITES_KEY) ?? []);
  readonly error = signal('');
  readonly loaded = signal(false);
  private request?: Promise<void>;

  // El JSON inicia el catálogo; las modificaciones se conservan en este navegador.
  async load(): Promise<void> {
    if (this.loaded()) return;
    if (this.request) return this.request;
    this.request = this.loadData();
    await this.request;
    this.request = undefined;
  }

  private async loadData(): Promise<void> {
    const cached = this.read(NEWS_KEY);
    try {
      this.error.set('');
      if (cached && localStorage.getItem(VERSION_KEY) === VERSION) {
        this.news.set(cached);
      } else {
        const response = await fetch(new URL('src/data/noticias.json', document.baseURI));
        if (!response.ok) throw new Error('No se pudo cargar el archivo de noticias.');
        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error('El catálogo de noticias no es válido.');
        const base = data as News[];
        const merged = cached
          ? cached.map((item) => ({
              ...item,
              imagen: base.find((n) => n.id === item.id)?.imagen || item.imagen || '',
            }))
          : [...base];
        if (cached)
          base.forEach((item) => {
            if (!cached.some((n) => n.id === item.id)) merged.push(item);
          });
        this.persist(merged);
      }
      this.loaded.set(true);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Error al cargar las noticias.');
    }
  }

  save(input: Omit<News, 'id' | 'fecha' | 'destacada'>, id?: number): News {
    const existing = this.news().find((item) => item.id === id);
    const item: News = {
      ...input,
      id: existing?.id ?? Math.max(0, ...this.news().map((n) => n.id)) + 1,
      fecha: existing?.fecha ?? todayDate(),
      destacada: existing?.destacada ?? false,
    };
    this.persist(
      existing ? this.news().map((n) => (n.id === id ? item : n)) : [...this.news(), item],
    );
    this.persistFavorites(this.favorites().map((n) => (n.id === item.id ? item : n)));
    return item;
  }

  remove(id: number): void {
    this.persist(this.news().filter((item) => item.id !== id));
    this.persistFavorites(this.favorites().filter((item) => item.id !== id));
  }

  toggle(item: News): void {
    this.persistFavorites(
      this.isFavorite(item.id)
        ? this.favorites().filter((n) => n.id !== item.id)
        : [...this.favorites(), item],
    );
  }

  isFavorite(id: number): boolean {
    return this.favorites().some((item) => item.id === id);
  }

  image(item: Pick<News, 'imagen'>): string {
    const path = item.imagen?.trim() || 'src/assets/images/stock/educacion.jpg';
    return /^(?:https?:|data:|blob:|\/)/i.test(path) ? path : new URL(path, document.baseURI).href;
  }

  private persist(items: News[]): void {
    this.news.set(items);
    localStorage.setItem(NEWS_KEY, JSON.stringify(items));
    localStorage.setItem(VERSION_KEY, VERSION);
  }

  private persistFavorites(items: News[]): void {
    this.favorites.set(items);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  }

  private read(key: string): News[] | null {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
      return Array.isArray(value) ? (value as News[]) : null;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }
}
