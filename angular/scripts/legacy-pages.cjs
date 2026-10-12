const fs = require('node:fs');
const path = require('node:path');

// Pages debe entregar un archivo antes de que Angular pueda redirigir un enlace antiguo.
const destination = path.join(__dirname, '../dist/nexo/browser/src/pages');
fs.mkdirSync(destination, { recursive: true });
for (const page of ['noticias', 'detalle', 'favoritos', 'contacto', 'admin']) {
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Nexo Noticias</title></head>
<body><p>Abriendo Nexo…</p><a href="../../#/${page}">Continuar</a>
<script>location.replace('../../#/${page}' + location.search);</script></body></html>`;
  fs.writeFileSync(path.join(destination, page + '.html'), html);
}
