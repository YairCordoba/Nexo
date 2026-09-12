# Informe Final del Proyecto
**Nexo Noticias: Plataforma Web Académica**

## 1. Introducción
El presente documento expone el desarrollo de la aplicación web "Nexo Noticias", un periódico digital concebido bajo los principios de la ingeniería de software y el diseño centrado en el usuario (UX/UI). 

## 2. Marco Teórico y Metodológico
El desarrollo se basó en el paradigma de Front-End tradicional utilizando las especificaciones de HTML5, CSS3 (con Flexbox y Grid) y JavaScript ES6+. Se aplicó el concepto de separación de responsabilidades (SoC), garantizando que la estructura, la presentación y el comportamiento residan en capas independientes.

## 3. Decisiones de Diseño y Arquitectura
- **Diseño Visual:** Se adoptó un enfoque neutro y editorial. Se limitó el uso de animaciones, colores extravagantes y sombras exageradas (como el glassmorphism) para mantener la credibilidad y el profesionalismo propios de un periódico digital.
- **Persistencia de Datos:** Dada la ausencia de un backend real (al tratarse de una primera fase de prototipo), se optó por el uso de `localStorage` y la API `fetch` para consumir un archivo estático JSON.
- **Escalabilidad:** El código modular (por ejemplo, `utils.js`, `favoritos.js`, `noticias.js`) facilita la migración hacia componentes manejables por frameworks modernos como Angular en una etapa posterior.

## 4. Conclusiones
El proyecto "Nexo Noticias" cumple satisfactoriamente con los requisitos funcionales y no funcionales establecidos inicialmente. La aplicación es completamente responsiva, accesible y provee una experiencia de usuario intuitiva.

## 5. Referencias
- MDN Web Docs. (2026). *JavaScript*. Mozilla.
- W3C. (2026). *HTML5 Specification*.
- Nielsen, J. (1994). *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group.
