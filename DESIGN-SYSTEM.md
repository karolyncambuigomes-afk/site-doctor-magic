# Five London - Design System Documentation

## 📏 Spacing System (Espaçamentos)

### Main Content Sections
- **Padrão:** `py-12 md:py-16 lg:py-20`
- **Resultado:** 48px (mobile) / 64px (tablet) / 80px (desktop)
- **Uso:** Seções principais de conteúdo após headers
- **Páginas:** Index, Blog, Services, Membership, FAQ, Contact, Reviews, etc.

### Hero Sections
- **Padrão:** `pt-20 pb-16 md:py-24`
- **Resultado:** 80px top, 64px bottom (mobile) / 96px (tablet/desktop)
- **Uso:** Headers de página com H1 principal + separador
- **Páginas:** Blog, Services, Membership, Characteristics, Locations

### Secondary Sections
- **Padrão:** `py-8 md:py-12`
- **Resultado:** 32px (mobile) / 48px (tablet/desktop)
- **Uso:** Subsections, categorias, filtros
- **Exemplo:** Blog categories section

### CTA Sections
- **Padrão:** `py-12 md:py-20 lg:py-24`
- **Resultado:** 48px / 80px / 96px
- **Uso:** Call-to-action final das páginas
- **Exemplo:** Contact sections, booking CTAs

### Card Spacing
- **Padrão:** `p-6 md:p-8`
- **Resultado:** 24px / 32px
- **Uso:** Padding interno de cards e containers

## 🎨 Typography System

### Heading Classes
```css
luxury-heading-display: 48px (desktop) - Hero banners principais
luxury-heading-xl:      36px (desktop) - H1 de página
luxury-heading-lg:      30px (desktop) - H2 seções principais
luxury-heading-md:      24px (desktop) - H3 sub-seções
luxury-heading-sm:      20px (desktop) - H4 títulos menores
```

### Body Text Classes
```css
luxury-body-lg:  18px (desktop) - Parágrafos introdutórios
luxury-body-md:  16px (desktop) - Texto padrão (ideal para leitura)
luxury-body-sm:  14px (desktop) - Texto secundário
luxury-body-xs:  12px (desktop) - Labels e captions
```

### Responsive Breakpoints
- **Mobile:** base (< 768px)
- **Tablet:** md (768px)
- **Desktop:** lg (1024px)
- **Large Desktop:** xl (1280px)

## 🎨 Color Palette

### Primary Colors
```css
--luxury-navy: 220 39% 11%
--luxury-gold: 45 93% 58%
--luxury-cream: 60 9% 98%
--primary: 222.2 47.4% 11.2%
--background: 0 0% 100%
--foreground: 222.2 84% 4.9%
```

### Semantic Colors
```css
--muted: 210 40% 96%
--accent: 210 40% 96%
--border: 214.3 31.8% 91.4%
--destructive: 0 84.2% 60.2%
--secondary: 210 40% 96.1%
```

### Usage Guidelines
- **SEMPRE** use variáveis CSS (ex: `bg-background`, `text-foreground`)
- **NUNCA** use cores diretas (ex: `bg-white`, `text-black`, `bg-gray-100`)
- **Exception:** Componentes que precisam de contraste específico podem usar `bg-black`, `text-white` para luxury branding

## 🧩 Components

### Buttons
- **Primary:** `bg-black text-white hover:bg-gray-800`
- **Secondary:** `border border-black text-black hover:bg-black hover:text-white`
- **Spacing:** `px-6 py-3`
- **Typography:** `font-medium tracking-wider uppercase text-sm`
- **Transitions:** `transition-smooth`

### Cards
- **Standard:** `border border-border/30 rounded-lg p-6 md:p-8 hover:shadow-elegant`
- **Luxury:** `shadow-luxury rounded-lg p-6 md:p-8 hover:shadow-elegant transition-luxury`
- **Grid Spacing:** `gap-4 sm:gap-6 md:gap-8`

