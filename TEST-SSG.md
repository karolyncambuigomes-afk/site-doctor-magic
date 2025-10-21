# 🧪 Guia Rápido de Teste SSG

## 1️⃣ Teste Local Rápido (2 minutos)

```bash
# 1. Build o projeto
npm run build

# 2. Serve localmente
npm run preview

# 3. Abrir navegador
open http://localhost:4173
```

### Verificações Visual:
- ✅ Página carrega normalmente
- ✅ Navegação funciona
- ✅ Estilos aplicados
- ✅ Imagens carregam

## 2️⃣ Verificar HTML Estático (30 segundos)

### No Navegador:
1. Abrir DevTools (F12)
2. Ir para "View Page Source" ou `Ctrl+U`
3. **Procurar por:**
   - `<h1>` tags com conteúdo real
   - `<meta name="description"` com texto
   - `<script type="application/ld+json">` com structured data
   - Conteúdo de texto visível no HTML (não apenas `<div id="root"></div>`)

### Via Terminal:
```bash
curl http://localhost:4173/ > output.html
cat output.html | grep "<h1>"
cat output.html | grep "Five London"
```

**Esperado**: Deve retornar várias linhas com conteúdo real.

## 3️⃣ Testar Rotas Específicas (2 minutos)

```bash
# Homepage
curl http://localhost:4173/ | grep -i "elite escort"

# About page
curl http://localhost:4173/about | grep -i "about"

# Location page
curl http://localhost:4173/escorts-in-mayfair | grep -i "mayfair"

# Services page  
curl http://localhost:4173/services | grep -i "services"
```

**Cada comando deve retornar conteúdo relevante.**

## 4️⃣ Verificar Dist Folder

```bash
ls -la dist/

# Deve mostrar:
# - index.html (homepage)
# - about/ (pasta com index.html)
# - services/ (pasta com index.html)
# - escorts-in-mayfair/ (pasta com index.html)
# - assets/ (JS e CSS)
```

### Inspecionar um arquivo HTML:
```bash
cat dist/index.html
```

**Deve conter:**
- ✅ HTML completo, não apenas shell
- ✅ Meta tags no `<head>`
- ✅ Conteúdo no `<div id="root">`
- ✅ Scripts no final do body

## 5️⃣ Teste de Hydration (1 minuto)

1. Abrir http://localhost:4173/
2. **Desabilitar JavaScript no DevTools:**
   - DevTools → Settings (⚙️) → Debugger → Disable JavaScript
3. Recarregar página
4. **Verificar:**
   - ✅ Conteúdo ainda visível (HTML estático)
   - ❌ Links não funcionam (sem JS)
   - ✅ Estilos aplicados

5. **Reabilitar JavaScript**
6. **Verificar:**
   - ✅ Tudo funciona normalmente
   - ✅ Navegação funciona
   - ✅ Console sem erros

## 6️⃣ Google Search Console Simulation

### Usar Fetch as Google (simulado):
```bash
# Instalar user-agent switcher
npm install -g user-agent-switcher

# Fetch como Googlebot
curl -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  http://localhost:4173/ > googlebot-view.html

# Abrir e verificar
cat googlebot-view.html
```

**Deve conter HTML completo com todo o conteúdo.**

## 7️⃣ Lighthouse Test

```bash
# Instalar Lighthouse CLI (se não tiver)
npm install -g lighthouse

# Rodar teste
lighthouse http://localhost:4173/ \
  --only-categories=seo,performance \
  --output=html \
  --output-path=./lighthouse-report.html

# Abrir report
open lighthouse-report.html
```

**Scores esperados:**
- SEO: 95-100
- Performance: 85-95
- Accessibility: 85-95

## 8️⃣ Rich Results Test

1. Fazer build e deploy (ou usar ngrok para tunnel local)
2. Ir para: https://search.google.com/test/rich-results
3. Colar URL
4. **Verificar:**
   - ✅ Structured data detectado
   - ✅ Organization schema válido
   - ✅ LocalBusiness schema válido
   - ✅ BreadcrumbList presente

## 9️⃣ Verificar Build Time

```bash
time npm run build
```

**Esperado:**
- Sem SSG: ~30-45 segundos
- Com SSG (77 páginas): ~2-5 minutos

**Se demorar mais de 10 minutos:** Há problema no build.

## 🔟 Checklist Final

Antes de fazer deploy para produção:

- [ ] `npm run dev` funciona normalmente (dev mode)
- [ ] `npm run build` completa sem erros
- [ ] `npm run preview` serve o site corretamente
- [ ] View-source mostra HTML completo (não shell vazio)
- [ ] Testar 5+ rotas diferentes (curl ou navegador)
- [ ] Console sem erros no navegador
- [ ] Hydration funciona (após load, SPA comportamento normal)
- [ ] Meta tags presentes em todas as páginas testadas
- [ ] Lighthouse SEO score > 90
- [ ] Dist folder contém múltiplas pastas (uma por rota)

## 🚨 Problemas Comuns

### Build falha com erro de "window is not defined"
**Fix**: Verificar se há código usando `window` fora de `useEffect` em algum componente.

### HTML vazio após build
**Fix**: 
1. Verificar se rota está na lista `prerender` em `_default.page.server.tsx`
2. Rodar `npm run build -- --debug` para ver logs detalhados

### Hydration mismatch warning
**Fix**: Garantir que primeira renderização no servidor e cliente sejam idênticas.

### Build muito lento (>10 min)
**Fix**: 
1. Reduzir número de rotas em `prerender`
2. Aumentar `parallel` em `+config.ts`
3. Verificar se há queries do Supabase muito lentas

### Página funciona em dev mas não em build
**Fix**: 
1. Verificar variáveis de ambiente no build
2. Testar com `npm run build && npm run preview`
3. Verificar console para erros de hydration

## ✅ Próximos Passos

Se todos os testes passarem:

1. **Deploy para Staging**
2. **Testar em produção**
3. **Submit sitemap para Google Search Console**
4. **Monitorar indexação (24-48h)**
5. **Verificar Google Analytics**
6. **Comemorar** 🎉

---

**Documentação completa**: Veja `SSG-README.md`
