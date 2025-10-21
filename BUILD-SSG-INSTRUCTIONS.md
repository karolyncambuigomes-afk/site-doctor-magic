# 📦 Build Instructions for SSG (Static Site Generation)

## Quick Start

Para fazer o build de produção com SSG completo:

```bash
npm run build
```

Isso irá:
1. ✅ Buscar automaticamente todos os modelos do Supabase
2. ✅ Gerar rotas dinâmicas para cada modelo
3. ✅ Pré-renderizar todas as páginas estáticas + dinâmicas
4. ✅ Criar HTML completo com conteúdo real (não apenas `<div id="root"></div>`)

---

## Testar o Build Localmente

Após o build, você pode testar localmente:

```bash
npm run preview
```

Depois acesse `http://localhost:4173` e:
1. Clique com botão direito → **"View Page Source"**
2. Verifique que o HTML contém o conteúdo real da página
3. Procure por texto específico (ex: "Five London", nomes de modelos, etc.)

---

## Verificar que o SSG está Funcionando

### ✅ Método 1: View Source

```bash
# Abra no navegador e faça View Source
http://localhost:4173/
http://localhost:4173/models/[algum-id]
```

**O que você deve ver:**
```html
<body>
  <div id="root">
    <div class="min-h-screen">
      <nav>...</nav>
      <section>
        <h1>Five London - Elite Escort Agency</h1>
        <!-- TODO O CONTEÚDO REAL AQUI -->
      </section>
    </div>
  </div>
</body>
```

**❌ Se estiver quebrado, você verá:**
```html
<body>
  <div id="root"></div>
  <!-- Só isso, sem conteúdo -->
</body>
```

### ✅ Método 2: curl

```bash
curl http://localhost:4173/ | grep "Five London"
curl http://localhost:4173/models | grep "models"
```

Se retornar resultados, está funcionando!

### ✅ Método 3: Google Search Console

Após deploy em produção:
1. Acesse [Google Search Console](https://search.google.com/search-console)
2. Use a ferramenta **"URL Inspection"**
3. Digite a URL do seu site
4. Clique em **"Test Live URL"**
5. Verifique que o Google vê o conteúdo completo

---

## Estrutura do Build Output

Após `npm run build`, a pasta `dist/` terá:

```
dist/
├── index.html                    ← Homepage com conteúdo real
├── about/
│   └── index.html               ← Página About com conteúdo real
├── models/
│   ├── index.html               ← Lista de modelos
│   ├── [model-id-1]/
│   │   └── index.html           ← Perfil do modelo 1 (pré-renderizado!)
│   ├── [model-id-2]/
│   │   └── index.html           ← Perfil do modelo 2 (pré-renderizado!)
│   └── ...
├── locations/
│   ├── escorts-in-mayfair/
│   │   └── index.html
│   └── ...
├── characteristics/
│   ├── blonde-escorts/
│   │   └── index.html
│   └── ...
├── assets/
│   ├── js/
│   │   ├── main-[hash].js
│   │   └── ...
│   └── css/
│       └── main-[hash].css
└── ...
```

**Importante:** Cada `index.html` deve conter o conteúdo completo da página!

---

## Como Funciona a Geração Dinâmica de Rotas

### Durante o Build:

1. **Vike chama** `onBeforePrerenderStart()` no arquivo `src/renderer/_default.page.server.tsx`
2. **Função busca** todos os IDs de modelos do Supabase
3. **Gera array** de rotas: `['/models/uuid-1', '/models/uuid-2', ...]`
4. **Combina** com rotas estáticas (about, services, etc.)
5. **Vike renderiza** cada rota para HTML estático
6. **Salva** no `dist/` com estrutura de pastas

### No Cliente (Browser):

1. **HTML estático** é servido imediatamente
2. **JavaScript hidrata** a página (adiciona interatividade)
3. **React Router** assume controle da navegação
4. **App continua** funcionando como SPA normal

---

## Variáveis de Ambiente Necessárias

Para o build funcionar, certifique-se que estas variáveis estão definidas:

```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

Se não estiverem disponíveis durante o build:
- ⚠️ Rotas de modelos não serão geradas
- ✅ Rotas estáticas continuarão funcionando
- ⚠️ Console mostrará warning

---

## Troubleshooting

### Problema: "No models found"

**Causa:** Variáveis de ambiente não disponíveis ou tabela vazia

**Solução:**
```bash
# Verifique se as variáveis estão definidas
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Se não estiverem, adicione ao .env ou export:
export VITE_SUPABASE_URL="https://xxx.supabase.co"
export VITE_SUPABASE_ANON_KEY="eyJxxx..."

# Depois execute o build novamente
npm run build
```

### Problema: Build demora muito

**Normal!** Com 77+ rotas estáticas + N modelos, o build pode levar 2-5 minutos.

**Otimizações:**
- Build é feito apenas uma vez para deploy
- Não afeta desenvolvimento (dev mode continua rápido)
- Rotas são cacheadas no CDN

### Problema: Página nova não aparece

**Causa:** Conteúdo foi adicionado após o último build

**Solução:**
- Rebuild é necessário para incluir novos modelos/conteúdo
- Configure CI/CD para rebuild automático diário
- Ou rebuild manual quando adicionar novos modelos

---

## Deploy

O output do `dist/` pode ser deployed em qualquer plataforma:

- **Lovable Hosting** (recomendado) - automático
- **Vercel** - `vercel deploy`
- **Netlify** - `netlify deploy`
- **AWS S3 + CloudFront**
- **Cloudflare Pages**
- Qualquer servidor estático

---

## Scripts Úteis

```bash
# Development (não usa SSG)
npm run dev

# Build de produção com SSG
npm run build

# Preview do build local
npm run preview

# Testar geração de rotas de modelos
npx tsx scripts/test-model-routes.ts

# Gerar rotas de modelos manualmente (salva em model-routes.json)
npx tsx scripts/generate-model-routes.ts
```

---

## Performance Esperada

### Antes (SPA sem SSG):
- ⏱️ First Contentful Paint: ~2.5s
- 🔍 SEO: Google vê apenas "Loading..."
- 📊 Lighthouse SEO: ~70/100

### Depois (Com SSG):
- ⚡ First Contentful Paint: ~0.8s (3x mais rápido!)
- ✅ SEO: Google vê conteúdo completo
- 📈 Lighthouse SEO: ~95-100/100

---

## Monitoramento

Após deploy, monitore:

1. **Google Search Console**
   - Páginas indexadas devem aumentar
   - Erros de rastreamento devem diminuir
   - Core Web Vitals devem melhorar

2. **Lighthouse**
   - SEO score: 95-100
   - Performance: 90+
   - Accessibility: 90+

3. **Analytics**
   - Bounce rate pode diminuir
   - Tempo na página pode aumentar
   - Conversões podem melhorar

---

## FAQ

**P: Preciso rebuildar quando adiciono um novo modelo?**
R: Sim, para que a página do modelo seja pré-renderizada. Configure rebuild automático no CI/CD.

**P: O site continuará funcionando sem SSG?**
R: Sim! As rotas não pré-renderizadas funcionam como SPA normal (client-side rendering).

**P: Posso desabilitar SSG?**
R: Sim, remova o plugin `vike` do `vite.config.ts`. Mas você perderá os benefícios de SEO.

**P: SSG funciona com conteúdo dinâmico (reviews, etc.)?**
R: O HTML inicial é estático, mas o JavaScript hidrata e atualiza com dados reais após load.

---

🎉 **Pronto!** Seu site agora tem SSG completo e o Google conseguirá ler todo o conteúdo!