### Separators
- **Elegant Line:** `w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent`
- **Simple:** `border-t border-border/30`

### Links
- **Standard:** `text-foreground hover:text-primary transition-smooth`
- **Luxury:** `relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full`

## 📐 Layout System

### Container Widths
```css
container-width:    max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
container-width-lg: max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8
```

### Grid Systems
- **Models Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8`
- **Two Column:** `grid md:grid-cols-2 gap-8`
- **Three Column:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Blog Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8`

## ⚡ Transitions & Animations

### Standard Transitions
```css
transition-smooth:  all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
transition-luxury:  all 0.4s cubic-bezier(0.23, 1, 0.320, 1)
```

### Hover Effects
```css
hover-lift: transition-luxury hover:-translate-y-1 hover:shadow-luxury
hover-glow: hover:shadow-[0_0_20px_rgba(var(--primary),_0.3)]
```

### Available Animations
- `animate-fade-in` - Fade in with slight upward movement
- `animate-slide-in-left` - Slide in from left
- `animate-slide-in-right` - Slide in from right
- `animate-scale-in` - Scale in from 95% to 100%

## 📱 Responsive Guidelines

### Mobile First Approach
- Sempre começar com mobile (base)
- Adicionar `md:` para tablet (768px+)
- Adicionar `lg:` para desktop (1024px+)
- Adicionar `xl:` para large desktop (1280px+)

### Hero Section Responsive
- **Mobile:** `pt-20 pb-16` - Altura mínima com texto menor
- **Desktop:** `md:py-24` - Altura maior com texto ampliado

### Navigation
- **Mobile:** Hamburger menu com sheet
- **Desktop:** Horizontal menu com dropdowns

### Typography Responsive
```css
luxury-heading-display: text-4xl md:text-5xl lg:text-6xl
luxury-heading-xl:      text-3xl md:text-4xl lg:text-5xl
luxury-heading-lg:      text-2xl md:text-3xl lg:text-4xl
luxury-heading-md:      text-xl md:text-2xl lg:text-3xl
```

## ✅ Consistency Rules

### Quando Usar Cada Espaçamento

#### `py-12 md:py-16 lg:py-20` (PRINCIPAL)
✅ **USE para:**
- Seções principais de conteúdo
- Gallery sections
- Content blocks após hero
- Main feature sections
- Service descriptions
- About sections

❌ **NÃO USE para:**
- Hero sections (use `pt-20 pb-16 md:py-24`)
- CTA sections (use `py-12 md:py-20 lg:py-24`)
- Subsections (use `py-8 md:py-12`)

#### `pt-20 pb-16 md:py-24` (HERO)
✅ **USE para:**
- Hero sections com H1 + subtitle
- Página headers
- Banner sections no topo

❌ **NÃO USE para:**
- Seções de conteúdo normal

#### `py-12 md:py-20 lg:py-24` (CTA)
✅ **USE para:**
- Contact sections finais
- Call-to-action sections
- Booking prompts
- Newsletter signups

❌ **NÃO USE para:**
- Hero sections
- Conteúdo regular

#### `py-8 md:py-12` (SECUNDÁRIO)
✅ **USE para:**
- Category filters
- Tag clouds
- Secondary navigation
- Subsections dentro de main sections

## 🎯 Typography Rules

### Headings Hierarchy
```
H1: luxury-heading-xl      (Apenas UM por página - SEO critical)
H2: luxury-heading-lg      (Seções principais)
H3: luxury-heading-md      (Sub-seções)
H4: luxury-heading-sm      (Títulos menores)
```

### Body Text Hierarchy
```
Intro:     luxury-body-lg    (Parágrafos de abertura, leads)
Standard:  luxury-body-md    (Texto principal de leitura)
Secondary: luxury-body-sm    (Metadata, captions)
Labels:    luxury-body-xs    (Form labels, tags)
```

