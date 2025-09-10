import { migrateBlogDataToDatabase } from './migrateBlogData';
import { toast } from 'sonner';

export const runBlogMigration = async () => {
  console.log('🚀 Iniciando migração automática dos artigos do blog...');
  
  try {
    const result = await migrateBlogDataToDatabase();
    
    if (result.success) {
      console.log('✅ Migração concluída com sucesso!');
      console.log(`📊 ${result.migratedCount} artigos migrados`);
      toast.success(`Migração concluída! ${result.migratedCount} artigos migrados com sucesso.`);
      return result;
    } else {
      console.error('❌ Erro na migração:', result.message);
      toast.error(`Erro na migração: ${result.message}`);
      return result;
    }
  } catch (error) {
    console.error('❌ Erro inesperado na migração:', error);
    toast.error('Erro inesperado durante a migração');
    throw error;
  }
};

// Auto-execute migration on import in development
if (typeof window !== 'undefined') {
  runBlogMigration().catch(console.error);
}