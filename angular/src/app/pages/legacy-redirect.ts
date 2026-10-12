import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({ selector: 'app-legacy-redirect', standalone: true, template: '' })
export class LegacyRedirectComponent {
  constructor() {
    const route = inject(ActivatedRoute);
    const page = route.snapshot.paramMap.get('page')?.replace('.html', '');
    const target = ['noticias', 'detalle', 'favoritos', 'contacto', 'admin'].includes(page ?? '')
      ? page
      : '';
    void inject(Router).navigate(['/' + target], {
      queryParams: route.snapshot.queryParams,
      replaceUrl: true,
    });
  }
}
