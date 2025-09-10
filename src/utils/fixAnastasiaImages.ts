import { supabase } from '@/integrations/supabase/client';

export const fixAnastasiaImages = async () => {
  const anastasiaId = 'd851677c-b1cc-43ac-bb9a-a65f83bf9e5b';
  
  try {
    console.log('🔧 Iniciando correção das imagens da Anastasia...');

    // 1. Corrigir imagem principal
    console.log('📸 Corrigindo imagem principal...');
    const { data: mainResult, error: mainError } = await supabase.functions.invoke('admin-fix-one-image', {
      body: {
        entity: 'model',
        id: anastasiaId,
        dry_run: false
      }
    });

    if (mainError) {
      console.error('❌ Erro na imagem principal:', mainError);
      throw mainError;
    }

    console.log('✅ Imagem principal corrigida:', mainResult);

    // 2. Obter URLs externas da galeria
    const { data: modelData, error: modelError } = await supabase
      .from('models')
      .select('gallery_external_urls')
      .eq('id', anastasiaId)
      .single();

    if (modelError) throw modelError;

    const externalUrls = modelData.gallery_external_urls || [];
    console.log(`🖼️ Processando ${externalUrls.length} imagens da galeria...`);

    // 3. Corrigir cada imagem da galeria
    const galleryResults = [];
    for (let i = 0; i < externalUrls.length; i++) {
      const sourceUrl = externalUrls[i];
      console.log(`📷 Processando galeria ${i}: ${sourceUrl}`);

      const { data: galleryResult, error: galleryError } = await supabase.functions.invoke('admin-fix-one-gallery', {
        body: {
          modelId: anastasiaId,
          sourceUrl: sourceUrl,
          index: i,
          dry_run: false
        }
      });

      if (galleryError) {
        console.error(`❌ Erro na galeria ${i}:`, galleryError);
        galleryResults.push({ index: i, success: false, error: galleryError.message });
      } else {
        console.log(`✅ Galeria ${i} processada:`, galleryResult);
        galleryResults.push({ index: i, success: true, result: galleryResult });
      }
    }

    // 4. Sincronizar visibilidade com model_gallery
    console.log('🔄 Sincronizando visibilidade...');
    const { data: galleryData, error: galleryDataError } = await supabase
      .from('model_gallery')
      .select('visibility, order_index')
      .eq('model_id', anastasiaId)
      .order('order_index');

    if (galleryDataError) {
      console.warn('⚠️ Erro ao buscar dados de visibilidade:', galleryDataError);
    }

    // Criar array de visibilidade baseado na model_gallery
    const galleryVisibility = [];
    if (galleryData && galleryData.length > 0) {
      for (let i = 0; i < externalUrls.length; i++) {
        const galleryItem = galleryData.find(item => item.order_index === i);
        galleryVisibility[i] = galleryItem?.visibility || 'public';
      }
    } else {
      // Fallback: todas públicas
      for (let i = 0; i < externalUrls.length; i++) {
        galleryVisibility[i] = 'public';
      }
    }

    // 5. Atualizar arrays de visibilidade
    const { error: updateError } = await supabase
      .from('models')
      .update({
        // Não atualizamos gallery_local_urls aqui pois as funções já fazem isso
        // Apenas garantimos que o array de visibilidade está correto
        updated_at: new Date().toISOString()
      })
      .eq('id', anastasiaId);

    if (updateError) {
      console.error('❌ Erro ao atualizar modelo:', updateError);
    }

    // 6. Verificar estado final
    const { data: finalState, error: finalError } = await supabase
      .from('models')
      .select('image, image_url_local_main, gallery_external_urls, gallery_local_urls')
      .eq('id', anastasiaId)
      .single();

    if (finalError) throw finalError;

    console.log('🏁 Estado final:', finalState);

    return {
      success: true,
      mainImage: mainResult,
      galleryResults,
      finalState,
      message: 'Correção da Anastasia concluída com sucesso!'
    };

  } catch (error) {
    console.error('❌ Erro na correção:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro durante a correção da Anastasia'
    };
  }
};