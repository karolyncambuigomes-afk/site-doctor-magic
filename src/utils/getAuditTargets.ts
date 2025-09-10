import { supabase } from '@/integrations/supabase/client';

export interface AuditTarget {
  id: string;
  name: string;
  category: 'hero' | 'models' | 'carousel' | 'blog' | 'slides';
  localUrl?: string;
  externalUrl?: string;
  effectiveUrl: string;
  tableName: string;
  fieldName: string;
}

export interface AuditTargetsResponse {
  targets: AuditTarget[];
  summary: {
    hero: number;
    models: number;
    carousel: number;
    blog: number;
    slides: number;
    total: number;
  };
}

export async function getAuditTargets(): Promise<AuditTargetsResponse> {
  const targets: AuditTarget[] = [];

  try {
    // 1. Hero principal (site_content)
    const { data: heroContent } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', 'homepage_hero_main')
      .eq('is_active', true)
      .single();

    if (heroContent) {
      const localUrl = heroContent.image_url_local_desktop || heroContent.image_url_local_fallback;
      const externalUrl = heroContent.image_url_desktop || heroContent.image_url;
      
      targets.push({
        id: heroContent.id,
        name: 'Homepage Hero',
        category: 'hero',
        localUrl,
        externalUrl,
        effectiveUrl: localUrl || externalUrl || '/placeholder.svg',
        tableName: 'site_content',
        fieldName: 'image_url_local_desktop'
      });
    }

    // 2. Hero slides
    const { data: heroSlides } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('active', true)
      .order('order_index');

    if (heroSlides) {
      heroSlides.forEach(slide => {
        const localUrl = slide.image_url_local_desktop || slide.image_url_local_mobile || slide.image_url_local_fallback;
        targets.push({
          id: slide.id,
          name: slide.title || `Hero Slide ${slide.order_index + 1}`,
          category: 'slides',
          localUrl,
          externalUrl: slide.image_url,
          effectiveUrl: localUrl || slide.image_url || '/placeholder.svg',
          tableName: 'hero_slides',
          fieldName: 'image_url_local_desktop'
        });
      });
    }

    // 3. Models ativos
    const { data: models } = await supabase
      .from('models')
      .select('id, name, image, image_url_local_main')
      .limit(50);

    if (models) {
      models.forEach(model => {
        if (model.image) {
          targets.push({
            id: model.id,
            name: model.name,
            category: 'models',
            localUrl: model.image_url_local_main,
            externalUrl: model.image,
            effectiveUrl: model.image_url_local_main || model.image || '/placeholder.svg',
            tableName: 'models',
            fieldName: 'image_url_local_main'
          });
        }
      });
    }

    // 4. Homepage Carousel
    const { data: carouselItems } = await supabase
      .from('homepage_carousel')
      .select('*')
      .eq('is_active', true)
      .order('order_index');

    if (carouselItems) {
      carouselItems.forEach(item => {
        targets.push({
          id: item.id,
          name: item.model_name || `Carousel Item ${item.order_index + 1}`,
          category: 'carousel',
          localUrl: item.image_url_local,
          externalUrl: item.image_url,
          effectiveUrl: item.image_url_local || item.image_url || '/placeholder.svg',
          tableName: 'homepage_carousel',
          fieldName: 'image_url_local'
        });
      });
    }

    // 5. Blog posts com imagem
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('id, title, image, image_url_local')
      .eq('is_published', true)
      .not('image', 'is', null);

    if (blogPosts) {
      blogPosts.forEach(post => {
        if (post.image) {
          targets.push({
            id: post.id,
            name: post.title,
            category: 'blog',
            localUrl: post.image_url_local,
            externalUrl: post.image,
            effectiveUrl: post.image_url_local || post.image || '/placeholder.svg',
            tableName: 'blog_posts',
            fieldName: 'image_url_local'
          });
        }
      });
    }

  } catch (error) {
    console.error('Error fetching audit targets:', error);
  }

  // Calcular summary
  const summary = {
    hero: targets.filter(t => t.category === 'hero').length,
    models: targets.filter(t => t.category === 'models').length,
    carousel: targets.filter(t => t.category === 'carousel').length,
    blog: targets.filter(t => t.category === 'blog').length,
    slides: targets.filter(t => t.category === 'slides').length,
    total: targets.length
  };

  return { targets, summary };
}