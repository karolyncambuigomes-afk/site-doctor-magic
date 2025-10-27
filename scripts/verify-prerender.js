import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const routes = [
  '/',
  '/models',
  '/locations',
  '/about',
  '/services',
  '/blog',
  '/contact',
  '/faq',
  '/join-us',
  '/reviews',
];

console.log('\n🔍 Verificando pre-renderização...\n');
console.log(`📁 Diretório dist: ${distDir}\n`);

let allValid = true;
let successCount = 0;
let failCount = 0;

routes.forEach(route => {
  const filePath = route === '/' 
    ? path.join(distDir, 'index.html')
    : path.join(distDir, route.slice(1), 'index.html');
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${route.padEnd(20)} - Arquivo não encontrado`);
    failCount++;
    allValid = false;
    return;
  }
  
  const html = fs.readFileSync(filePath, 'utf-8');
  const htmlSize = (html.length / 1024).toFixed(2);
  
  // Verificar se tem conteúdo renderizado
  const hasContent = html.includes('<h1') || html.includes('<h2') || html.includes('<section');
  const hasReactRoot = html.includes('id="root"');
  const hasStructuredData = html.includes('application/ld+json');
  
  if (hasContent && hasReactRoot) {
    console.log(`✅ ${route.padEnd(20)} - ${htmlSize}KB ${hasStructuredData ? '(+JSON-LD)' : ''}`);
    successCount++;
  } else {
    console.log(`⚠️  ${route.padEnd(20)} - HTML vazio ou incompleto`);
    failCount++;
    allValid = false;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Sucesso: ${successCount}/${routes.length}`);
console.log(`❌ Falhas: ${failCount}/${routes.length}`);
console.log('='.repeat(50) + '\n');

if (allValid) {
  console.log('🎉 Todos os arquivos pre-renderizados com sucesso!\n');
} else {
  console.log('⚠️  Alguns arquivos falharam na pre-renderização.\n');
}

process.exit(allValid ? 0 : 1);
