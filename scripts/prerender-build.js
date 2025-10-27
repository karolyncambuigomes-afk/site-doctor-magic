import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🚀 Iniciando build com pré-renderização...\n');

// Step 1: Build normal do Vite
console.log('📦 Executando build do Vite...\n');

const viteBuild = spawn('vite', ['build'], { 
  stdio: 'inherit',
  shell: true 
});

viteBuild.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Build falhou com código ${code}\n`);
    process.exit(code);
  }

  console.log('\n✅ Build do Vite concluído!\n');
  console.log('📝 Criando páginas pré-renderizadas...\n');

  // Step 2: Criar estrutura de diretórios para pre-render
  const distDir = path.resolve(__dirname, '../dist');
  const routes = [
    '/models',
    '/locations',
    '/about',
    '/services',
    '/blog',
    '/contact',
    '/faq',
    '/join-us',
    '/reviews',
    '/locations/mayfair',
    '/locations/knightsbridge',
    '/locations/chelsea',
    '/locations/belgravia',
    '/locations/marylebone',
    '/locations/south-kensington',
    '/locations/notting-hill',
    '/locations/covent-garden',
    '/locations/canary-wharf',
    '/locations/city-of-london',
    '/locations/westminster',
    '/locations/kensington',
  ];

  const baseIndexPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(baseIndexPath)) {
    console.error('❌ index.html não encontrado em dist/\n');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(baseIndexPath, 'utf-8');
  let successCount = 0;

  routes.forEach(route => {
    const routePath = path.join(distDir, route);
    const indexPath = path.join(routePath, 'index.html');

    try {
      // Criar diretório se não existir
      if (!fs.existsSync(routePath)) {
        fs.mkdirSync(routePath, { recursive: true });
      }

      // Copiar index.html base para o diretório da rota
      // (O conteúdo será renderizado pelo React no client-side, mas o Googlebot verá a estrutura)
      let routeHtml = baseHtml;

      // Adicionar meta tags específicas da rota (básico)
      const routeTitle = route
        .split('/')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).replace(/-/g, ' '))
        .join(' | ');

      if (routeTitle) {
        routeHtml = routeHtml.replace(
          /<title>.*?<\/title>/,
          `<title>${routeTitle} | Five London</title>`
        );
        routeHtml = routeHtml.replace(
          /<meta name="description" content=".*?">/,
          `<meta name="description" content="${routeTitle} - Elite escort services in London by Five London.">`
        );
      }

      fs.writeFileSync(indexPath, routeHtml);
      console.log(`✅ ${route.padEnd(30)} - Criado`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${route.padEnd(30)} - Erro: ${error.message}`);
    }
  });

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Pré-renderização concluída: ${successCount}/${routes.length}`);
  console.log('='.repeat(50) + '\n');

  if (successCount === routes.length) {
    console.log('🎉 Build completo com sucesso!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Alguns arquivos falharam\n');
    process.exit(1);
  }
});

viteBuild.on('error', (error) => {
  console.error(`\n❌ Erro ao executar build: ${error.message}\n`);
  process.exit(1);
});
