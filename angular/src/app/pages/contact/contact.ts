import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  readonly sent = signal(false);
  readonly sending = signal(false);
  readonly form = inject(FormBuilder).nonNullable.group({
    nombre: [
      '',
      [Validators.required, Validators.pattern(/\S(?:[\s\S]*\S)?/), Validators.minLength(3)],
    ],
    correo: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
  });
  invalid(name: 'nombre' | 'correo' | 'mensaje'): boolean {
    const field = this.form.controls[name];
    return field.touched && field.invalid;
  }
  async submit(): Promise<void> {
    if (this.sending()) return;
    for (const field of Object.values(this.form.controls)) field.setValue(field.value.trim());
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    // El prototipo confirma el mensaje localmente mientras no exista un servicio de envío.
    this.sending.set(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.sent.set(true);
    this.sending.set(false);
    this.form.reset();
  }
}
