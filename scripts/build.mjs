import { mkdir, copyFile } from 'node:fs/promises';
const files = ['index.html', 'styles.css', 'app.js', 'favicon.svg', 'src/copy.js', 'src/taskStore.js', 'src/timer.js'];
for (const file of files) {
  await mkdir(`dist/${file.split('/').slice(0, -1).join('/')}`, { recursive: true });
  await copyFile(file, `dist/${file}`);
}
console.log(`Built ${files.length} public assets in dist/ (no logs, Git history, or account data).`);