### Typography Don'ts
❌ **NUNCA USE:**
- Classes Tailwind diretas como `text-2xl`, `text-lg`
- Font sizes em px ou rem inline
- Multiple H1s na mesma página
- Headings fora de ordem (H1 → H3 sem H2)

## 🔍 Quality Checklist

Antes de aprovar qualquer nova página/seção:

### Spacing
- [ ] Hero section usa `pt-20 pb-16 md:py-24`
- [ ] Main sections usam `py-12 md:py-16 lg:py-20`
- [ ] CTA sections usam `py-12 md:py-20 lg:py-24`
- [ ] Cards usam `p-6 md:p-8`
- [ ] Grids usam `gap-4 sm:gap-6 md:gap-8`

### Typography
- [ ] Apenas UM H1 por página usando `luxury-heading-xl`
- [ ] H2s usam `luxury-heading-lg`
- [ ] Body text usa classes `luxury-body-*`
- [ ] Sem classes Tailwind diretas (`text-2xl`, etc)
- [ ] Hierarquia de headings respeitada (H1 → H2 → H3)

### Layout
- [ ] Containers usam `container-width` ou `container-width-lg`
- [ ] Padding horizontal `px-4 sm:px-6 lg:px-8`
- [ ] Responsive breakpoints corretos (md, lg, xl)

### Colors
- [ ] Cores usando variáveis CSS (`bg-background`, `text-foreground`)
- [ ] Sem cores diretas (`bg-white`, `text-black`) exceto luxury branding
- [ ] Contraste adequado para acessibilidade

### Transitions
- [ ] Hover states definidos
- [ ] Transições usando `transition-smooth` ou `transition-luxury`
- [ ] Animações suaves e naturais

### Components
- [ ] Separadores elegantes entre seções quando apropriado
- [ ] Buttons consistentes com design system
- [ ] Cards seguem padrão estabelecido
- [ ] Links com hover states

### SEO
- [ ] Apenas um H1 por página
- [ ] Alt text em todas as imagens
- [ ] Semantic HTML (section, article, nav, etc)
- [ ] Meta descriptions apropriadas

## 📝 Maintenance Notes

### Quando Atualizar Este Documento
- Ao adicionar novos componentes
- Ao criar novos padrões de espaçamento
- Ao modificar breakpoints
- Ao adicionar novas classes de tipografia
- Ao mudar paleta de cores
- Ao criar novos padrões de animação

### Como Adicionar Novo Componente
1. Documentar no arquivo apropriado
2. Criar variantes usando `class-variance-authority`
3. Usar variáveis CSS para cores
4. Seguir padrões de espaçamento
5. Adicionar exemplos de uso
6. Atualizar este documento

### Versionamento
- **Versão Atual:** 1.0.0
- **Última Atualização:** 2025-11-07
- **Próxima Revisão:** Quando necessário ou a cada 3 meses

## 🚀 Quick Reference

### Common Patterns

**Standard Page Structure:**
```tsx
<section className="pt-20 pb-16 md:py-24">  {/* Hero */}
  <div className="container-width">
    <h1 className="luxury-heading-xl">Title</h1>
    <p className="luxury-body-lg">Subtitle</p>
  </div>
</section>

<section className="py-12 md:py-16 lg:py-20">  {/* Main Content */}
  <div className="container-width">
    <h2 className="luxury-heading-lg">Section</h2>
    <p className="luxury-body-md">Content</p>
  </div>
</section>

<section className="py-12 md:py-20 lg:py-24">  {/* CTA */}
  <div className="container-width">
    <Button>Action</Button>
  </div>
</section>
```

**Card Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
  <Card className="p-6 md:p-8 hover:shadow-elegant transition-luxury">
    {/* content */}
  </Card>
</div>
```

**Elegant Separator:**
```tsx
<div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
```

---

**Mantido por:** Five London Development Team  
**Contato:** Para sugestões ou atualizações, consulte a equipe de desenvolvimento  
**Documentação Relacionada:** Ver `/src/index.css` para implementação das classes