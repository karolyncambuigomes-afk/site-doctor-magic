/**
 * Script para executar a migração de localizações
 * 
 * COMO USAR:
 * 1. Abra o console do navegador (F12) na aplicação
 * 2. Execute este código diretamente no console:
 * 
 * const { migrateLocations } = await import('./utils/migrateLocations');
 * const result = await migrateLocations();
 * console.log('Migração concluída:', result);
 * 
 * Ou cole este arquivo inteiro no console do navegador quando estiver autenticado como admin
 */

import { migrateLocations } from './migrateLocations';

console.log('🔧 Preparando migração de localizações...');
console.log('⚠️  Certifique-se de estar autenticado como admin!');

// Executar a migração
migrateLocations()
  .then(result => {
    console.log('✅ Migração concluída com sucesso!');
    console.log('📊 Resultado:', result);
  })
  .catch(error => {
    console.error('❌ Erro durante a migração:', error);
  });
