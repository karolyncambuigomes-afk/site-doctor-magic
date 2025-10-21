# Static Site Generation (SSG) Implementation

## 🎯 Overview

Este projeto agora utiliza **Static Site Generation (SSG)** com `vike` (anteriormente `vite-plugin-ssr`) para pré-renderizar todas as páginas em HTML estático durante o build.

## ✅ Benefícios

- **SEO Perfeito**: Google vê todo o conteúdo HTML real imediatamente, não apenas "Loading..."
- **Meta Tags no HTML Inicial**: Todas as meta tags, títulos e structured data estão presentes no HTML
- **Performance Melhorada**: First Contentful Paint muito mais rápido
- **Melhor Indexação**: Crawlers podem ler o conteúdo sem executar JavaScript
- **Manter SPA**: Após o load inicial, o site funciona como SPA normal com todas as interações React

## 📁 Estrutura de Arquivos SSG

```
src/
├── renderer/
│   ├── _default.page.server.tsx   # Renderização no servidor (build time)
│   ├── _default.page.client.tsx   # Hydration no cliente
│   └── +config.ts                 # Configuração do vike
├── entry-dev.tsx                   # Entry point para desenvolvimento
└── main.tsx                        # Export para vike
```

## 🚀 Como Funciona

### Desenvolvimento (Dev Mode)
```bash
npm run dev
```
- Usa `entry-dev.tsx` como entry point
- Funciona como SPA normal
- Hot Module Replacement ativo
- Sem pré-renderização

### Build de Produção
```bash
npm run build
```

**O que acontece:**
1. Vike lê a lista de rotas em `src/renderer/_default.page.server.tsx`
2. Para cada rota, executa `ReactDOMServer.renderToString()` 
3. Extrai meta tags do `react-helmet-async`
4. Gera arquivos HTML estáticos em `dist/`
5. Cada página tem conteúdo completo no HTML inicial

**Output esperado:**
```
dist/
├── index.html                          # Homepage com conteúdo real
├── about/
│   └── index.html                      # Página About com conteúdo real
├── models/
│   └── index.html                      # Lista de modelos
├── escorts-in-mayfair/
│   └── index.html                      # Página de localização
└── assets/
    ├── js/
    └── css/
```

### Preview
```bash
npm run preview
```
- Testa o build de produção localmente
- Verifica que HTML estático foi gerado corretamente

## 🔍 Validação

### 1. Verificar HTML Local
```bash
npm run build
npm run preview
# Acessar view-source:localhost:4173
```

Você deve ver conteúdo HTML completo, não apenas `<div id="root"></div>`

### 2. Testar com curl
```bash
curl http://localhost:4173/ | grep "Five London"
```
Deve retornar conteúdo real da página.

### 3. Google Search Console
- **URL Inspection Tool**: Verificar que Google vê conteúdo
- **Rich Results Test**: Validar structured data
- **Mobile-Friendly Test**: Confirmar responsiveness

### 4. Lighthouse
```bash
npm run build
npx serve dist
# Rodar Lighthouse no Chrome DevTools
```

**Métricas esperadas:**
- SEO Score: 95-100
- Performance: 90+
- Accessibility: 90+
- First Contentful Paint: < 1.5s

## 📋 Rotas Pré-Renderizadas

Todas as rotas estão definidas em `src/renderer/_default.page.server.tsx`:

- ✅ 15 páginas estáticas principais (`/`, `/about`, `/services`, etc.)
- ✅ 23 páginas de localização
- ✅ 34 páginas de características
- ✅ 5 posts de blog

**Total: 77+ páginas pré-renderizadas**

## 🔄 Adicionando Novas Rotas

Para adicionar novas páginas ao SSG:

1. Abra `src/renderer/_default.page.server.tsx`
2. Adicione a rota no array `prerender`:
```typescript
const prerender = [
  '/',
  '/about',
  '/sua-nova-rota',  // ← Adicione aqui
  // ...
];
```
3. Rebuild o projeto

## ⚡ Conteúdo Dinâmico

### Páginas de Modelos Individuais

**Problema**: Modelos são dinâmicos e podem ser adicionados/removidos.

