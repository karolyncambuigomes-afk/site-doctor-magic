import { supabase } from '@/integrations/supabase/client';

export const processAllPendingImages = async () => {
  try {
    console.log('🔄 Iniciando processamento de todas as imagens pendentes...');

    // 1. Buscar todos os modelos com gallery_external_urls
    const { data: models, error: modelsError } = await supabase
      .from('models')
      .select('id, name, gallery_external_urls, gallery_local_urls, image, image_url_local_main')
      .not('gallery_external_urls', 'is', null);

    if (modelsError) {
      throw modelsError;
    }

    console.log(`📊 Encontrados ${models.length} modelos com galerias externas`);

    const results = [];

    // 2. Processar cada modelo
    for (const model of models) {
      console.log(`\n🔄 Processando modelo: ${model.name} (${model.id})`);
      
      const externalUrls = model.gallery_external_urls || [];
      const localUrls = model.gallery_local_urls || [];
      
      console.log(`📸 URLs externas: ${externalUrls.length}`);
      console.log(`📱 URLs locais: ${localUrls.length}`);

      // 3. Processar imagem principal se não tiver local
      if (!model.image_url_local_main && model.image) {
        console.log('📷 Processando imagem principal...');
        try {
          const { data: mainResult, error: mainError } = await supabase.functions.invoke('admin-fix-one-image', {
            body: {
              entity: 'model',
              id: model.id,
              dry_run: false
            }
          });

          if (mainError) {
            console.error(`❌ Erro na imagem principal de ${model.name}:`, mainError);
          } else {
            console.log(`✅ Imagem principal de ${model.name} processada`);
          }
        } catch (error) {
          console.error(`❌ Erro ao processar imagem principal de ${model.name}:`, error);
        }
      }

      // 4. Processar cada imagem da galeria
      const galleryResults = [];
      for (let i = 0; i < externalUrls.length; i++) {
        const sourceUrl = externalUrls[i];
        const hasLocal = localUrls[i] && localUrls[i].trim() !== '';
        
        if (!hasLocal && sourceUrl) {
          console.log(`📷 Processando galeria ${i}: ${sourceUrl}`);
          
          try {
            const { data: galleryResult, error: galleryError } = await supabase.functions.invoke('admin-fix-one-gallery', {
              body: {
                modelId: model.id,
                sourceUrl: sourceUrl,
                index: i,
                dry_run: false
              }
            });

            if (galleryError) {
              console.error(`❌ Erro na galeria ${i} de ${model.name}:`, galleryError);
              galleryResults.push({ 
                index: i, 
                success: false, 
                error: galleryError.message,
                sourceUrl 
              });
            } else {
              console.log(`✅ Galeria ${i} de ${model.name} processada`);
              galleryResults.push({ 
                index: i, 
                success: true, 
                result: galleryResult,
                sourceUrl 
              });
            }
          } catch (error) {
            console.error(`❌ Erro ao processar galeria ${i} de ${model.name}:`, error);
            galleryResults.push({ 
              index: i, 
              success: false, 
              error: error.message,
              sourceUrl 
            });
          }
        } else if (hasLocal) {
          console.log(`✅ Galeria ${i} já tem versão local: ${localUrls[i]}`);
          galleryResults.push({ 
            index: i, 
            success: true, 
            skipped: true, 
            reason: 'Already has local version',
            sourceUrl 
          });
        }
      }

      results.push({
        modelId: model.id,
        modelName: model.name,
        galleryResults,
        totalExternal: externalUrls.length,
        totalLocal: localUrls.filter(url => url && url.trim() !== '').length
      });
    }

    // 5. Resumo final
    const totalModels = results.length;
    const totalProcessed = results.reduce((acc, model) => 
      acc + model.galleryResults.filter(r => r.success && !r.skipped).length, 0);
    const totalErrors = results.reduce((acc, model) => 
      acc + model.galleryResults.filter(r => !r.success).length, 0);
    const totalSkipped = results.reduce((acc, model) => 
      acc + model.galleryResults.filter(r => r.skipped).length, 0);

    console.log(`\n🏁 PROCESSAMENTO CONCLUÍDO:`);
    console.log(`📊 Modelos processados: ${totalModels}`);
    console.log(`✅ Imagens processadas: ${totalProcessed}`);
    console.log(`⏭️ Imagens já existentes: ${totalSkipped}`);
    console.log(`❌ Erros: ${totalErrors}`);

    return {
      success: true,
      summary: {
        totalModels,
        totalProcessed,
        totalErrors,
        totalSkipped
      },
      results,
      message: 'Processamento de imagens pendentes concluído!'
    };

  } catch (error) {
    console.error('❌ Erro no processamento geral:', error);
    return {
      success: false,
      error: error.message,
      message: 'Erro durante o processamento de imagens pendentes'
    };
  }
};