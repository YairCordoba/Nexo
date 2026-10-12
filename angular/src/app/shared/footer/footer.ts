import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  host: { '[class.contact-footer]': 'contact()' },
})
export class FooterComponent {
  readonly home = input(false);
  readonly contact = input(false);
  readonly catalog = input(false);
}