**Solução Atual**: 
- Página `/models` é pré-renderizada com lista vazia
- Client-side hydration busca modelos do Supabase
- Páginas individuais `/models/:id` funcionam como SPA

**Solução Futura (Avançada)**:
```typescript
// scripts/generate-model-routes.ts
import { createClient } from '@supabase/supabase-js';

async function generateModelRoutes() {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  );
  
  const { data: models } = await supabase
    .from('models')
    .select('id');
    
  return models?.map(model => `/models/${model.id}`) || [];
}
```

Adicionar ao package.json:
```json
{
  "scripts": {
    "generate-routes": "tsx scripts/generate-model-routes.ts",
    "build": "npm run generate-routes && vite build"
  }
}
```

## 🚨 Considerações Importantes

### SSR-Safety
Componentes devem ser "SSR-safe":

❌ **Não fazer:**
```typescript
const data = localStorage.getItem('key'); // window não existe no servidor
```

✅ **Fazer:**
```typescript
const [data, setData] = useState(null);

useEffect(() => {
  const stored = localStorage.getItem('key');
  setData(stored);
}, []);
```

### Service Worker
O ServiceWorker é desabilitado durante SSR:
```typescript
const isClient = typeof window !== 'undefined';
{isClient && <ConditionalFeatures />}
```

### API Calls
Queries do Supabase funcionam no build time se:
- Variáveis de ambiente estão configuradas
- Acesso à internet está disponível
- RLS policies permitem acesso público (para dados públicos)

### Build Time
- **Sem SSG**: ~30 segundos
- **Com SSG (77 páginas)**: ~2-5 minutos
- Isso é normal e esperado

### Rebuild
Quando adicionar novos:
- Modelos
- Posts de blog  
- Páginas

É necessário **rebuild completo** para gerar novo HTML estático.

**Solução**: 
- CI/CD com rebuild automático diário
- Webhook do Supabase para trigger rebuild
- Incremental Static Regeneration (ISR) - implementação futura

## 🎯 Resultado Esperado

### Antes (SPA Puro)
```html
<!-- view-source:https://fivelondon.com/ -->
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

**Google vê**: "Loading..." ou página vazia

### Depois (SSG)
```html
<!-- view-source:https://fivelondon.com/ -->
<body>
  <div id="root">
    <nav class="navigation">
      <a href="/">Five London</a>
      <!-- TODA A NAVEGAÇÃO -->
    </nav>
    <section class="hero">
      <h1>Elite Escort Agency in London</h1>
      <p>Premium companionship services...</p>
      <!-- TODO O CONTEÚDO REAL -->
    </section>
    <!-- MAIS CONTEÚDO -->
  </div>
  <script type="module" src="/assets/main-abc123.js"></script>
</body>
```

**Google vê**: Todo o conteúdo real imediatamente! ✅

## 📚 Recursos

- [Vike Documentation](https://vike.dev)
- [React Server Components](https://react.dev/reference/react/use-server)
- [Google Search Console](https://search.google.com/search-console)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## 🐛 Troubleshooting

### Build falha com "window is not defined"
**Causa**: Código tentando acessar APIs do navegador no servidor.

**Solução**: Envolver em `useEffect` ou check:
```typescript
if (typeof window !== 'undefined') {
  // código que usa window
}
```

### HTML não contém conteúdo após build
**Causa**: 
1. Rota não está na lista `prerender`
2. Componente tem erro durante SSR
3. Query do Supabase falha no build time

**Debug**:
```bash
npm run build -- --debug
```

### Hydration mismatch warning
**Causa**: HTML do servidor diferente do HTML do cliente.

**Solução**: Garantir que renderização inicial seja idêntica.

## ✅ Checklist de Deploy

- [ ] `npm run build` completa sem erros
- [ ] `npm run preview` mostra conteúdo no view-source
- [ ] Testar 5-10 páginas diferentes no view-source
- [ ] Google Search Console mostra conteúdo indexado
- [ ] Lighthouse score SEO > 95
- [ ] Meta tags presentes em todas as páginas
- [ ] Structured data válido (Rich Results Test)
- [ ] Mobile responsiveness OK
- [ ] Performance metrics aceitáveis

---

**Status**: ✅ SSG Implementado e Pronto para Deploy

**Última atualização**: 2025-10-21
