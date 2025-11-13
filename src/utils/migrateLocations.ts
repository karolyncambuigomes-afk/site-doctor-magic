import { supabase } from "@/integrations/supabase/client";
import { locations } from "@/data/locations";

/**
 * Script de migração para popular as localizações no Supabase
 * Converte o conteúdo HTML de locations.ts em blocos JSON
 */
export async function migrateLocations() {
  console.log('🚀 Iniciando migração de localizações...');
  console.log(`📍 Total de localizações a processar: ${locations.length}`);
  
  let inserted = 0;
  let updated = 0;
  let errors = 0;
  
  for (const location of locations) {
    try {
      // Converter o HTML content em blocos JSON simples
      const blocks = [{
        type: 'text',
        content: location.content
      }];
      
      const locationData = {
        name: location.name,
        seo_path: location.id,
        description: location.description,
        meta_description: location.seoDescription,
        seo_keywords: location.keywords,
        blocks: blocks,
        is_active: true,
        order_index: locations.indexOf(location)
      };
      
      // Verificar se já existe
      const { data: existing } = await supabase
        .from('locations')
        .select('id, blocks')
        .eq('seo_path', location.id)
        .maybeSingle();
      
      if (existing) {
        // Se já existe e não tem blocos, atualizar
        if (!existing.blocks || existing.blocks.length === 0 || existing.blocks === '[]') {
          const { error } = await supabase
            .from('locations')
            .update({ 
              blocks: blocks,
              description: locationData.description,
              meta_description: locationData.meta_description,
              seo_keywords: locationData.seo_keywords,
              order_index: locationData.order_index
            })
            .eq('id', existing.id);
          
          if (error) throw error;
          console.log(`✏️  Atualizado: ${location.name}`);
          updated++;
        } else {
          console.log(`⏭️  Pulado (já tem conteúdo): ${location.name}`);
        }
      } else {
        // Inserir nova localização
        const { error } = await supabase
          .from('locations')
          .insert(locationData);
        
        if (error) throw error;
        console.log(`✅ Inserido: ${location.name}`);
        inserted++;
      }
      
    } catch (error) {
      console.error(`❌ Erro ao processar ${location.name}:`, error);
      errors++;
    }
  }
  
  console.log('\n📊 Resumo da migração:');
  console.log(`✅ Inseridas: ${inserted}`);
  console.log(`✏️  Atualizadas: ${updated}`);
  console.log(`❌ Erros: ${errors}`);
  console.log(`📍 Total: ${locations.length}`);
  
  return {
    inserted,
    updated,
    errors,
    total: locations.length
  };
}

// Para executar diretamente no console do navegador:
// import { migrateLocations } from './utils/migrateLocations'
// migrateLocations().then(result => console.log('Migração concluída:', result))
